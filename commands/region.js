import culture from '../culture.js'
import location from '../template/location.js'
import cheerio from 'cheerio'
import axios from 'axios'

export default async (event) => {
  const k = event.message.text.replace('!r ', '')
  const replies = []

  try {
    for (let i = 0; i < culture.length; i++) {
      if (culture[i].AddressArea === k) {
        replies.push({
          Caption: culture[i].Caption,
          DetailUrl: culture[i].DetailUrl,
          Venue: culture[i].Venue,
          EndDateVM: {
            Date: culture[i].EndDateVM.Date,
            Week: culture[i].EndDateVM.Week
          }
        })
      }
    }
    console.log(replies)
    if (replies.length === 0) {
      event.reply('查無資料')
    } else {
      console.log(replies)
      replies.sort(function () {
        return (0.5 - Math.random())
      })

      for (let i = 0; i < 5; i++) {
        if (replies[i] === null || replies[i] === undefined || replies[i] === '') {
          location.contents.contents[i].hero.url = 'https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip10.jpg'
          location.contents.contents[i].hero.action.uri = 'http://linecorp.com/'
          location.contents.contents[i].body.action.uri = 'http://linecorp.com/'
          location.contents.contents[i].body.contents[0].text = '無'
          location.contents.contents[i].body.contents[1].contents[0].contents[0].text = '無'
          location.contents.contents[i].body.contents[2].contents[0].contents[0].text = '無'
        } else {
          const { data } = await axios.get(`https://cultureexpress.taipei/${replies[i].DetailUrl}`)
          const $ = cheerio.load(data)
          location.contents.contents[i].hero.url = `https://cultureexpress.taipei/${$('#block').find('img').eq(0).attr('src')}`
          location.contents.contents[i].hero.action.uri = `https://cultureexpress.taipei/${replies[i].DetailUrl}`
          location.contents.contents[i].body.action.uri = `https://cultureexpress.taipei/${replies[i].DetailUrl}`
          location.contents.contents[i].body.contents[0].text = replies[i].Caption
          location.contents.contents[i].body.contents[1].contents[0].contents[0].text = replies[i].Venue
          location.contents.contents[i].body.contents[2].contents[0].contents[0].text = `${replies[i].EndDateVM.Date}${replies[i].EndDateVM.Week}`
        }
      }

      event.reply(location)
    }
  } catch (error) {
    console.log(error)
    event.reply('錯誤')
  }
}

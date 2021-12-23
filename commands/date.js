import culture from '../culture.js'
import location from '../template/location.js'
import cheerio from 'cheerio'
import axios from 'axios'

export default async (event) => {
  const replies = []
  try {
    for (let i = 0; i < culture.length; i++) {
      const d = Number(culture[i].EndDateVM.Date.replace(/\//g, '')) + 19110000
      const newday = d.toString()
      const dString = newday.slice(0, 4) + '/' + newday.slice(4, 6) + '/' + newday.slice(6)
      const t1 = new Date().getTime()
      const t2 = new Date(dString).getTime()
      const result = t2 - t1

      if (result < 2592000000 && result > 0) {
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
    replies.sort(function () {
      return (0.5 - Math.random())
    })

    for (let i = 0; i < 5; i++) {
      const { data } = await axios.get(`https://cultureexpress.taipei/${replies[i].DetailUrl}`)
      const $ = cheerio.load(data)
      location.contents.contents[i].hero.url = `https://cultureexpress.taipei/${$('#block').find('img').eq(0).attr('src')}`
      location.contents.contents[i].hero.action.uri = `https://cultureexpress.taipei/${replies[i].DetailUrl}`
      location.contents.contents[i].body.action.uri = `https://cultureexpress.taipei/${replies[i].DetailUrl}`
      location.contents.contents[i].body.contents[0].text = replies[i].Caption
      location.contents.contents[i].body.contents[1].contents[0].contents[0].text = replies[i].Venue
      location.contents.contents[i].body.contents[2].contents[0].contents[0].text = `${replies[i].EndDateVM.Date}${replies[i].EndDateVM.Week}`
    }

    event.reply(location)
  } catch (error) {
    console.log(error)
    event.reply('錯誤')
  }
}

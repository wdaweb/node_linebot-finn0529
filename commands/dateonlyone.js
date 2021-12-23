import culture from '../culture.js'
import flex from '../template/flex.js'
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
          },
          Latitude: culture[i].Latitude,
          Longitude: culture[i].Longitude

        })
      }
    }

    const number = Math.round(Math.random() * replies.length)
    console.log(number)
    const { data } = await axios.get(`https://cultureexpress.taipei/${replies[number].DetailUrl}`)
    const $ = cheerio.load(data)
    flex.contents.hero.url = `https://cultureexpress.taipei/${$('#block').find('img').eq(0).attr('src')}`
    flex.contents.hero.action.uri = `https://cultureexpress.taipei/${replies[number].DetailUrl}`
    flex.contents.body.contents[0].text = replies[number].Caption
    flex.contents.body.contents[1].contents[0].contents[1].text = replies[number].Venue
    flex.contents.body.contents[1].contents[1].contents[1].text = `${replies[number].EndDateVM.Date}${replies[number].EndDateVM.Week}`
    flex.contents.footer.contents[0].action.uri = `https://cultureexpress.taipei/${replies[number].DetailUrl}`
    flex.contents.footer.contents[1].action.uri = `http://maps.google.com/?q=${replies[number].Latitude},${replies[number].Longitude}`

    event.reply(flex)
  } catch (error) {
    console.log(error)
    event.reply('錯誤')
  }
}

import culture from '../culture.js'
import flex from '../template/flex.js'
import axios from 'axios'
import cheerio from 'cheerio'

export default async (event) => {
  try {
    const number = event.message.text
    const { data } = await axios.get(`https://cultureexpress.taipei/${culture[number].DetailUrl}`)
    const $ = cheerio.load(data)
    flex.contents.hero.url = `https://cultureexpress.taipei/${$('#block').find('img').eq(0).attr('src')}`
    flex.contents.hero.action.uri = `https://cultureexpress.taipei/${culture[number].DetailUrl}`
    flex.contents.body.contents[0].text = culture[number].Caption
    flex.contents.body.contents[1].contents[0].contents[1].text = culture[number].Venue
    flex.contents.body.contents[1].contents[1].contents[1].text = `${culture[number].EndDateVM.Date}${culture[number].EndDateVM.Week}${culture[number].EndDateVM.Time}`
    flex.contents.footer.contents[0].action.uri = `https://cultureexpress.taipei/${culture[number].DetailUrl}`
    flex.contents.footer.contents[1].action.uri = `http://maps.google.com/?q=${culture[number].Latitude},${culture[number].Longitude}`
    //   // replies.push(culture[number].Caption)名稱
    //   // replies.push(culture[number].Venue)地點
    //   // replies.push(`${culture[number].EndDateVM.Date}${culture[number].EndDateVM.Week}${culture[number].EndDateVM.Time}`)時間
    //   // replies.push(`${culture[number].Longitude},${culture[number].Latitude}`)座標
    //   // replies.push(`https://cultureexpress.taipei/${culture[number].DetailUrl}`)網站
    event.reply(flex)
  } catch (error) {
    console.log(error)
    event.reply('錯誤')
  }
}

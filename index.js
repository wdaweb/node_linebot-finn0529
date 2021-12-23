import 'dotenv/config'
import linebot from 'linebot'
// import flex from './commands/flex.js'
import free from './commands/free.js'
import near from './commands/near.js'
import region from './commands/region.js'
import date from './commands/date.js'
import dateonlyone from './commands/dateonlyone.js'

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.on('message', async (event) => {
  if (event.message.type === 'text') {
    if (event.message.text === '免費') {
      free(event)
    } else if (event.message.text.startsWith('!r ')) {
      region(event)
    } else if (event.message.text === '近期') {
      date(event)
    } else if (event.message.text === '推薦') {
      dateonlyone(event)
    } else if (event.message.text === 'help') {
      const help = ['輸入近期=>近期展覽', '輸入免費=>近期免費展覽', '輸入推薦=>隨機推薦展覽', '輸入!r+鄉鎮市區=>輸入地址附近的展覽', '傳送目前位置=>附近展覽']
      event.reply(help)
    }
  }
  if (event.message.type === 'location') {
    near(event)
  }
})

bot.listen('/', process.env.PORT || 3000, () => {
  console.log('機器人啟動')
})

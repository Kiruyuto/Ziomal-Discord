import DCJS, { Intents } from 'discord.js'
import WOK from 'wokcommands'
import path from 'path'
import 'dotenv/config'
import ID from './Utils/id'

const client = new DCJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
    allowedMentions: {
      roles: [],
    },
})

client.setMaxListeners(0)


client.on('ready', () => {
    const guild = client.guilds.cache.get(ID.GUILD)
    if(!guild) { return console.error('Guild not found') }

    // @ts-ignore
    DCJS.Message.prototype.del = function () {
      if (this.deletable) {
        try {
          this.delete()
        } catch (ignored) {}
      }
    }

  new WOK(client, {
    commandDir: path.join(__dirname, 'Commands'), 
    featureDir: path.join(__dirname, 'Features'),
    testServers: ID.GUILD_TEST, 
    botOwners: ID.KIRU, 
    delErrMsgCooldown: 5, 
    ignoreBots: true,
    typeScript: true, 
    mongoUri: process.env.MONGO_URI,
    // The fields below should be commented when using on prod servers
    //debug: true, // Display more information in the console
    //showWarns: true, // Display warnings in the console

  })
  .setDefaultPrefix('!') 
  .setColor('#531D89')
  .setDisplayName('Ziomalsss') 

  //To do wyjebania będzie, "!help" do przepisania w całości 
  .setCategorySettings([
    {
      name: 'Utility',
      emoji: '🔧',
    },
  ])
  const guildCounter  = client.guilds.cache.size
  console.log(`\n${client.user?.tag} is online!\nCurrently used in: ${guildCounter} guild${guildCounter === 1 ? '' : 's'}!\n`)
})

const token = process.env.DC_TOKEN
if (!token) {
  throw new Error('No token found!\nProvide a token in the .env file!')
}
client.login(token)
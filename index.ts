//Important stuff
import DCJS, { Intents } from 'discord.js'
import dotenv from 'dotenv'
import WOK from 'wokcommands'
import path from 'path'
import 'dotenv/config'
import ID from './Assets/id'

//Intents definition, add or remove as needed
const client = new DCJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ]
})


//"ready" event and WOK settings - see WOK commands documentation for more info
client.on('ready', () => {
    const guild = client.guilds.cache.get(ID.GUILD)
    if(!guild) { return console.error('Guild not found') }

  new WOK(client, {
    commandDir: path.join(__dirname, 'Commands'), // Sets the command directory
    testServers: ID.GUILD_TEST, // Sets the test servers
    botOwners: ID.KIRU, // Sets the bot owner
    delErrMsgCooldown: 5, // Sets the timer to delete the error message
    ignoreBots: true, // Our bot will ignore commands from other bots 
    typeScript: true, //Using ts-node
    // Database settings
    mongoUri: process.env.MONGO_URI,
    dbOptions: {
      keepAlive: true, // Docs state that this setting is enabled by default but I prefer it to be declared anyway
    },
    // The fields below should be commented when using on prod servers
    debug: true, // Display more information in the console
    showWarns: true, // Display warnings in the console

  })
  .setDefaultPrefix('!') 
  .setColor('#531D89') // Color for the embeds
  .setDisplayName('Ziomalsss') // Bot's name displayed in the embeds
  .setCategorySettings([
    {
      name: 'Utility',
      emoji: '🔧',
    },
  ])
  const guildCounter  = client.guilds.cache.size
  console.log(`\n${client.user?.tag} is online!\nCurrently used in: ${guildCounter} guild${guildCounter === 1 ? '' : 's'}!\n`)
})

client.login(process.env.DC_TOKEN)
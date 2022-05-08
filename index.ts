import DCJS, { Intents } from 'discord.js'
import { DisTube, YouTubeDLPlugin } from 'distube'
import WOK from 'wokcommands'
import path from 'path'
import ID from './Utils/id'
import 'dotenv/config'


const client = new DCJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ],
    allowedMentions: {
      roles: [],
      repliedUser: false,
    },
    presence: {
      status: "dnd",
      activities: [{
        name: 'Lost Ark',
        type: 'PLAYING',
    }]
    },
    restTimeOffset: 0,

})

// Unlimited event listeners
client.setMaxListeners(0) 

// Distube options - details in docs
export const distube = new DisTube(client, {
  emitNewSongOnly: false,
  leaveOnEmpty: true,
  leaveOnFinish: false,
  leaveOnStop: true,
  savePreviousSongs: true,
  searchSongs: 0,
  //youtubeCookie: process.env.YOUTUBE_COOKIE,
  youtubeDL: true,
  updateYouTubeDL: true,
  ytdlOptions: {
    highWaterMark: 1024 * 1024 * 64,
    quality: 'highestaudio',
  },
  searchCooldown: 30,
  emptyCooldown: 300,
  nsfw: true,
  emitAddSongWhenCreatingQueue: true,
  emitAddListWhenCreatingQueue: true,
  plugins: [ 
    new YouTubeDLPlugin() 
  ],
})

client.on('ready', () => {
    const guild = client.guilds.cache.get(ID.GUILD)
    if(!guild) { return console.error('Guild not found') }

    //WOK CLIENT
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
  .setDisplayName('Ziomal')

  const guildCounter  = client.guilds.cache.size
  console.log(`\n${client.user?.tag} is online!\nCurrently used in: ${guildCounter} guild${guildCounter === 1 ? '' : 's'}!\n`)
})


const token = process.env.DC_TOKEN
if (!token) { throw new Error('No token found!\nProvide a token in the .env file!') }
client.login(token)
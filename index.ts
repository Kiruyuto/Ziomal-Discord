import DCJS, { Channel, Intents, Message } from 'discord.js'
import { DisTube } from 'distube'
import { YtDlpPlugin } from '@distube/yt-dlp'
import WOK from 'wokcommands-fixed'
import path from 'path'
import ID from './assets/id'
import 'dotenv/config'
import emojis from './assets/emojis';
import colorList from './assets/colors';
import { MessageEmbed } from 'discord.js';


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
  savePreviousSongs: false,
  searchSongs: 0,
  //youtubeCookie: process.env.YOUTUBE_COOKIE,
  youtubeDL: false,
  ytdlOptions: {
    filter: 'audioonly',
    highWaterMark: 1024 * 1024 * 64,
    quality: 'highestaudio',
    dlChunkSize: 1024 * 1024 * 64,
    liveBuffer: 60000,
  },
  searchCooldown: 30,
  emptyCooldown: 300,
  nsfw: true,
  emitAddSongWhenCreatingQueue: true,
  emitAddListWhenCreatingQueue: true,
  plugins: [ 
    new YtDlpPlugin(), 
  ],
})

client.on('ready', () => {
    const guild = client.guilds.cache.get(ID.GUILD)
    if(!guild) { return console.error('Guild not found') }

    const wok = new WOK(client, {
      commandDir: path.join(__dirname, 'commands'), 
      featureDir: path.join(__dirname, 'features'),
      messagesPath: path.join(__dirname, 'languages/langs.json'),
      defaultLanguage: 'english',
      testServers: ID.GUILD_TEST, 
      botOwners: ID.KIRU, 
      delErrMsgCooldown: -1, 
      ignoreBots: true,
      typeScript: true, 
      mongoUri: process.env.MONGO_URI,
      // The fields below should be commented when using on prod servers
      //debug: true, // Display more information in the console
      //showWarns: true, // Display warnings in the console
    })
    .setDefaultPrefix('!') 

    wok.on('databaseConnected', async (connection: any, state: any) => {
      console.log(`Database connection state is [${state}]\n`)
    })

    wok.on('languageNotSupported', (guild: any, lang: any) => {
      console.log(`"${guild.name}" Attempted to set language to "${lang}"`)
    })
  
  const guildCounter  = client.guilds.cache.size
  console.log(`\n[${client.user?.tag}] is online!\nCurrently used in: [${guildCounter} guild${guildCounter === 1 ? '' : 's'}]!`)


})




const token = process.env.DC_TOKEN
if (!token) { throw new Error('No token found!\nProvide a token in the .env file!') }
client.login(token)
import DCJS, { Channel, Intents, Message } from 'discord.js'
import { DisTube } from 'distube'
import { YtDlpPlugin } from '@distube/yt-dlp'
import WOK from 'wokcommands'
import path from 'path'
import IDs from './assets/id'
import 'dotenv/config'
import colorValues from './assets/colors'

const client = new DCJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MEMBERS
    ],
    allowedMentions: {
      roles: [],
      repliedUser: false,
    },
    presence: {
      status: "dnd",
      activities: [{
        name: 'Songs and stuff',
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
    const guild = client.guilds.cache.get(IDs.GUILD)
    if(!guild) { return console.error('Guild not found') }

    const wok = new WOK(client, {
      commandDir: path.join(__dirname, 'commands'), 
      featureDir: path.join(__dirname, 'features'),
      messagesPath: path.join(__dirname, 'languages/langs.json'),
      defaultLanguage: 'english',
      testServers: IDs.GUILD_TEST, 
      botOwners: IDs.KIRU, 
      delErrMsgCooldown: -1, 
      ignoreBots: true,
      typeScript: false, 
      mongoUri: process.env.MONGO_URI,
      //debug: true, // Display more information in the console
      //showWarns: true, // Display warnings in the console
    })
    .setDefaultPrefix('!') 

    // Wok events
    wok.on('databaseConnected', async (connection: any, state: any) => {
      console.log(`Database connection state is [${state}]\n`)
    })

    wok.on('languageNotSupported', (guild: any, lang: any) => {
      console.log(`"${guild.name}" Attempted to set language to "${lang}"`)
    })

    wok.on('commandException', (command: any, message: any, error: any) => {
      console.log(`An exception occured when using command "${command.names[0]}"! The error is:`)
      console.error(error)
    })
 
  const guildCounter  = client.guilds.cache.size
  console.log(`\n[${client.user?.tag}] is online!\nCurrently used in: [${guildCounter} guilds]`)

  // distube events
  distube.on("initQueue", queue => {
    queue.autoplay = false;
    queue.volume = 100;
  })

  //Listen to distube event
  distube.on('error', (channel, error) => {
    console.error(error)
    let x = new DCJS.MessageEmbed({
      description: `:x: **Distube** has thrown new error!`,
      color: colorValues.embedDefault,
    })
    client.users.fetch(IDs.KIRU)
    .then(user => { user.send({ content: `${error}`, embeds: [x] }) })
    let ChannelEmbed = new DCJS.MessageEmbed({ description: ':x: An error with music player occured! Message has been sent to developer.' })
    channel.send({ embeds: [ChannelEmbed] })
  })


})

const token = process.env.DC_TOKEN
if (!token) { throw new Error('No token found!\nProvide a token in the .env file!') }
client.login(token)
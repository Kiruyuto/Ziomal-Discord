import DCJS, { GuildMember, VoiceChannel } from 'discord.js';
import { ICommand } from 'wokcommands';
import { distube } from '../..';
import colorValues from '../../assets/colors';
import IDs from '../../assets/id';

export default {
  names: ['play'],
  aliases: ['p', 'pl'],
  category: 'Music',
  description: 'Play a song or a playlist',

  slash: 'both',
  //testOnly: true,
  guildOnly: true,

  minArgs: 1,
  expectedArgs: '<URL>',
  expectedArgsTypes: ['STRING'],

  callback: async ({ client, message, args, interaction: slashCmd }) => {
    try {
      const working = message ? message.channel.send('Working on it...') : slashCmd.channel?.send('Working on it...');
      if (!working) { return }
      // Get the voice channel ID 
      const channelId = message
        ? message.member?.voice.channel
        : (slashCmd.member as GuildMember).voice.channel as VoiceChannel

      const embedNoChannel = new DCJS.MessageEmbed({
        color: `${colorValues.embedDefault}`,
        description: ':warning: You need to be connected to a voice channel!',
      })

      // Check if the user is in a voice channel
      if (!channelId) {
        (await working).edit({ content: ' ', embeds: [embedNoChannel] })
        return
      }

      // Check if the user is in the same channel as the bot
      const embedSameChannel = new DCJS.MessageEmbed({
        color: `${colorValues.embedDefault}`,
        description: ':warning: You need to be in the same channel as me!',
      })
      if ((message ? message.guild?.me?.voice.channel : slashCmd.guild?.me?.voice.channel) && (message ? message.member?.voice.channel?.id : (slashCmd.member as GuildMember).voice.channel?.id) !== (message ? message.guild?.me?.voice.channel?.id : slashCmd.guild?.me?.voice.channel?.id)) {
        (await working).edit({ content: ' ', embeds: [embedSameChannel] })
        return
      }


      let queue = await distube.getQueue(message ? message : (slashCmd.member as GuildMember).guild.id)

      if (!queue) {
        await distube.play(channelId, args[0])
        queue = await distube.getQueue(message ? message : (slashCmd.member as GuildMember).guild.id)
      } else {
        await distube.play(channelId, args[0])
        queue = await distube.getQueue(message ? message : (slashCmd.member as GuildMember).guild.id)
      }

      const queueLength = queue?.songs.length! - 1
      enum loopState {
        "Disabled" = 0,
        "Song" = 1,
        "Queue" = 2
      }

      const embedPlaying = new DCJS.MessageEmbed({
        author: {
          name: `${client.user?.username} | Music menu`,
          iconURL: `${message ? message.member?.displayAvatarURL() : (slashCmd.member as GuildMember).user.displayAvatarURL()}`,
        },
        description: `Added to queue: **${queue?.songs[queueLength].name}**`,
        color: `${colorValues.embedDefault}`,
        thumbnail: { url: `${queue?.songs[queueLength]?.thumbnail}`, },
        fields: [
          { name: 'Duration', value: `${queue?.songs[queueLength].formattedDuration}`, inline: true },
          { name: 'Queue position', value: `${queue?.songs.length}`, inline: true },
          { name: 'Volume', value: `${queue?.volume}`, inline: true },

          { name: 'Added by', value: `<\@${message ? message.author.id : (slashCmd.member as GuildMember).id}>`, inline: true },
          { name: 'Repeat mode', value: `${loopState[queue?.repeatMode!]}`, inline: true },
          { name: 'Link', value: `[Click!](${queue?.songs[queueLength]?.url})`, inline: true },
        ],
      })

      // Returns on message/interaction
      if (message) { (await working).edit({ content: ' ', embeds: [embedPlaying] }) }
      else { (await working).edit({ content: ' ', embeds: [embedPlaying] }) }
    } catch (error) {
      // Log the error in the console, send message to developer and inform the user about error
      console.log(error)

      let embedDev = new DCJS.MessageEmbed({
        description: `:x: Something went wrong with \`play\` command in the **${(message ? message.guild?.name : slashCmd.guild?.name)}** \`(${message ? message.guild?.id : slashCmd.guild?.id})\` sever!`,
        color: `${colorValues.embedDefault}`,
      })
      const devDM = await client.users.fetch(`${IDs.KIRU}`)
        .then(user => user.send({ content: `${error}`, embeds: [embedDev] }))

      return new DCJS.MessageEmbed({
        description: ':x: An error occured! Message has been sent to developer.',
      })
    }
  },
} as ICommand;
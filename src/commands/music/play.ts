import DCJS from 'discord.js';
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

  callback: async ({ client, message, args, interaction: slashCmd, guild, channel, member }) => {
    try {

      const embedWorkingOnIt = new DCJS.MessageEmbed({
        description: ':hourglass: Working on it...',
        color: colorValues.embedDefault,
      })

      const working = (message
        ? channel.send({ embeds: [embedWorkingOnIt] })
        : slashCmd.reply({ embeds: [embedWorkingOnIt], fetchReply: true })) as any
      if (!working) { return }

      // Get the voice channel
      const voicChannel = member.voice.channel

      const embedNoChannel = new DCJS.MessageEmbed({
        color: colorValues.embedDefault,
        description: ':warning: You need to be connected to a voice channel!',
      })

      // Check if the user is in a voice channel
      if (!voicChannel) {
        (await working).edit({ content: ' ', embeds: [embedNoChannel] });
        return
      }

      // Check if the user is in the same voice channel as the bot
      const embedSameChannel = new DCJS.MessageEmbed({
        color: colorValues.embedDefault,
        description: ':warning: You need to be in the same channel as me!',
      })
      if (guild?.me?.voice.channel && member.voice.channel.id !== guild?.me?.voice.channel?.id) {
        (await working).edit({ content: ' ', embeds: [embedSameChannel] })
        return
      }


      let queue = await distube.getQueue(guild!)

      if (!queue) {
        await distube.play(voicChannel, args[0])
        queue = await distube.getQueue(guild!)
      } else {
        await distube.play(voicChannel, args[0])
        queue = await distube.getQueue(guild!)
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
          iconURL: member.displayAvatarURL(),
        },
        description: `Added to queue: **${queue?.songs[queueLength].name}**`,
        color: colorValues.embedDefault,
        thumbnail: { url: queue?.songs[queueLength]?.thumbnail, },
        fields: [
          { name: 'Duration', value: `${queue?.songs[queueLength].formattedDuration}`, inline: true },
          { name: 'Queue position', value: `${queue?.songs.length}`, inline: true },
          { name: 'Volume', value: `${queue?.volume}`, inline: true },

          { name: 'Added by', value: `<\@${member.id}>`, inline: true },
          { name: 'Repeat mode', value: `${loopState[queue?.repeatMode!]}`, inline: true },
          { name: 'Link', value: `[Click!](${queue?.songs[queueLength]?.url})`, inline: true },
        ],
      })

      // Returns on message/interaction
      if (message) {
        (await working).edit({ content: ' ', embeds: [embedPlaying] })
      }
      else {
        (await working).edit({ content: ' ', embeds: [embedPlaying] })
      }
    } catch (error) {
      // Log the error in the console, send message to developer and inform the user about error
      console.log(error)

      let embedDev = new DCJS.MessageEmbed({
        description: `:x: Something went wrong with \`play\` command in the **${guild}** \`(${guild?.id}})\` sever!`,
        color: colorValues.embedDefault,
      })
      const devDM = await client.users.fetch(IDs.KIRU)
        .then(user => user.send({ content: `${error}`, embeds: [embedDev] }))

      return new DCJS.MessageEmbed({
        description: ':x: An error occured! Message has been sent to developer.',
      })
    }
  },
} as ICommand;
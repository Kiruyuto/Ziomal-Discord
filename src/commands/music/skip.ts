import { ICommand } from 'wokcommands';
import { distube } from '../../index';
import DCJS, { GuildMember } from 'discord.js';
import IDs from '../../assets/id';
import colorValues from '../../assets/colors';

export default {
  names: ['skip'],
  aliases: ['s'],
  category: 'Music',
  description: 'Skip the current song',

  slash: 'both',
  //testOnly: true,
  guildOnly: true,
  maxArgs: 0,

  callback: async ({ client, message, interaction: slashCmd, member, guild, channel }) => {
    try {
      // Check if the user is in the same voice channel as the bot
      if (guild?.me?.voice.channel && member.voice.channel?.id !== guild?.me?.voice.channel?.id) {
        return new DCJS.MessageEmbed({
          color: colorValues.embedDefault,
          description: ':warning: You need to be in the same channel as me!',
        })
      }

      // Get the queue and return message if there is no queue
      let queue = await distube.getQueue(guild!)
      if (!queue) {
        return new DCJS.MessageEmbed({
          description: `:warning: I am not playing anything right now!`,
          color: colorValues.embedDefault,
        })
      }

      //Skip or stop the queue
      if (queue.songs.length > 1) {
        queue.skip()
        return new DCJS.MessageEmbed({
          description: ':white_check_mark: Skipped the song!',
          color: colorValues.embedDefault,
        })
      } else {
        queue.stop()
        return new DCJS.MessageEmbed({
          description: ':white_check_mark: There was no next song so I left the channel ¯\\_(ツ)_/¯',
          color: colorValues.embedDefault,
        })
      }

    } catch (error) {
      // Log the error in the console, send message to developer and inform the user about error
      console.log(error)

      let embedDev = new DCJS.MessageEmbed({
        description: `:x: Something went wrong with \`skip\` command in the **${guild}** \`(${guild?.id}})\` sever!`,
        color: colorValues.embedDefault,
      })
      const devDM = await client.users.fetch(IDs.KIRU)
        .then(user => user.send({ content: `${error}`, embeds: [embedDev] }))

      return new DCJS.MessageEmbed({
        description: ':x: An error occured! Message has been sent to developer.',
        color: colorValues.embedDefault
      })
    }
  }
} as ICommand
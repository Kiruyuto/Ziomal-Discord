import { ICommand } from 'wokcommands';
import DCJS, { GuildMember } from 'discord.js';
import IDs from '../../assets/id';
import colorValues from '../../assets/colors';
import { distube } from '../../index';
import { DisTubeVoice } from 'distube';

export default {
  names: ['dc', 'leave'],
  aliases: ['disconnect', 'leave', 'clearqueue'],
  category: 'Music',
  description: 'Disconnects the bot from the voice channel',

  slash: 'both',
  //testOnly: true,
  guildOnly: true,
  maxArgs: 0,

  callback: async ({ client, message, interaction: slashCmd, guild }) => {
    try {

      // Check if the user is in the same voice !channel as the bot and return message if not
      if ((message ? message.guild?.me?.voice.channel : slashCmd.guild?.me?.voice.channel) && (message ? message.member?.voice.channel?.id : (slashCmd.member as GuildMember).voice.channel?.id) !== (message ? message.guild?.me?.voice.channel?.id : slashCmd.guild?.me?.voice.channel?.id)) {
        return new DCJS.MessageEmbed({
          color: colorValues.embedDefault,
          description: ':warning: You need to be in the same channel as me!',
        })
      }

      //Get the queue, delete it if it exist then disconnect the bot
      let queue = await distube.getQueue(guild!)
      if (queue) {
        queue.stop();
        return new DCJS.MessageEmbed({
          description: `:white_check_mark: Removed the queue and disconnected from **${guild}**'s ${guild?.me?.voice.channel}.`,
          color: colorValues.embedDefault,
        })
      } else {
        if (guild?.me?.voice.channel) {
          distube.voices.leave(guild!)
          return new DCJS.MessageEmbed({
            description: `:white_check_mark: Disconnected from **${guild}**'s ${guild?.me?.voice.channel}.`,
            color: colorValues.embedDefault,
          })
        } else {
          return new DCJS.MessageEmbed({
            description: `:warning: I am not connected to any channel!`,
            color: colorValues.embedDefault,
          })
        }
      }

    } catch (error) {
      // Log the error in the console, send message to developer and inform the user about error
      console.log(error)

      let embedDev = new DCJS.MessageEmbed({
        description: `:x: Something went wrong with \`dc\` command in the **${guild}** \`(${guild?.id}})\` sever!`,
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
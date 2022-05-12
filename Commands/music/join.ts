import { ICommand } from 'wokcommands';
import { distube } from '../../index';
import DCJS, { GuildMember, VoiceChannel } from 'discord.js';
import colorValues from '../../assets/colors';
import IDs from '../../assets/id';

export default {
  names: ['join'],
  aliases: ['connect'],
  category: 'Music',
  description: 'Joins the voice channel of the user',

  slash: 'both',
  //testOnly: true,
  guildOnly: true,
  maxArgs: 0,

  callback: async ({ client, message, interaction: slashCmd, guild, member }) => {
    try {
      //Get the VOICE channel of the user
      const channel = member.voice.channel

      // Check if the channel exist and is proper type
      if (!channel || channel.type !== 'GUILD_VOICE') {
        return new DCJS.MessageEmbed({
          description: ':warning: Channel doesnt exist or is not a valid type!',
          color: colorValues.embedDefault
        })
      }

      // Check if the user is in the same voice channel as the bot
      if (guild?.me?.voice.channel && member.voice.channel.id !== guild?.me?.voice.channel?.id) {
        return new DCJS.MessageEmbed({
          color: colorValues.embedDefault,
          description: ':warning: You need to be in the same channel as me!',
        })
      }

      // Ensure that user can't use the command when bot is already connected
      if (guild?.me?.voice.channel && member?.voice.channel?.id !== guild?.me?.voice.channel?.id) {
        return new DCJS.MessageEmbed({
          color: colorValues.embedDefault,
          description: ':warning: You can\'t use it when im already in the channel!',
        })
      }

      distube.voices.join(member.voice.channel)

      //Reply to the user with the following embed
      let embedJoined = new DCJS.MessageEmbed({
        description: ':white_check_mark: I joined the channel!',
        color: colorValues.embedDefault,
      })

      if (message) {
        await message.reply({
          embeds: [embedJoined]
        })
      } else {
        await slashCmd.reply({
          embeds: [embedJoined]
        })
      }

    } catch (error) {
      // Log the error in the console, send message to developer and inform the user about error
      console.log(error)

      let embedDev = new DCJS.MessageEmbed({
        description: `:x: Something went wrong with \`join\` command in the **${guild}** \`(${guild?.id}})\` sever!`,
        color: colorValues.embedDefault,
      })
      const devDM = await client.users.fetch(IDs.KIRU)
        .then(user => user.send({ content: `${error}`, embeds: [embedDev] }))

      return new DCJS.MessageEmbed({
        description: ':x: An error occured! Message has been sent to developer.',
      })
    }
  }
} as ICommand
import { ICommand } from 'wokcommands';
import { distube } from '../../index';
import DCJS, { GuildMember } from 'discord.js';
import colorValues from '../../assets/colors';
import IDs from '../../assets/id';

export default {
  names: ['np'],
  aliases: ['nowplaying', 'now', 'current'],
  category: 'Music',
  description: 'Display the currently playing song',

  slash: 'both',
  //testOnly: true,
  guildOnly: true,
  maxArgs: 0,

  callback: async ({ client, message, interaction: slashCmd, guild }) => {
    try {

      //Get the queue and return message to the user if queue doesn't exist
      let queue = await distube.getQueue(guild!)
      if (!queue) {
        return new DCJS.MessageEmbed({
          description: `No queue for **${guild}** has been found`,
          color: colorValues.embedDefault,
        })
      }

      //Reply to the user
      const embedCurrentSong = new DCJS.MessageEmbed({
        color: colorValues.embedDefault,
        thumbnail: { url: queue.songs[0].thumbnail },
        title: `Currently playing:`,
        description: `${queue.songs[0].name}`,
        fields: [
          { name: 'Link', value: `[Click!](${queue?.songs[0]?.url})`, inline: true },
          { name: 'Duration', value: `${queue.formattedCurrentTime} / ${queue?.songs[0].formattedDuration}`, inline: true },
        ]
      })

      if (message) {
        await message.reply({
          embeds: [embedCurrentSong]
        })
      } else {
        await slashCmd.reply({
          embeds: [embedCurrentSong]
        })
      }

    } catch (error) {
      // Log the error in the console, send message to developer and inform the user about error
      console.log(error)

      let embedDev = new DCJS.MessageEmbed({
        description: `:x: Something went wrong with \`np\` command in the **${guild}** \`(${guild?.id}})\` sever!`,
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
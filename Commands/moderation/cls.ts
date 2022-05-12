import { ICommand } from 'wokcommands';
import DCJS from 'discord.js';
import IDs from '../../assets/id';
import colorValues from '../../assets/colors';


export default {
  names: ['cls', 'purge'],
  aliases: ['cls', 'purge', 'clear'],
  category: 'Moderation',
  description: 'Deletes given number of messages',

  requiredPermissions: ['MANAGE_MESSAGES'],
  slash: 'both',
  //testOnly: true,
  guildOnly: true,
  minArgs: 1,
  maxArgs: 1,
  expectedArgs: '<amount>',
  expectedArgsTypes: ['INTEGER'],

  callback: async ({ client, message, interaction: slashCmd, args, channel, guild }) => {
    try {
      const amount = parseInt(args.shift()!)
      if (amount > 99 || amount < 1) {
        return new DCJS.MessageEmbed({
          description: 'You can delete between 1 and 99 messages at once',
          color: colorValues.embedDefault
        })
      }

      if (message) { await message.delete() }

      // Bulk delte => Faster & deletes only up to 2 weeks old messages
      const { size } = await channel.bulkDelete(amount, true)


      const embedReply = new DCJS.MessageEmbed({
        description: `Deleted ${size} messages`,
        color: colorValues.embedDefault
      })

      //Reply to the user how many messages were deleted
      if (message) { channel.send({ embeds: [embedReply] }).then(m => { setTimeout(() => m.delete(), 3000) }) }
      else { slashCmd.reply({ embeds: [embedReply], fetchReply: true }).then(() => { setTimeout(() => slashCmd.deleteReply(), 3000) }) }

    } catch (error) {
      // Log the error in the console, send message to developer and inform the user about error
      console.log(error)

      let embedDev = new DCJS.MessageEmbed({
        description: `:x: Something went wrong with \`cls\` command in the **${guild}** \`(${guild?.id}})\` sever!`,
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
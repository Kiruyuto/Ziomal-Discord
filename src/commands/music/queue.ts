import { ICommand } from 'wokcommands';
import { distube } from '../..';
import DCJS, { Interaction, MessageActionRow, MessageButton, MessageEmbed, Message } from 'discord.js';
import colorValues from '../../assets/colors';
import IDs from '../../assets/id';

const embeds: MessageEmbed[] = []
const pages = {} as { [key: string]: number } // {userID: pageNumber}

const getRow = (id: string) => {
  const row = new MessageActionRow()


  row.addComponents(
    new MessageButton()
      .setCustomId('previousPage')
      .setStyle('SECONDARY')
      .setEmoji('⏮️')
      .setDisabled(pages[id] === 0)
  )
  row.addComponents(
    new MessageButton()
      .setCustomId('nextPage')
      .setStyle('SECONDARY')
      .setEmoji('⏭️')
      .setDisabled(pages[id] === embeds.length - 1)
  )
  return row
}

export default {
  names: ['queue'],
  aliases: ['q'],
  category: 'Music',
  description: 'Show the queue',

  slash: 'both',
  //testOnly: true,
  guildOnly: true,

  minArgs: 0,
  maxArgs: 1,
  expectedArgs: '<page-number>',
  expectedArgsTypes: ['INTEGER'],

  callback: async ({ client, args, interaction, guild, user, message, channel }) => {
    try {
      if (args[0] == undefined || args[0] == null || args[0] == "1") { args[0] = "0" }
      else { args[0] = (parseInt(args[0]) - 1).toString() }
      const PageNumber = parseInt(args[0])

      // Get queue and return error if there is no queue
      let queue = await distube.getQueue(guild!)
      if (!queue) {
        return new DCJS.MessageEmbed({
          description: `:warning: No queue for **${guild}** has been found`,
          color: colorValues.embedDefault,
        })
      }

      //Define page with links and titles for every 10 songs
      let sliceEnd = 10
      let songList = queue.songs
      for (let sliceStart = 0; sliceStart < songList.length; sliceStart += 10) {
        let ce = songList
        const currentEmbed = ce.slice(sliceStart, sliceEnd)
        let i = sliceStart + 1;
        const infos = currentEmbed.map((song) => `**${i++}** - [${song.name}](${song.url}) (${song.formattedDuration})`)
        const embedSongList = new DCJS.MessageEmbed({
          title: `Queue for **${guild}**`,
          color: colorValues.embedDefault,
          description: infos.join('\n'),
          footer: { text: `Songs in queue: ${songList.length} | Queue duration: ${queue?.formattedDuration}` }
        })
        embeds.push(embedSongList)
        sliceEnd += 10
      }

      // Return message if page number is out of valid range
      if (PageNumber > embeds.length) {
        return new DCJS.MessageEmbed({
          description: `:warning: Provided page number exceeds the queue length!`,
          color: colorValues.embedDefault,
          fields: [
            { name: 'Given page number:', value: `${PageNumber + 1}`, inline: true },
            { name: 'Max page number:', value: `${embeds.length}`, inline: true },
          ]
        })
      }

      const ID = user.id
      pages[ID] = pages[ID] || 0

      const embed = embeds[pages[ID]]
      let reply: Message | undefined
      let collector

      const filter = (i: Interaction) => i.user.id === user.id
      const time = 1000 * 60 * 5

      if (message) {
        reply = await message.reply({
          embeds: [embed],
          components: [getRow(ID)]
        })
        collector = reply.createMessageComponentCollector({ filter, time })
      } else {
        interaction.reply({
          ephemeral: true,
          embeds: [embed],
          components: [getRow(ID)]
        })
        collector = channel.createMessageComponentCollector({ filter, time })
      }

      collector.on('collect', (btInter: any) => {
        if (!btInter) { return }

        btInter.deferUpdate()
        if (btInter.customId !== 'previousPage' && btInter.customId !== 'nextPage') { return }

        if (btInter.customId === 'previousPage' && pages[ID] > 0) { --pages[ID] }
        else if (btInter.customId === 'nextPage' && pages[ID] < embeds.length - 1) { ++pages[ID] }
        if (reply) {
          reply.edit({
            embeds: [embeds[pages[ID]]],
            components: [getRow(ID)]
          })
        } else {
          interaction.editReply({
            embeds: [embeds[pages[ID]]],
            components: [getRow(ID)]
          })
        }
      })

      //return embeds[PageNumber]

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
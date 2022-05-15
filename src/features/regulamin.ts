import DCJS, { Client, Message, MessageButton, MessageActionRow, Interaction, GuildMember, InteractionReplyOptions } from 'discord.js';
import colorValues from '../assets/colors';
import IDs from '../assets/id';
import { TextChannel } from 'discord.js';
import regulaminSchema from './models/regulamin-schema';
import WOK from 'wokcommands';






export default async (client: Client, instance: WOK) => {
  if (!instance.isDBConnected()) { return }
  const guild = client.guilds.cache.get(IDs.GUILD)
  if (!guild) { return }

  const channel = guild.channels.cache.get(IDs.REGULAMIN) as TextChannel
  if (!channel) { return }

  const gadka = guild.channels.cache.get(IDs.GADKA_SZMATKA) as TextChannel
  if (!gadka) { return }

  const embedRegulamin = new DCJS.MessageEmbed({
    title: `Regulamin "**${guild.name}**"`,
    color: colorValues.embedDefault,
    description: '1. XXX\n 2. XXX\n 3. XXX\n\n Wejdź na kanał i kliknij :bell: aby nas o tym powiadomić,\nalbo naciśnij :x: aby wypierdalać <:kekw:723509048087150693>\n\n\nKURWY JEBANE ODRADZAM KLIKAĆ BO ZOSTAWIAM TAK JAK JEST I IDĘ SPAĆ A NIE BEDE POZNIEJ NIKOGO ODBANOWYWAĆ :D',
    fields: [
      { name: 'WYLACZYLEM X BO WAM NIE UFAM', value: 'ESSA JEBAĆ DISA', inline: true },
      { name: 'qs kurwom jest', value: 'tak jest', inline: true },
    ],

  })
  const row = new MessageActionRow()

  row.addComponents(
    new MessageButton()
      .setCustomId('alert')
      .setStyle('SECONDARY')
      .setEmoji('🔔')
  )
  row.addComponents(
    new MessageButton()
      .setCustomId('ban')
      .setStyle('SECONDARY')
      .setEmoji('❌')
  )

  const filter = (int: Interaction) => {
    return true//((int.member) as GuildMember).roles.cache.size === 0
  }
  const collector = channel.createMessageComponentCollector({ filter })

  let results = await regulaminSchema.findById(guild.id)

  if (results) {
    const message = (await channel.messages.fetch(results.messageId, {
      cache: true,
      force: true
    })
      .catch(() => { })) as Message

    if (message) {
      message.edit({
        content: ' ',
        embeds: [embedRegulamin],
        components: [row],
      })
    } else {
      results = null
    }
  }

  if (!results) {
    const message = await channel.send({
      content: ' ',
      embeds: [embedRegulamin],
      components: [row]
    })
    await regulaminSchema.findOneAndUpdate(
      { _id: guild.id },
      { _id: guild.id, messageId: message.id },
      { upsert: true }
    )
  }


  collector.on('collect', interaction => {
    gadka.send(`<@&${IDs.REKRUTER}> | ${interaction.member} czeka na rekrutacje`)
    interaction.reply({
      content: 'Powiadomiono',
      ephemeral: true,
    })
  })


}

export const config = {
  dbName: 'REGULAMIN',
  displayName: 'Regulamin',
}
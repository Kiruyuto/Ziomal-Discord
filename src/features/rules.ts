import DCJS, { Client, Message, MessageButton, MessageActionRow, Interaction, GuildMember, } from 'discord.js';
import colorValues from '../assets/colors';
import IDs from '../assets/id';
import { TextChannel } from 'discord.js';
import regulaminSchema from './models/rules-schema';
import WOK from 'wokcommands';

const desc = "**1.** Garda wysoko\n\
**2.** Nie daj sie zabić\n\
**3.** Miej dystans do siebie\n\
**4.** Tu se coś wymyśl bo nam sie skończyły pomysły\n\
**5.** Zawsze mam racje nawet jak nie mam racji :sunglasses:\n\n\n\
Jeśli taki regulamin ci odpowiada - wejdź na kanał i naciśnij :bell:\n\
Jeśli nie planujesz się do tych zasad zastosować - nacisnij :x:\n\
Jeśli chcesz sprawdzić z jakim autyzmem masz do czynienia - kliknij w :link:"

export default async (client: Client, instance: WOK) => {
  try {
    if (!instance.isDBConnected()) { return }
    const guild = client.guilds.cache.get(IDs.GUILD)
    if (!guild) { return }

    const channel = guild.channels.cache.get(IDs.REGULAMIN) as TextChannel
    if (!channel) { return }

    const gadka = guild.channels.cache.get(IDs.GADKA_SZMATKA) as TextChannel
    if (!gadka) { return }

    const embedRegulamin = new DCJS.MessageEmbed({
      title: `Regulamin :D`,
      color: colorValues.embedDefault,
      description: `${desc}`,
      //fields: [],
    })
    const row = new MessageActionRow()
    row.addComponents(
      new MessageButton()
        .setCustomId('alert')
        .setStyle('SUCCESS')
        .setEmoji('🔔')
    )
    row.addComponents(
      new MessageButton()
        .setCustomId('kick')
        .setStyle('DANGER')
        .setEmoji('✖️')
    )
    row.addComponents(
      new MessageButton()
        .setStyle('LINK')
        .setURL(`${process.env.CHECKUSURL}`)
        .setLabel('Sprawdz nas!')
    )

    const filter = (int: Interaction) => {
      return true//(int.member as GuildMember).roles.cache.size == 0
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
      // @everyone counts as a role so to make bot kick only users w/o cache.size has to be 1 or less
      if ((interaction.member as GuildMember).roles.cache.size <= 1) {
        if (interaction.customId === 'alert') {
          gadka.send(`<@&${IDs.REKRUTER}> => ${interaction.member} (${interaction.user.tag}) czeka na rekrutacje`)
          interaction.reply({
            content: 'Powiadomiono!',
            ephemeral: true
          })
        } else if (interaction.customId === 'kick') {
          gadka.send(`${interaction.member} (${interaction.user.tag}) zostal wyrzucony z serwera`)
          interaction.reply({
            content: 'Eluwina!',
            ephemeral: true
          }).then(() => { setTimeout(() => { (interaction.member as GuildMember).kick('Nie akceptuje regulaminu') }, 5000) })
        }
      } else {
        interaction.reply({
          content: 'Nie możesz tego użyć!',
          ephemeral: true
        })
      }
    })

  } catch (error) {
    // Log the error in the console, send message to developer and inform the user about error
    console.log(error)
    const guild = client.guilds.cache.get(IDs.GUILD)
    if (!guild) { return }

    let embedDev = new DCJS.MessageEmbed({
      description: `:x: Something went wrong withing \`rules\` feature in the **${guild}** \`(${guild?.id}})\` sever!`,
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

export const config = {
  dbName: 'RULES',
  displayName: 'Rules',
}
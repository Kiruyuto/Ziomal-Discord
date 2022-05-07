import {
  Client,
  GuildEmoji,
  GuildMember,
  Interaction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
  MessageSelectOptionData,
  TextChannel,
} from 'discord.js'
import WOKCommands from 'wokcommands'
import roleSchema from './models/roles-schema'
import ID from '../Utils/id'

const LARoles = {
  //Assasins
  ':XDeathblade': [ID.DEATHBLADE, 'Deathblade'],
  ':XShadowhunter': [ID.SHADOWHUNTER, 'Shadowhunter'],
  //Gunners
  ':XArtillerist': [ID.ARTILLERIST, 'Artillerist'],
  ':XDeadeye': [ID.DEADEYE, 'Deadeye'],
  ':XGunslinger': [ID.GUNSLINGER, 'Gunslinger'],
  ':XSharpshooter': [ID.SHARPSHOOTER, 'Sharpshooter'],
  //Mages
  ':XBard': [ID.BARD, 'Bard'],
  ':XSorceress': [ID.SORCERESS, 'Sorceress'],
  //Martial Artists
  ':XGlavier': [ID.GLAIVIER, 'Glavier'],
  ':XScrapper': [ID.SCRAPPER, 'Scrapper'],
  ':XSoulfist': [ID.SOULFIST, 'Soulfist'],
  ':XStriker': [ID.STRIKER, 'Striker'],
  ':XWardancer': [ID.WARDANCER, 'Wardancer'],
  //Warriors
  ':XBerserker': [ID.BERSERKER, 'Berserker'],
  ':XDestroyer': [ID.DESTROYER, 'Destroyer'],
  ':XGunlancer': [ID.GUNLANCER, 'Gunlancer'],
  ':XPaladin': [ID.PALADIN, 'Paladin'],
} as {
  [key: string]: string[]
}

export default async (client: Client, instance: WOKCommands) => {
  if(!instance.isDBConnected()) {
    return
  }

  const guild = client.guilds.cache.get(ID.GUILD)
  if(!guild) { 
    return
  }
  
  const channel = guild.channels.cache.get(
    ID.ROLE_CLAIM_CHANNEL
  ) as TextChannel
  if(!channel) {
    return
  }

  let results = await roleSchema.findById(guild.id)
  const keys = Object.keys(LARoles)
  const rows: MessageActionRow[] = []
  const options: MessageSelectOptionData[] = []
  const messageText = 'Ktorymi klasami grasz?'

  for(let i = 0; i < keys.length; ++i) {
  let emoji: string | GuildEmoji = keys[i]
  const [id, desc] = LARoles[emoji]

  if(emoji.startsWith(':')) {
    emoji = guild.emojis.cache.find((e) => {
      if (typeof emoji === 'string') {
        return e.name === emoji.substring(1)
      }

      return false
    }) as GuildEmoji
  }
  options.push({
    label: desc,
    value: id,
    emoji,
  })
  }

  rows.push(
    new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId('role_select')
        .setMinValues(0)
        .setMaxValues(options.length)
        .setPlaceholder('Wybierz swoje role...')
        .addOptions(options)
    )
  )

  if (results) {
    const message = (await channel.messages
      .fetch(results.messageId, {
        cache: true,
        force: true,
      })
      .catch(() => {})) as Message

      if(message) {
        message.edit({
          content: messageText,
          components: rows,
        }) 
      } else { 
        results = null 
      }
  }

  if(!results) {
    const message = await channel.send({
      content: messageText,
      components: rows,
    })

    await roleSchema.findOneAndUpdate(
      {
        _id: guild.id,
      },
      {
      _id: guild.id,
      messageId: message.id,
      },
      {
        upsert: true,
      }
    )
  }

  client.on('interactionCreate', (interaction) => {
    if(
      !interaction.isSelectMenu() ||
      interaction.channelId !== ID.ROLE_CLAIM_CHANNEL
    ) {
      return
    }

    const {customId, values, member } = interaction

    if(customId !== 'role_select' && member instanceof GuildMember) {
      const component = interaction.component as MessageSelectMenu
      const removed = component.options.filter(
        (role) => !values.includes(role.value)
      )
      for(const id of removed) {
        member.roles.remove(id.value)
      }

      for(const id of values) { 
        member.roles.add(id)
      }

      interaction.reply({
        ephemeral: true,
        content: 'Zaktualizowano twoje role!',
      })
    }
  })
}

export const config = {
  dbName: 'AUTO_ROLES',
  displayName: 'Auto Roles',
}
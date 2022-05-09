import {
  Client,
  GuildEmoji,
  GuildMember,
  Message,
  MessageActionRow,
  MessageSelectMenu,
  MessageSelectOptionData,
  TextChannel,
} from 'discord.js'
import WOK from 'wokcommands-fixed'
import roleSchema from './models/roles-schema'
import ID from '../assets/id'

const LARoles = {
  //ASSASINS
  ':XDeathblade': [ID.DEATHBLADE, 'Deathblade', 'Assasin'],
  ':XShadowhunter': [ID.SHADOWHUNTER, 'Shadowhunter', 'Assasin'],
  //GUNNERS
  ':XArtillerist': [ID.ARTILLERIST, 'Artillerist', 'Gunner'],
  ':XDeadeye': [ID.DEADEYE, 'Deadeye', 'Gunner'],
  ':XGunslinger': [ID.GUNSLINGER, 'Gunslinger', 'Gunner'],
  ':XSharpshooter': [ID.SHARPSHOOTER, 'Sharpshooter', 'Gunner'],
  //MAGES
  ':XBard': [ID.BARD, 'Bard', 'Mage'],
  ':XSorceress': [ID.SORCERESS, 'Sorceress', 'Mage'],
  //MARTIAL ARTISTS
  ':XGlaivier': [ID.GLAIVIER, 'Glaivier', 'Martial Artist'],
  ':XScrapper': [ID.SCRAPPER, 'Scrapper', 'Martial Artist'],
  ':XSoulfist': [ID.SOULFIST, 'Soulfist', 'Martial Artist'],
  ':XStriker': [ID.STRIKER, 'Striker', 'Martial Artist'],
  ':XWardancer': [ID.WARDANCER, 'Wardancer', 'Martial Artist'],
  //WARRIORS
  ':XBerserker': [ID.BERSERKER, 'Berserker', 'Warrior'],
  ':XDestroyer': [ID.DESTROYER, 'Destroyer', 'Warrior'],
  ':XGunlancer': [ID.GUNLANCER, 'Gunlancer', 'Warrior'],
  ':XPaladin': [ID.PALADIN, 'Paladin', 'Warrior'],
} as {
  [key: string]: string[]
}

export default async (client: Client, instance: WOK) => {
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
  const text = 'Ktorymi klasami grasz?'

  for(let a = 0; a < keys.length; ++a) {
    let emoji: string | GuildEmoji = keys[a]
    const [id, roleName, desc] = LARoles[emoji]

    if(emoji.startsWith(':')) {
      emoji = guild.emojis.cache.find((e) => {
        if (typeof emoji === 'string') {
          return e.name === emoji.substring(1)
        }

        return false
      }) as GuildEmoji
    }

    options.push({
      label: roleName,
      value: id,
      emoji,
      description: desc
    })
  }

  rows.push(
    new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId('role_select')
        .setMinValues(0)
        .setMaxValues(options.length)
        .setPlaceholder('Select Your Roles...')
        .addOptions(options)
    )
  )

  if(results) {
    const message = (await channel.messages
      .fetch(results.messageId, {
        cache: true,
        force: true,
      })
      .catch(() => {})) as Message

    if (message) {
      message.edit({
        content: text,
        components: rows,
      })
    } else {
      results = null
    }
  }

  if(!results) {
    const message = await channel.send({
      content: text,
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
    if (
      !interaction.isSelectMenu() ||
      interaction.channelId !== ID.ROLE_CLAIM_CHANNEL
    ) {
      return
    }

    const { customId, values, member } = interaction

    if(customId === 'role_select' && member instanceof GuildMember) {
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
        content: 'Roles updated!',
      })
      //console.log(`[${member.user.tag}] Roles updated!`)
    }
  })
}

export const config = {
  dbName: 'AUTO_ROLES',
  displayName: 'Auto Roles',
}

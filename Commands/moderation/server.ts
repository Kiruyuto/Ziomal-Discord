import { ICommand } from 'wokcommands';
import DCJS, { GuildMember } from 'discord.js';
import IDs from '../../assets/id';
import colorValues from '../../assets/colors';
import { distube } from '../../index';

export default {
  names: ['server', 'guild'],
  aliases: ['guild'],
  category: 'Moderation',
  description: 'Displays server info',

  slash: 'both',
  //testOnly: true,
  guildOnly: true,
  maxArgs: 0,

  callback: async ({ client, message, interaction: slashCmd }) => {
    try {
      const guild = message ? message.guild : slashCmd.guild
      if (!guild) { return }
      const guildInfo = new DCJS.MessageEmbed({
        title: `${guild.name}`,
        description: `${guild.name} was created on ${`<t:${Math.round(new Date(guild.createdTimestamp).getTime() / 1000)}:F>`}`,
        color: `${colorValues.embedDefault}`,
        thumbnail: { url: `${guild.iconURL({ dynamic: true })}` ?? "https://i.imgur.com/0ABYGXT.png" },
        fields: [
          { name: 'Total Members', value: `${guild.memberCount}`, inline: true },
          { name: 'Total Humans', value: `${guild.members.cache.filter((m) => !m.user.bot).size}`, inline: true },
          { name: 'Total Bots', value: `${guild.members.cache.filter(m => m.user.bot).size}`, inline: true },

          { name: 'Total Channels', value: `${guild.channels.cache.size}`, inline: true },
          { name: 'Text Channels', value: `${guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').size}`, inline: true },
          { name: 'Voice Channels', value: `${guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').size}`, inline: true },

          { name: 'Total Categories', value: `${guild.channels.cache.filter(c => c.type === 'GUILD_CATEGORY').size}`, inline: true },
          { name: 'Total Roles', value: `${guild.roles.cache.size}`, inline: true },
          { name: 'Total Emojis', value: `${guild.emojis.cache.size}`, inline: true },

          { name: 'Boosts', value: `${guild.premiumSubscriptionCount}`, inline: true },
          { name: 'Boost Tier', value: `${guild.premiumTier}`, inline: true },
          { name: 'Region', value: `${guild.preferredLocale}`, inline: true },

          { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
          { name: 'AFK Timeout', value: (guild.afkChannel) ? `${(guild.afkTimeout / 60)} minute(s)` : 'Not set', inline: true },
          { name: 'AFK Channel', value: `${guild.afkChannel ? guild.afkChannel : 'Not set'}`, inline: true },

          { name: 'NSFW Level', value: `${guild.nsfwLevel}`, inline: true },
          { name: 'Verification level', value: `${guild.verificationLevel}`, inline: true },
          { name: 'Explicit content filter', value: `${guild.explicitContentFilter}`, inline: true },
        ]
      })
      return guildInfo

    } catch (error) {
      // Log the error in the console, send message to developer and inform the user about error
      console.log(error)

      let embedDev = new DCJS.MessageEmbed({
        description: `:x: Something went wrong with \`server\` command in the **${(message ? message.guild?.name : slashCmd.guild?.name)}** \`(${message ? message.guild?.id : slashCmd.guild?.id})\` sever!`,
        color: `${colorValues.embedDefault}`,
      })
      const devDM = await client.users.fetch(`${IDs.KIRU}`)
        .then(user => user.send({ content: `${error}`, embeds: [embedDev] }))

      return new DCJS.MessageEmbed({
        description: ':x: An error occured! Message has been sent to developer.',
      })
    }
  }
} as ICommand
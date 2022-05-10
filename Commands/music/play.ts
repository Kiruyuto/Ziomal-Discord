import DCJS, { 
  GuildMember, 
  MessageActionRow, 
  MessageButton, 
  VoiceChannel 
} from 'discord.js';
import { Song } from 'distube';
import { ICommand } from 'wokcommands';
import { distube } from '../..';
import colorList from '../../assets/colors';
import Guild from 'discord.js';
import emojis from '../../assets/emojis';


export default {
  names: ['play'],
  aliases: ['p', 'pl'],
  category: 'Music',
  description: 'Play a song or a playlist',
  
  slash: 'both',
  testOnly: true,
  guildOnly: true,

  minArgs: 1,
  expectedArgs: '<URL>',
  expectedArgsTypes: ['STRING'],


  callback: async ({ client, message, args, interaction }) => {
    
    const channelId = message 
    ? message.member?.voice.channel
    : (interaction.member as GuildMember).voice.channel as VoiceChannel

    if(!channelId) {
      return 'You need to be in a voice channel!'
    }
    

    //Funkcja na sprawdzanie czy {USER} znajduje sie na tym samym kanale !!!!

    
    let queue = await distube.getQueue(message ? message : (interaction.member as GuildMember).guild.id)
    if(!queue) { 
      await distube.play(channelId, args[0])
      queue = await distube.getQueue(message ? message : (interaction.member as GuildMember).guild.id)
    } else {
      await distube.play(channelId, args[0])
      queue = await distube.getQueue(message ? message : (interaction.member as GuildMember).guild.id)
    }

    const queueLength = queue?.songs.length! - 1

    const embed = new DCJS.MessageEmbed({
      author: {
        name: `${client.user?.username} | Music menu`,
        iconURL: `${message ? message.member?.displayAvatarURL() : (interaction.member as GuildMember).user.displayAvatarURL()}`,
      },
      color: `${colorList.embedDefault}`,
      thumbnail: {
        url: `${queue?.songs[queueLength]?.thumbnail}`,
      },
      description: `Added to queue: **${queue?.songs[queueLength].name}**`,
      fields: [
        { name: 'Duration', value: `${queue?.songs[queueLength].formattedDuration}`, inline: true },
        { name: 'Queue Pos', value: `${queue?.songs.length}`, inline: true },
        { name: 'Volume', value: `${queue?.volume}`, inline: true },

        { name: 'Added by', value: `<\@${message ? message.author.id : (interaction.member as GuildMember).id}>`, inline: true },
        { name: 'Link', value: `[Click!](${queue?.songs[queueLength]?.url})`, inline: true},
        { name: 'Repeat', value: `${queue?.repeatMode}`, inline: true },

      ],
    })
    const row = new MessageActionRow()
     .addComponents(
       new MessageButton()
        .setCustomId('pause')
        .setEmoji('⏸')
        .setLabel('Pause')
        .setStyle('PRIMARY')
     )




    // === return ===
     if(message) {
       await message.reply({
         embeds: [embed],
         components: [row]
       })
     } else {
        await interaction.reply({
        embeds: [embed],
        components: [row]
        })
     }
  },
} as ICommand;
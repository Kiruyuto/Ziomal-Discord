import DCJS, { 
  GuildMember, 
  Interaction, 
  MessageActionRow, 
  MessageButton, 
  MessageComponentInteraction, 
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


  callback: async ({ channel, client, message, args, interaction: slashCmd }) => {
    
    // Get the voice channel ID 
    const channelId = message 
    ? message.member?.voice.channel
    : (slashCmd.member as GuildMember).voice.channel as VoiceChannel

    // Check if the user is in a voice channel
    if(!channelId) {
      return 'You need to be in a voice channel!'
    }
    
    const embedSameChannel = new DCJS.MessageEmbed({
      color: `${colorList.embedDefault}`,
      description: 'You need to be in the same channel as me!',
    })

    //Check if the user is in the same channel as the bot
    if((message ? message.guild?.me?.voice.channel : slashCmd.guild?.me?.voice.channel) && (message ? message.member?.voice.channel?.id : (slashCmd.member as GuildMember).voice.channel?.id) !== (message ? message.guild?.me?.voice.channel?.id : slashCmd.guild?.me?.voice.channel?.id)) {
      return embedSameChannel
    }

    
    let queue = await distube.getQueue(message ? message : (slashCmd.member as GuildMember).guild.id)

    if(!queue) { 
      await distube.play(channelId, args[0])
      queue = await distube.getQueue(message ? message : (slashCmd.member as GuildMember).guild.id)
    } else {
      await distube.play(channelId, args[0])
      queue = await distube.getQueue(message ? message : (slashCmd.member as GuildMember).guild.id)
    }

    const queueLength = queue?.songs.length! - 1

    const embed = new DCJS.MessageEmbed({
      author: {
        name: `${client.user?.username} | Music menu`,
        iconURL: `${message ? message.member?.displayAvatarURL() : (slashCmd.member as GuildMember).user.displayAvatarURL()}`,
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

        { name: 'Added by', value: `<\@${message ? message.author.id : (slashCmd.member as GuildMember).id}>`, inline: true },
        { name: 'Link', value: `[Click!](${queue?.songs[queueLength]?.url})`, inline: true},
        { name: 'Repeat', value: `${queue?.repeatMode}`, inline: true },

      ],
    })

    // Returns on message/interaction
     if(message) {
       await message.reply({
         embeds: [embed],
       })
     } else {
        await slashCmd.reply({
        embeds: [embed],
        })
     }
  },
} as ICommand;
import { ICommand } from 'wokcommands-fixed';
import { distube } from '../..';
import Emotes from '../../assets/emojis';
import DCJS from 'discord.js';
import colorList from '../../assets/colors';


export default {
  names: ['play'],
  aliases: ['p', 'pl'],
  category: 'Music',
  description: 'Play a song or a playlist',
  
  slash: false,
  guildOnly: true,

  minArgs: 1,
  expectedArgs: '<songURL>',
  expectedArgsTypes: ['STRING'],


  callback: async ({client, message, args}) => {
    const channel = message.member?.voice.channel// as VoiceChannel;
    if(!channel) {
      return 'You need to be in a voice channel'
    }
    if(message.guild?.me?.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) { 
      return `You have to be in the same voice channel as the bot to use this command! ${Emotes.DZBANEK}`
    }

    await distube.play(channel, args[0])
    const queue = await distube.getQueue(message)

    let embed = new DCJS.MessageEmbed({
      author: {
        name: `${client.user?.username} | Music menu`,
        iconURL: `${message.member.displayAvatarURL()}`,
      },
      color: `${colorList.embedDefault}`,
      thumbnail: {
        url: `${queue?.songs[0]?.thumbnail}`,
      },
      description: `Now Playing: **${queue?.songs[0]?.name}**`,
      fields: [
        { name: 'Duration', value: `${queue?.songs[0].formattedDuration}`, inline: true },
        { name: 'Queue', value: `${queue?.songs.length}`, inline: true },
        { name: 'Volume', value: `${queue?.volume}`, inline: true },

        { name: 'Added by', value: `\@${message.author.tag}`, inline: true },
        { name: 'Link', value: `[Click!](${queue?.songs[0]?.url})`, inline: true},
        { name: 'Repeat', value: `${queue?.repeatMode}`, inline: true },

      ],
    })


    return embed
  },
} as ICommand;
import { ICommand } from 'wokcommands';
import { distube } from '../..';
import Emotes from '../../assets/emojis';

export default {
  names: ['play'],
  aliases: ['p', 'pl'],
  category: 'Music',
  description: 'Play a song or a playlist',
  
  slash: false,
  testOnly: true,
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
    
    distube.play(channel, args[0])

    //let embed = new client.Discord.MessageEmbed()


    return `${channel}`
  

  },
} as ICommand;
import { ICommand } from 'wokcommands-fixed';
import { distube } from '../../index';
import DCJS, { VoiceChannel } from 'discord.js';
import playCommand from '../music/play';
import colorList from '../../assets/colors';
import { DisTubeVoiceManager } from 'distube';

export default { 
  names: ['join'],
  aliases: ['connect'],
  category: 'Music',
  description: 'Joins the voice channel of the user',

  slash: false,
  guildOnly: true,
  maxArgs: 0,

  callback: async ({ client, message, args, interaction }) => {
    const channel = (message.member?.voice.channel) as VoiceChannel

    if(message.guild?.me?.voice.channel && message.member?.voice.id === message.guild.me.voice.channel.id) {
      return 'I am already in your voice channel!'
      }

    if(message.guild?.me?.voice.channel && message.member?.voice.id !== message.guild.me.voice.channel.id) {
    return 'You are not in the same voice channel as me!'
    }

    if(!channel || channel.type !== 'GUILD_VOICE') {
      return 'Unable to fetch channel ID from message or interaction'
    }
    
    distube.voices.join(channel)

  }
} as ICommand
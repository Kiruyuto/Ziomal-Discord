import { ICommand } from 'wokcommands-fixed';
import { distube } from '../../index';
import DCJS from 'discord.js';
import playCommand from './play';
import colorList from '../../assets/colors';

export default {
  names: ['nowPlaying'],
  aliases: ['np', 'now'],
  category: 'Music',
  description: 'Display the currently playing song',

  slash: false,
  guildOnly: true,
  maxArgs: 0,

  callback: async ({client, message}) => {
    const guild = message.guild?.id
    if(!guild) { return }
    
    const queue = await distube.getQueue(message.guild.id);
    if(!queue) {
      return new DCJS.MessageEmbed({
        title: `No queue for ${message.guild.name} has been found`,
        description: `Add a song to the queue by using \`!${playCommand.names} ${playCommand.expectedArgs}\``,
        color: `${colorList.embedDefault}`,
        author: {
          name: `${client.user?.username}`,
          iconURL: `${client.user?.displayAvatarURL()}`,
        },
      })
    }

    return queue.songs[0].name

  }
} as ICommand
import { ICommand } from 'wokcommands-fixed';
import { distube } from '../../index';
import DCJS from 'discord.js';
import playCommand from '../music/play';
import colorList from '../../assets/colors';

export default {
  names: ['shuffle'],
  aliases: ['shuf'],
  category: 'Music',
  description: 'Shuffles the queue',

  slash: false,
  guildOnly: true,
  maxArgs: 0,

  callback: async ({client, message}) => {
    const guild = message.guild?.id
    if (!guild) { return }

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

    try {
      queue.shuffle()
    } catch(e) {
      console.log(e)
      return 'An error has occured! Please report this to the dev'
    }


  }
} as ICommand
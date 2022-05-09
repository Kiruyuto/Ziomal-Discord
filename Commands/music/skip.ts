import { ICommand } from 'wokcommands-fixed';
import { distube } from '../../index';
import DCJS from 'discord.js';
import playCommand from '../music/play';
import colorList from '../../assets/colors';

export default {
  names: ['skip'],
  aliases: ['s'],
  category: 'Music',
  description: 'Skip the current song',

  slash: false,
  guildOnly: true,

  maxArgs: 0,

  callback: async ({ client, message }) => {
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


    try { 
      console.log(queue.songs.length)
      if(queue.songs.length > 1) {
        queue.skip()
        return 'Skipped the song! That was last song in the queue!'
      } else {
        queue.stop()
        return 'There was no next song so I left the channel ¯\\_(ツ)_/¯'
      }

    } catch(e) {
    console.log(e)
    return 'An error has occured! Please report this to the dev'
    }

  }
} as ICommand
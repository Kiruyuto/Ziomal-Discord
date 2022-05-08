import { DiscordAPIError, MessageActionRow, MessageEmbed, MessageSelectMenu, MessageSelectOptionData } from 'discord.js';
import { ICommand } from 'wokcommands';
import { distube } from '../..';
import DCJS from 'discord.js';
import { AnyArray } from 'mongoose';

export default {
names: ['queue'],
aliases: ['q'],
category: 'Music',
description: 'Show the queue',

slash: false,
testOnly: true,
guildOnly: true,

minArgs: 0,
maxArgs: 1,
expectedArgs: '<pageNumber>',
expectedArgsTypes: ['INTEGER'],

callback: async ({client, message, args}) => {
  const guild = message.guild?.id;
  if (!guild) { return }
  const queue = distube.getQueue(message.guild.id);
  if(!queue) { return 'No queue found' }

  let embeds = []
  let perPage = 20
  let theSongs = queue.songs
  for(let i = 0; i< theSongs.length; i+=perPage) {
    let qus = theSongs
    const current = qus.slice(i, perPage)
    let j = i+1;
    const info = current.map((track) => `\`${j++}.\` [${track.name}](${track.url}) - ${track.formattedDuration}`).join("\n")
    const embed = new MessageEmbed()
      .setColor('#531D89')
      .setDescription(`${info}`)
    if(i<10) {
      embed.setTitle(`Queue of ${message.guild.name}**`)
      embed.setDescription(`__Now Playing:__\n[${theSongs[0].name}](${theSongs[0].url})\n\n__Up Next:__\n${info}`)
      embed.setFooter(`${queue.songs.length} songs in queue | ${queue.formattedDuration} total length`)

    }
    embeds.push(embed)
    perPage += 10;
  }
  return embeds[0]

  }
} as ICommand
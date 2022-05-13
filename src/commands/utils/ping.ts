import { ICommand } from 'wokcommands';
import colorValues from '../../assets/colors';
import DCJS from 'discord.js';

export default {
  names: ['ping'],
  category: 'Utility',
  description: 'Display the bot\'s ping',

  slash: 'both',
  //testOnly: true,
  //ownerOnly: true,
  maxArgs: 0,
  callback: ({ client }) => {
    return new DCJS.MessageEmbed({
      description: `:hourglass: ${client.ws.ping}ws ms`,
      color: colorValues.embedDefault
    })
  }
} as ICommand;
import { ICommand } from 'wokcommands';

export default {
  names: ['ping'],
  category: 'Utility',
  description: 'Display the bot\'s ping',
  
  slash: 'both',
  testOnly: true,
  //ownerOnly: true,
  maxArgs: 0,
  callback: ({ client }) => {
    return `Ping: ${client.ws.ping}ms`
  },
} as ICommand;
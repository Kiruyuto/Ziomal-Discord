import { ICommand } from 'wokcommands';

export default {
  category: 'Utility',
  description: 'Display the bot\'s ping',
  
  slash: 'both',
  testOnly: true,
  ownerOnly: true,

  callback: ({client}) => {
    return 'Ping: ' + client.ws.ping + ' ms.'
  },
} as ICommand;
import { ICommand } from "wokcommands";

export default {
  names: ['ping', 'latency'],
  category: 'Utility',
  description: 'Display the bot\'s ping',
  ephemeral: true,
  slash: 'both',
  testOnly: true,
  ownerOnly: true,

  callback: ({client}) => {
    return 'Ping: ' + client.ws.ping + ' ms.'
  },
} as ICommand;
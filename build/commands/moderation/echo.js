"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    names: ['echo'],
    aliases: ['say'],
    category: 'Moderation',
    description: 'Sends msg in a channel',
    //permissions: ['ADMINISTRATOR'],
    slash: 'both',
    ownerOnly: true,
    guildOnly: true,
    testOnly: true,
    hidden: true,
    minArgs: 2,
    expectedArgs: '<channel> <message>',
    expectedArgsTypes: ['CHANNEL', 'STRING'],
    callback: function (_a) {
        var message = _a.message, interaction = _a.interaction, args = _a.args;
        var channel = (message
            ? message.mentions.channels.first()
            : interaction.options.getChannel('channel'));
        if (!channel || channel.type !== 'GUILD_TEXT') {
            return 'Unable to fetch channel ID from message or interaction';
        }
        args.shift();
        var txt = args.join(' ');
        channel.send(txt);
        if (interaction) {
            interaction.reply({
                content: 'Message sent',
                ephemeral: true,
            });
        }
    }
};

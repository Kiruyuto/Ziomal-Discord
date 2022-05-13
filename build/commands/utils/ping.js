"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    names: ['ping'],
    category: 'Utility',
    description: 'Display the bot\'s ping',
    slash: 'both',
    testOnly: true,
    //ownerOnly: true,
    maxArgs: 0,
    callback: function (_a) {
        var client = _a.client;
        return "Ping: ".concat(client.ws.ping, "ms");
    },
};

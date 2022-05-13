"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = __importDefault(require("discord.js"));
var __1 = require("../..");
var colors_1 = __importDefault(require("../../assets/colors"));
var id_1 = __importDefault(require("../../assets/id"));
exports.default = {
    names: ['play'],
    aliases: ['p', 'pl'],
    category: 'Music',
    description: 'Play a song or a playlist',
    slash: 'both',
    //testOnly: true,
    guildOnly: true,
    minArgs: 1,
    expectedArgs: '<URL>',
    expectedArgsTypes: ['STRING'],
    callback: function (_a) {
        var client = _a.client, message = _a.message, args = _a.args, slashCmd = _a.interaction, guild = _a.guild, channel = _a.channel, member = _a.member;
        return __awaiter(void 0, void 0, void 0, function () {
            var embedWorkingOnIt, working, voicChannel, embedNoChannel, embedSameChannel, queue, queueLength, loopState, embedPlaying, error_1, embedDev_1, devDM;
            var _b, _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        _h.trys.push([0, 16, , 18]);
                        embedWorkingOnIt = new discord_js_1.default.MessageEmbed({
                            description: ':hourglass: Working on it...',
                            color: colors_1.default.embedDefault,
                        });
                        working = (message
                            ? channel.send({ embeds: [embedWorkingOnIt] })
                            : slashCmd.reply({ embeds: [embedWorkingOnIt], fetchReply: true }));
                        if (!working) {
                            return [2 /*return*/];
                        }
                        voicChannel = member.voice.channel;
                        embedNoChannel = new discord_js_1.default.MessageEmbed({
                            color: colors_1.default.embedDefault,
                            description: ':warning: You need to be connected to a voice channel!',
                        });
                        if (!!voicChannel) return [3 /*break*/, 2];
                        return [4 /*yield*/, working];
                    case 1:
                        (_h.sent()).edit({ content: ' ', embeds: [embedNoChannel] });
                        return [2 /*return*/];
                    case 2:
                        embedSameChannel = new discord_js_1.default.MessageEmbed({
                            color: colors_1.default.embedDefault,
                            description: ':warning: You need to be in the same channel as me!',
                        });
                        if (!(((_b = guild === null || guild === void 0 ? void 0 : guild.me) === null || _b === void 0 ? void 0 : _b.voice.channel) && member.voice.channel.id !== ((_d = (_c = guild === null || guild === void 0 ? void 0 : guild.me) === null || _c === void 0 ? void 0 : _c.voice.channel) === null || _d === void 0 ? void 0 : _d.id))) return [3 /*break*/, 4];
                        return [4 /*yield*/, working];
                    case 3:
                        (_h.sent()).edit({ content: ' ', embeds: [embedSameChannel] });
                        return [2 /*return*/];
                    case 4: return [4 /*yield*/, __1.distube.getQueue(guild)];
                    case 5:
                        queue = _h.sent();
                        if (!!queue) return [3 /*break*/, 8];
                        return [4 /*yield*/, __1.distube.play(voicChannel, args[0])];
                    case 6:
                        _h.sent();
                        return [4 /*yield*/, __1.distube.getQueue(guild)];
                    case 7:
                        queue = _h.sent();
                        return [3 /*break*/, 11];
                    case 8: return [4 /*yield*/, __1.distube.play(voicChannel, args[0])];
                    case 9:
                        _h.sent();
                        return [4 /*yield*/, __1.distube.getQueue(guild)];
                    case 10:
                        queue = _h.sent();
                        _h.label = 11;
                    case 11:
                        queueLength = (queue === null || queue === void 0 ? void 0 : queue.songs.length) - 1;
                        loopState = void 0;
                        (function (loopState) {
                            loopState[loopState["Disabled"] = 0] = "Disabled";
                            loopState[loopState["Song"] = 1] = "Song";
                            loopState[loopState["Queue"] = 2] = "Queue";
                        })(loopState || (loopState = {}));
                        embedPlaying = new discord_js_1.default.MessageEmbed({
                            author: {
                                name: "".concat((_e = client.user) === null || _e === void 0 ? void 0 : _e.username, " | Music menu"),
                                iconURL: member.displayAvatarURL(),
                            },
                            description: "Added to queue: **".concat(queue === null || queue === void 0 ? void 0 : queue.songs[queueLength].name, "**"),
                            color: colors_1.default.embedDefault,
                            thumbnail: { url: (_f = queue === null || queue === void 0 ? void 0 : queue.songs[queueLength]) === null || _f === void 0 ? void 0 : _f.thumbnail, },
                            fields: [
                                { name: 'Duration', value: "".concat(queue === null || queue === void 0 ? void 0 : queue.songs[queueLength].formattedDuration), inline: true },
                                { name: 'Queue position', value: "".concat(queue === null || queue === void 0 ? void 0 : queue.songs.length), inline: true },
                                { name: 'Volume', value: "".concat(queue === null || queue === void 0 ? void 0 : queue.volume), inline: true },
                                { name: 'Added by', value: "<@".concat(member.id, ">"), inline: true },
                                { name: 'Repeat mode', value: "".concat(loopState[queue === null || queue === void 0 ? void 0 : queue.repeatMode]), inline: true },
                                { name: 'Link', value: "[Click!](".concat((_g = queue === null || queue === void 0 ? void 0 : queue.songs[queueLength]) === null || _g === void 0 ? void 0 : _g.url, ")"), inline: true },
                            ],
                        });
                        if (!message) return [3 /*break*/, 13];
                        return [4 /*yield*/, working];
                    case 12:
                        (_h.sent()).edit({ content: ' ', embeds: [embedPlaying] });
                        return [3 /*break*/, 15];
                    case 13: return [4 /*yield*/, working];
                    case 14:
                        (_h.sent()).edit({ content: ' ', embeds: [embedPlaying] });
                        _h.label = 15;
                    case 15: return [3 /*break*/, 18];
                    case 16:
                        error_1 = _h.sent();
                        // Log the error in the console, send message to developer and inform the user about error
                        console.log(error_1);
                        embedDev_1 = new discord_js_1.default.MessageEmbed({
                            description: ":x: Something went wrong with `play` command in the **".concat(guild, "** `(").concat(guild === null || guild === void 0 ? void 0 : guild.id, "})` sever!"),
                            color: colors_1.default.embedDefault,
                        });
                        return [4 /*yield*/, client.users.fetch(id_1.default.KIRU)
                                .then(function (user) { return user.send({ content: "".concat(error_1), embeds: [embedDev_1] }); })];
                    case 17:
                        devDM = _h.sent();
                        return [2 /*return*/, new discord_js_1.default.MessageEmbed({
                                description: ':x: An error occured! Message has been sent to developer.',
                            })];
                    case 18: return [2 /*return*/];
                }
            });
        });
    },
};

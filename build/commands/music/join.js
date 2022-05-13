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
var index_1 = require("../../index");
var discord_js_1 = __importDefault(require("discord.js"));
var colors_1 = __importDefault(require("../../assets/colors"));
var id_1 = __importDefault(require("../../assets/id"));
exports.default = {
    names: ['join'],
    aliases: ['connect'],
    category: 'Music',
    description: 'Joins the voice channel of the user',
    slash: 'both',
    //testOnly: true,
    guildOnly: true,
    maxArgs: 0,
    callback: function (_a) {
        var client = _a.client, message = _a.message, slashCmd = _a.interaction, guild = _a.guild, member = _a.member;
        return __awaiter(void 0, void 0, void 0, function () {
            var channel, embedJoined, error_1, embedDev_1, devDM;
            var _b, _c, _d, _e, _f, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        _j.trys.push([0, 5, , 7]);
                        channel = member.voice.channel;
                        // Check if the channel exist and is proper type
                        if (!channel || channel.type !== 'GUILD_VOICE') {
                            return [2 /*return*/, new discord_js_1.default.MessageEmbed({
                                    description: ':warning: Channel doesnt exist or is not a valid type!',
                                    color: colors_1.default.embedDefault
                                })];
                        }
                        // Check if the user is in the same voice channel as the bot
                        if (((_b = guild === null || guild === void 0 ? void 0 : guild.me) === null || _b === void 0 ? void 0 : _b.voice.channel) && member.voice.channel.id !== ((_d = (_c = guild === null || guild === void 0 ? void 0 : guild.me) === null || _c === void 0 ? void 0 : _c.voice.channel) === null || _d === void 0 ? void 0 : _d.id)) {
                            return [2 /*return*/, new discord_js_1.default.MessageEmbed({
                                    color: colors_1.default.embedDefault,
                                    description: ':warning: You need to be in the same channel as me!',
                                })];
                        }
                        // Ensure that user can't use the command when bot is already connected
                        if (((_e = guild === null || guild === void 0 ? void 0 : guild.me) === null || _e === void 0 ? void 0 : _e.voice.channel) && ((_f = member === null || member === void 0 ? void 0 : member.voice.channel) === null || _f === void 0 ? void 0 : _f.id) !== ((_h = (_g = guild === null || guild === void 0 ? void 0 : guild.me) === null || _g === void 0 ? void 0 : _g.voice.channel) === null || _h === void 0 ? void 0 : _h.id)) {
                            return [2 /*return*/, new discord_js_1.default.MessageEmbed({
                                    color: colors_1.default.embedDefault,
                                    description: ':warning: You can\'t use it when im already in the channel!',
                                })];
                        }
                        index_1.distube.voices.join(member.voice.channel);
                        embedJoined = new discord_js_1.default.MessageEmbed({
                            description: ':white_check_mark: I joined the channel!',
                            color: colors_1.default.embedDefault,
                        });
                        if (!message) return [3 /*break*/, 2];
                        return [4 /*yield*/, message.reply({
                                embeds: [embedJoined]
                            })];
                    case 1:
                        _j.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, slashCmd.reply({
                            embeds: [embedJoined]
                        })];
                    case 3:
                        _j.sent();
                        _j.label = 4;
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        error_1 = _j.sent();
                        // Log the error in the console, send message to developer and inform the user about error
                        console.log(error_1);
                        embedDev_1 = new discord_js_1.default.MessageEmbed({
                            description: ":x: Something went wrong with `join` command in the **".concat(guild, "** `(").concat(guild === null || guild === void 0 ? void 0 : guild.id, "})` sever!"),
                            color: colors_1.default.embedDefault,
                        });
                        return [4 /*yield*/, client.users.fetch(id_1.default.KIRU)
                                .then(function (user) { return user.send({ content: "".concat(error_1), embeds: [embedDev_1] }); })];
                    case 6:
                        devDM = _j.sent();
                        return [2 /*return*/, new discord_js_1.default.MessageEmbed({
                                description: ':x: An error occured! Message has been sent to developer.',
                            })];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
};

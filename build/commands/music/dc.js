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
var id_1 = __importDefault(require("../../assets/id"));
var colors_1 = __importDefault(require("../../assets/colors"));
var index_1 = require("../../index");
exports.default = {
    names: ['dc', 'leave'],
    aliases: ['disconnect', 'leave', 'clearqueue'],
    category: 'Music',
    description: 'Disconnects the bot from the voice channel',
    slash: 'both',
    //testOnly: true,
    guildOnly: true,
    maxArgs: 0,
    callback: function (_a) {
        var client = _a.client, message = _a.message, slashCmd = _a.interaction, guild = _a.guild;
        return __awaiter(void 0, void 0, void 0, function () {
            var queue, error_1, embedDev_1, devDM;
            var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
            return __generator(this, function (_t) {
                switch (_t.label) {
                    case 0:
                        _t.trys.push([0, 2, , 4]);
                        // Check if the user is in the same voice !channel as the bot and return message if not
                        if ((message ? (_c = (_b = message.guild) === null || _b === void 0 ? void 0 : _b.me) === null || _c === void 0 ? void 0 : _c.voice.channel : (_e = (_d = slashCmd.guild) === null || _d === void 0 ? void 0 : _d.me) === null || _e === void 0 ? void 0 : _e.voice.channel) && (message ? (_g = (_f = message.member) === null || _f === void 0 ? void 0 : _f.voice.channel) === null || _g === void 0 ? void 0 : _g.id : (_h = slashCmd.member.voice.channel) === null || _h === void 0 ? void 0 : _h.id) !== (message ? (_l = (_k = (_j = message.guild) === null || _j === void 0 ? void 0 : _j.me) === null || _k === void 0 ? void 0 : _k.voice.channel) === null || _l === void 0 ? void 0 : _l.id : (_p = (_o = (_m = slashCmd.guild) === null || _m === void 0 ? void 0 : _m.me) === null || _o === void 0 ? void 0 : _o.voice.channel) === null || _p === void 0 ? void 0 : _p.id)) {
                            return [2 /*return*/, new discord_js_1.default.MessageEmbed({
                                    color: colors_1.default.embedDefault,
                                    description: ':warning: You need to be in the same channel as me!',
                                })];
                        }
                        return [4 /*yield*/, index_1.distube.getQueue(guild)];
                    case 1:
                        queue = _t.sent();
                        if (queue) {
                            queue.stop();
                            return [2 /*return*/, new discord_js_1.default.MessageEmbed({
                                    description: ":white_check_mark: Removed the queue and disconnected from **".concat(guild, "**'s ").concat((_q = guild === null || guild === void 0 ? void 0 : guild.me) === null || _q === void 0 ? void 0 : _q.voice.channel, "."),
                                    color: colors_1.default.embedDefault,
                                })];
                        }
                        else {
                            if ((_r = guild === null || guild === void 0 ? void 0 : guild.me) === null || _r === void 0 ? void 0 : _r.voice.channel) {
                                index_1.distube.voices.leave(guild);
                                return [2 /*return*/, new discord_js_1.default.MessageEmbed({
                                        description: ":white_check_mark: Disconnected from **".concat(guild, "**'s ").concat((_s = guild === null || guild === void 0 ? void 0 : guild.me) === null || _s === void 0 ? void 0 : _s.voice.channel, "."),
                                        color: colors_1.default.embedDefault,
                                    })];
                            }
                            else {
                                return [2 /*return*/, new discord_js_1.default.MessageEmbed({
                                        description: ":warning: I am not connected to any channel!",
                                        color: colors_1.default.embedDefault,
                                    })];
                            }
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _t.sent();
                        // Log the error in the console, send message to developer and inform the user about error
                        console.log(error_1);
                        embedDev_1 = new discord_js_1.default.MessageEmbed({
                            description: ":x: Something went wrong with `dc` command in the **".concat(guild, "** `(").concat(guild === null || guild === void 0 ? void 0 : guild.id, "})` sever!"),
                            color: colors_1.default.embedDefault,
                        });
                        return [4 /*yield*/, client.users.fetch(id_1.default.KIRU)
                                .then(function (user) { return user.send({ content: "".concat(error_1), embeds: [embedDev_1] }); })];
                    case 3:
                        devDM = _t.sent();
                        return [2 /*return*/, new discord_js_1.default.MessageEmbed({
                                description: ':x: An error occured! Message has been sent to developer.',
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
};

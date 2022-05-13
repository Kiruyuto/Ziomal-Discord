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
    names: ['np'],
    aliases: ['nowplaying', 'now', 'current'],
    category: 'Music',
    description: 'Display the currently playing song',
    slash: 'both',
    //testOnly: true,
    guildOnly: true,
    maxArgs: 0,
    callback: function (_a) {
        var client = _a.client, message = _a.message, slashCmd = _a.interaction, guild = _a.guild;
        return __awaiter(void 0, void 0, void 0, function () {
            var queue, embedCurrentSong, error_1, embedDev_1, devDM;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 6, , 8]);
                        return [4 /*yield*/, index_1.distube.getQueue(guild)];
                    case 1:
                        queue = _c.sent();
                        if (!queue) {
                            return [2 /*return*/, new discord_js_1.default.MessageEmbed({
                                    description: "No queue for **".concat(guild, "** has been found"),
                                    color: colors_1.default.embedDefault,
                                })];
                        }
                        embedCurrentSong = new discord_js_1.default.MessageEmbed({
                            color: colors_1.default.embedDefault,
                            thumbnail: { url: queue.songs[0].thumbnail },
                            title: "Currently playing:",
                            description: "".concat(queue.songs[0].name),
                            fields: [
                                { name: 'Link', value: "[Click!](".concat((_b = queue === null || queue === void 0 ? void 0 : queue.songs[0]) === null || _b === void 0 ? void 0 : _b.url, ")"), inline: true },
                                { name: 'Duration', value: "".concat(queue.formattedCurrentTime, " / ").concat(queue === null || queue === void 0 ? void 0 : queue.songs[0].formattedDuration), inline: true },
                            ]
                        });
                        if (!message) return [3 /*break*/, 3];
                        return [4 /*yield*/, message.reply({
                                embeds: [embedCurrentSong]
                            })];
                    case 2:
                        _c.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, slashCmd.reply({
                            embeds: [embedCurrentSong]
                        })];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        error_1 = _c.sent();
                        // Log the error in the console, send message to developer and inform the user about error
                        console.log(error_1);
                        embedDev_1 = new discord_js_1.default.MessageEmbed({
                            description: ":x: Something went wrong with `np` command in the **".concat(guild, "** `(").concat(guild === null || guild === void 0 ? void 0 : guild.id, "})` sever!"),
                            color: colors_1.default.embedDefault,
                        });
                        return [4 /*yield*/, client.users.fetch(id_1.default.KIRU)
                                .then(function (user) { return user.send({ content: "".concat(error_1), embeds: [embedDev_1] }); })];
                    case 7:
                        devDM = _c.sent();
                        return [2 /*return*/, new discord_js_1.default.MessageEmbed({
                                description: ':x: An error occured! Message has been sent to developer.',
                            })];
                    case 8: return [2 /*return*/];
                }
            });
        });
    }
};
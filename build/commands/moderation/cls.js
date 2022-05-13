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
exports.default = {
    names: ['cls', 'purge'],
    aliases: ['cls', 'purge', 'clear'],
    category: 'Moderation',
    description: 'Deletes given number of messages',
    requiredPermissions: ['MANAGE_MESSAGES'],
    slash: 'both',
    //testOnly: true,
    guildOnly: true,
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: '<amount>',
    expectedArgsTypes: ['INTEGER'],
    callback: function (_a) {
        var client = _a.client, message = _a.message, slashCmd = _a.interaction, args = _a.args, channel = _a.channel, guild = _a.guild;
        return __awaiter(void 0, void 0, void 0, function () {
            var amount, size, embedReply, error_1, embedDev_1, devDM;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 6]);
                        amount = parseInt(args.shift());
                        if (amount > 99 || amount < 1) {
                            return [2 /*return*/, new discord_js_1.default.MessageEmbed({
                                    description: 'You can delete between 1 and 99 messages at once',
                                    color: colors_1.default.embedDefault
                                })];
                        }
                        if (!message) return [3 /*break*/, 2];
                        return [4 /*yield*/, message.delete()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2: return [4 /*yield*/, channel.bulkDelete(amount, true)];
                    case 3:
                        size = (_b.sent()).size;
                        embedReply = new discord_js_1.default.MessageEmbed({
                            description: "Deleted ".concat(size, " messages"),
                            color: colors_1.default.embedDefault
                        });
                        //Reply to the user how many messages were deleted
                        if (message) {
                            channel.send({ embeds: [embedReply] }).then(function (m) { setTimeout(function () { return m.delete(); }, 3000); });
                        }
                        else {
                            slashCmd.reply({ embeds: [embedReply], fetchReply: true }).then(function () { setTimeout(function () { return slashCmd.deleteReply(); }, 3000); });
                        }
                        return [3 /*break*/, 6];
                    case 4:
                        error_1 = _b.sent();
                        // Log the error in the console, send message to developer and inform the user about error
                        console.log(error_1);
                        embedDev_1 = new discord_js_1.default.MessageEmbed({
                            description: ":x: Something went wrong with `cls` command in the **".concat(guild, "** `(").concat(guild === null || guild === void 0 ? void 0 : guild.id, "})` sever!"),
                            color: colors_1.default.embedDefault,
                        });
                        return [4 /*yield*/, client.users.fetch(id_1.default.KIRU)
                                .then(function (user) { return user.send({ content: "".concat(error_1), embeds: [embedDev_1] }); })];
                    case 5:
                        devDM = _b.sent();
                        return [2 /*return*/, new discord_js_1.default.MessageEmbed({
                                description: ':x: An error occured! Message has been sent to developer.',
                            })];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
};

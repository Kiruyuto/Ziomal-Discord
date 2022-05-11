import { TextChannel } from "discord.js";
import { ICommand } from "wokcommands";

export default {
  names: ["echo"],
  aliases: ["say"],
  category: "Moderation",
  description: "Sends msg in a channel",

  //permissions: ['ADMINISTRATOR'],
  slash: "both",
  ownerOnly: true,
  guildOnly: true,
  testOnly: true,
  hidden: true,

  minArgs: 2,
  expectedArgs: "<channel> <message>",
  expectedArgsTypes: ["CHANNEL", "STRING"],

  callback: ({ message, interaction, args }) => {
    const channel = (
      message
        ? message.mentions.channels.first()
        : interaction.options.getChannel("channel")
    ) as TextChannel;

    if (!channel || channel.type !== "GUILD_TEXT") {
      return "Unable to fetch channel ID from message or interaction";
    }

    args.shift();
    const txt = args.join(" ");
    channel.send(txt);

    if (interaction) {
      interaction.reply({
        content: "Message sent",
        ephemeral: true,
      });
    }
  },
} as ICommand;

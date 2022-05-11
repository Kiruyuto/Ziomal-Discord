import { ICommand } from "wokcommands";
import { distube } from "../../index";
import DCJS from "discord.js";
import colorList from "../../assets/colors";
import IDs from "../../assets/id";
import colorValues from "../../assets/colors";

export default {
  names: ["shuffle"],
  aliases: ["shuf", "mix"],
  category: "Music",
  description: "Shuffles the queue",

  slash: "both",
  //testOnly: true,
  guildOnly: true,
  maxArgs: 0,

  callback: async ({ client, message, interaction: slashCmd }) => {
    try {
      const guildID = message ? message.guild?.id : slashCmd.guild?.id;
      if (!guildID) {
        return;
      }

      const queue = await distube.getQueue(guildID);
      if (!queue) {
        return new DCJS.MessageEmbed({
          description: `:warning: No queue for **${
            message ? message.guild?.name : slashCmd.guild?.name
          }** has been found`,
          color: `${colorList.embedDefault}`,
        });
      }

      queue.shuffle();
      return new DCJS.MessageEmbed({
        description: ":white_check_mark: Shuffled the queue!",
        color: `${colorList.embedDefault}`,
      });
    } catch (error) {
      // Log the error in the console, send message to developer and inform the user about error
      console.log(error);

      let embedDev = new DCJS.MessageEmbed({
        description: `:x: Something went wrong with \`shuffle\` command in the **${
          message ? message.guild?.name : slashCmd.guild?.name
        }** \`(${message ? message.guild?.id : slashCmd.guild?.id})\` sever!`,
        color: `${colorValues.embedDefault}`,
      });
      const devDM = await client.users
        .fetch(`${IDs.KIRU}`)
        .then((user) => user.send({ content: `${error}`, embeds: [embedDev] }));

      return new DCJS.MessageEmbed({
        description:
          ":x: An error occured! Message has been sent to developer.",
      });
    }
  },
} as ICommand;

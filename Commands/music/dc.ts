import { ICommand } from "wokcommands";
import DCJS, { GuildMember } from "discord.js";
import IDs from "../../assets/id";
import colorValues from "../../assets/colors";
import { distube } from "../../index";

export default {
  names: ["dc", "leave"],
  aliases: ["disconnect", "leave", "clearqueue"],
  category: "Music",
  description: "Disconnects the bot from the voice channel",

  slash: "both",
  //testOnly: true,
  guildOnly: true,
  maxArgs: 0,

  callback: async ({ client, message, interaction: slashCmd }) => {
    try {
      let queue = await distube.getQueue(
        message ? message : (slashCmd.member as GuildMember).guild.id
      );
      if (!queue) {
        return new DCJS.MessageEmbed({
          description: `No queue for **${
            message ? message.guild?.name : slashCmd.guild?.name
          }** has been found`,
          color: `${colorValues.embedDefault}`,
        });
      }

      queue.stop();
      return new DCJS.MessageEmbed({
        description: `:white_check_mark: Disconnected from **${
          message ? message.guild?.name : slashCmd.guild?.name
        }**`,
        color: `${colorValues.embedDefault}`,
      });
    } catch (error) {
      // Log the error in the console, send message to developer and inform the user about error
      console.log(error);

      let embedDev = new DCJS.MessageEmbed({
        description: `:x: Something went wrong with \`dc\` command in the **${
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

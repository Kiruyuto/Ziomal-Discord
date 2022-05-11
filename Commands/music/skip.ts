import { ICommand } from "wokcommands";
import { distube } from "../../index";
import DCJS, { GuildMember } from "discord.js";
import IDs from "../../assets/id";
import colorValues from "../../assets/colors";

export default {
  names: ["skip"],
  aliases: ["s"],
  category: "Music",
  description: "Skip the current song",

  slash: "both",
  //testOnly: true,
  guildOnly: true,

  maxArgs: 0,

  callback: async ({ client, message, interaction: slashCmd }) => {
    try {
      //Get the guild ID
      const guild = message ? message.guild?.id : slashCmd.guild?.id;
      if (!guild) {
        return;
      }

      // Check if the user is in the same channel as the bot
      if (
        (message
          ? message.guild?.me?.voice.channel
          : slashCmd.guild?.me?.voice.channel) &&
        (message
          ? message.member?.voice.channel?.id
          : (slashCmd.member as GuildMember).voice.channel?.id) !==
          (message
            ? message.guild?.me?.voice.channel?.id
            : slashCmd.guild?.me?.voice.channel?.id)
      ) {
        return new DCJS.MessageEmbed({
          color: `${colorValues.embedDefault}`,
          description: ":warning: You need to be in the same channel as me!",
        });
      }

      // Get the queue and return message if there is no queue
      let queue = await distube.getQueue(
        message ? message : (slashCmd.member as GuildMember).guild.id
      );
      if (!queue) {
        return new DCJS.MessageEmbed({
          description: `:warning: I am not playing anything right now!`,
          color: `${colorValues.embedDefault}`,
        });
      }

      if (queue.songs.length > 1) {
        queue.skip();
        return new DCJS.MessageEmbed({
          description: ":white_check_mark:  Skipped the song!",
          color: `${colorValues.embedDefault}`,
        });
      } else {
        queue.stop();
        return new DCJS.MessageEmbed({
          description:
            ":white_check_mark:  There was no next song so I left the channel ¯\\_(ツ)_/¯",
          color: `${colorValues.embedDefault}`,
        });
      }
    } catch (error) {
      // Log the error in the console, send message to developer and inform the user about error
      console.log(error);

      let embedDev = new DCJS.MessageEmbed({
        description: `:x: Something went wrong with \`skip\` command in the **${
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

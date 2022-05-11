import { ICommand } from "wokcommands";
import { distube } from ".";
import DCJS from "discord.js";
import colorValues from "./assets/colors";

export default {
  names: ["queue"],
  aliases: ["q"],
  category: "Music",
  description: "Show the queue",

  slash: "both",
  testOnly: true,
  guildOnly: true,

  minArgs: 0,
  maxArgs: 1,
  expectedArgs: "<pageNumber>",
  expectedArgsTypes: ["INTEGER"],

  callback: async ({
    client,
    message,
    args,
    instance,
    interaction: slashCmd,
  }) => {
    const Channel = slashCmd.channel as DCJS.TextChannel;
    distube.emitError(Error("xd"), Channel);

    // const guild = message.guild?.id;
    // if (!guild) { return }

    // const queue = distube.getQueue(message.guild.id);
    // if(!queue) {
    //   return new DCJS.MessageEmbed({
    //     description: `No queue for **${message ? message.guild?.name : slashCmd.guild?.name}** has been found`,
    //     color: `${colorValues.embedDefault}`,
    //   })
    // }

    // let embeds = []
    // let perPage = 20
    // let songList = queue.songs

    // for(let i = 0; i< songList.length; i+=perPage) {
    //   let cpSongList = songList
    //   const current = cpSongList.slice(i, perPage) //all between i and perPage (20)

    // }

    // for(let i = 0; i< theSongs.length; i+=perPage) {
    //   let qus = theSongs
    //   const current = qus.slice(i, perPage)
    //   let j = i+1;
    //   const info = current.map((track) => `\`${j++}.\` [${track.name}](${track.url}) - ${track.formattedDuration}`).join("\n")
    //   const embed = new MessageEmbed()
    //     .setColor(`${colorList.embedDefault}`)
    //     .setDescription(`${info}`)
    //   if(i<10) {
    //     embed.setTitle(`Queue of ${message.guild.name}**`)
    //     embed.setDescription(`__Now Playing:__\n[${theSongs[0].name}](${theSongs[0].url})\n\n__Up Next:__\n${info}`)
    //     embed.setFooter(`${queue.songs.length} songs in queue | ${queue.formattedDuration} total length`)

    //   }
    //   embeds.push(embed)
    //   perPage += 10;
    // }
    // return embeds[0]
  },
} as ICommand;

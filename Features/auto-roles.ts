import {
  Client,
  GuildEmoji,
  GuildMember,
  Message,
  MessageActionRow,
  MessageSelectMenu,
  MessageSelectOptionData,
  TextChannel,
} from "discord.js";
import WOK from "wokcommands";
import roleSchema from "./models/roles-schema";
import IDs from "../assets/id";

const LARoles = {
  //ASSASINS
  ":XDeathblade": [IDs.DEATHBLADE, "Deathblade", "Assasin"],
  ":XShadowhunter": [IDs.SHADOWHUNTER, "Shadowhunter", "Assasin"],
  //GUNNERS
  ":XArtillerist": [IDs.ARTILLERIST, "Artillerist", "Gunner"],
  ":XDeadeye": [IDs.DEADEYE, "Deadeye", "Gunner"],
  ":XGunslinger": [IDs.GUNSLINGER, "Gunslinger", "Gunner"],
  ":XSharpshooter": [IDs.SHARPSHOOTER, "Sharpshooter", "Gunner"],
  //MAGES
  ":XBard": [IDs.BARD, "Bard", "Mage"],
  ":XSorceress": [IDs.SORCERESS, "Sorceress", "Mage"],
  //MARTIAL ARTISTS
  ":XGlaivier": [IDs.GLAIVIER, "Glaivier", "Martial Artist"],
  ":XScrapper": [IDs.SCRAPPER, "Scrapper", "Martial Artist"],
  ":XSoulfist": [IDs.SOULFIST, "Soulfist", "Martial Artist"],
  ":XStriker": [IDs.STRIKER, "Striker", "Martial Artist"],
  ":XWardancer": [IDs.WARDANCER, "Wardancer", "Martial Artist"],
  //WARRIORS
  ":XBerserker": [IDs.BERSERKER, "Berserker", "Warrior"],
  ":XDestroyer": [IDs.DESTROYER, "Destroyer", "Warrior"],
  ":XGunlancer": [IDs.GUNLANCER, "Gunlancer", "Warrior"],
  ":XPaladin": [IDs.PALADIN, "Paladin", "Warrior"],
} as {
  [key: string]: string[];
};

export default async (client: Client, instance: WOK) => {
  if (!instance.isDBConnected()) {
    return;
  }

  const guild = client.guilds.cache.get(IDs.GUILD);
  if (!guild) {
    return;
  }

  const channel = guild.channels.cache.get(
    IDs.ROLE_CLAIM_CHANNEL
  ) as TextChannel;
  if (!channel) {
    return;
  }

  let results = await roleSchema.findById(guild.id);
  const keys = Object.keys(LARoles);
  const rows: MessageActionRow[] = [];
  const options: MessageSelectOptionData[] = [];
  const text = "Ktorymi klasami grasz?";

  for (let a = 0; a < keys.length; ++a) {
    let emoji: string | GuildEmoji = keys[a];
    const [id, roleName, desc] = LARoles[emoji];

    if (emoji.startsWith(":")) {
      emoji = guild.emojis.cache.find((e) => {
        if (typeof emoji === "string") {
          return e.name === emoji.substring(1);
        }

        return false;
      }) as GuildEmoji;
    }

    options.push({
      label: roleName,
      value: id,
      emoji,
      description: desc,
    });
  }

  rows.push(
    new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("role_select")
        .setMinValues(0)
        .setMaxValues(options.length)
        .setPlaceholder("Select Your Roles...")
        .addOptions(options)
    )
  );

  if (results) {
    const message = (await channel.messages
      .fetch(results.messageId, {
        cache: true,
        force: true,
      })
      .catch(() => {})) as Message;

    if (message) {
      message.edit({
        content: text,
        components: rows,
      });
    } else {
      results = null;
    }
  }

  if (!results) {
    const message = await channel.send({
      content: text,
      components: rows,
    });

    await roleSchema.findOneAndUpdate(
      {
        _id: guild.id,
      },
      {
        _id: guild.id,
        messageId: message.id,
      },
      {
        upsert: true,
      }
    );
  }

  client.on("interactionCreate", (interaction) => {
    if (
      !interaction.isSelectMenu() ||
      interaction.channelId !== IDs.ROLE_CLAIM_CHANNEL
    ) {
      return;
    }

    const { customId, values, member } = interaction;

    if (customId === "role_select" && member instanceof GuildMember) {
      const component = interaction.component as MessageSelectMenu;
      const removed = component.options.filter(
        (role) => !values.includes(role.value)
      );
      for (const id of removed) {
        member.roles.remove(id.value);
      }

      for (const id of values) {
        member.roles.add(id);
      }

      interaction.reply({
        ephemeral: true,
        content: "Roles updated!",
      });
      //console.log(`[${member.user.tag}] Roles updated!`)
    }
  });
};

export const config = {
  dbName: "AUTO_ROLES",
  displayName: "Auto Roles",
};

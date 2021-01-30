import { EmbedFieldData } from "discord.js";
import { getChannelName } from "../modules/converter";
import { sendEmbed } from "../modules/embedSender";
import { firestore } from "../modules/firebase";
import { log } from "../modules/logger";
import { checkPermission } from "../modules/permissionChecker";
import { client } from "../app";
import props from "../props";
import { Interaction, Locale, State, VoiceRole } from "../";

export default {
  name: "voicerole",
  version: 2,
  options(locale: Locale) {
    return [
      {
        type: 1,
        name: "view",
        description: `${locale.manager} ${locale.voiceRole.options.view}`,
      },
      {
        type: 1,
        name: "add",
        description: `${locale.manager} ${locale.voiceRole.options.add}`,
        options: [
          {
            type: 7,
            name: "voiceChannel",
            description: locale.voiceChannel,
            required: true,
          },
          {
            type: 8,
            name: "role",
            description: locale.role,
            required: true,
          },
          {
            type: 7,
            name: "textChannel",
            description: locale.voiceRole.options.channelToSendLogs,
            required: false,
          },
        ],
      },
      {
        type: 1,
        name: "remove",
        description: `${locale.manager} ${locale.voiceRole.options.remove}`,
        options: [
          {
            type: 7,
            name: "voiceChannel",
            description: locale.voiceChannel,
            required: true,
          },
        ],
      },
      {
        type: 1,
        name: "purge",
        description: `${locale.manager} ${locale.voiceRole.options.purge}`,
      },
      {
        type: 1,
        name: "update",
        description: `${locale.manager} ${locale.voiceRole.options.update}`,
      },
    ];
  },
  async execute(state: State, interaction: Interaction) {
    try {
      if (await checkPermission(state.locale, { interaction: interaction }, "MANAGE_ROLES")) return;

      const guild = client.guilds.cache.get(interaction.guild_id);

      const method = interaction.data.options[0].name;

      const configDocRef = firestore.collection(guild.id).doc("config");

      if (method === "view") {
      } else if (method === "add") {
        state.voiceRoles.push({
          voiceChannel: interaction.data.options[0].options[0].value,
          role: interaction.data.options[0].options[1].value,
          textChannel: interaction.data.options[0].options.length >= 3 ? interaction.data.options[0].options[2].value : null,
        });

        await configDocRef.update({ voiceRole: state.voiceRoles });
      } else if (method === "remove") {
        const voiceChannel = interaction.data.options[0].options[0].value;

        const idx = state.voiceRoles.findIndex((voiceRole: VoiceRole) => voiceRole.voiceChannel === voiceChannel);
        state.voiceRoles.splice(idx, 1);

        await configDocRef.update({ voiceRole: state.voiceRoles });
      } else if (method === "purge") {
        state.voiceRoles = [];
        await configDocRef.update({ voiceRole: [] });
      } else if (method === "update") {
        const payload: { member: string; action: string; role: string }[] = [];
        for (const voiceRole of state.voiceRoles) {
          if (!client.channels.cache.has(voiceRole.voiceChannel)) continue;

          for (const [memberID, member] of client.guilds.cache.get(interaction.guild_id).roles.cache.get(voiceRole.role).members) {
            if (member.voice.channelID === voiceRole.voiceChannel) continue;
            await member.roles.remove(voiceRole.role, "[VoiceRole] Force Update");
            payload.push({ member: memberID, action: "-=", role: voiceRole.role });
          }

          for (const [memberID, member] of client.guilds.cache.get(interaction.guild_id).channels.cache.get(voiceRole.voiceChannel).members) {
            if (member.user.bot || member.roles.cache.has(voiceRole.role)) continue;
            await member.roles.add(voiceRole.role, "[VoiceRole] Force Update");
            payload.push({ member: memberID, action: "+=", role: voiceRole.role });
          }
        }

        let description = payload.length ? `✅ **${state.locale.voiceRole.updated.replace("{cnt}", String(payload.length))}**` : `🙅 **${state.locale.voiceRole.noChanges}**\n`;
        payload.forEach((item) => (description += `\n<@${item.member}> **${item.action}** <@&${item.role}>`));

        return sendEmbed(
          { interaction: interaction },
          {
            color: props.color.purple,
            title: `**⚙️ ${state.locale.voiceRole.voiceRole}**`,
            description: description,
            timestamp: new Date(),
          },
          { guild: true }
        );
      }

      const fields: EmbedFieldData[] = [];
      if (state.voiceRoles.length >= 1)
        state.voiceRoles.forEach((voiceRole: VoiceRole) =>
          fields.push({
            name: `${getChannelName(guild, voiceRole.voiceChannel)}`,
            value: `<@&${voiceRole.role}>${voiceRole.textChannel ? `(<#${voiceRole.textChannel}>)` : ""}`,
          })
        );

      return sendEmbed(
        { interaction: interaction },
        {
          color: props.color.yellow,
          title: `**⚙️ ${state.locale.voiceRole.voiceRole}**`,
          fields: fields.length >= 1 ? fields : [{ name: "\u200B", value: state.locale.voiceRole.empty }],
          timestamp: new Date(),
        },
        { guild: true }
      );
    } catch (err) {
      log.e(`VoiceRole > ${err}`);
    }
  },
};

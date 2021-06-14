import { EmbedFieldData } from "discord.js";
import { createError } from "../modules/createError";
import { firestore } from "../modules/firebase";
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
      if (await checkPermission(state.locale, { interaction: interaction }, "MANAGE_ROLES")) throw new Error("Missing Permissions");

      const guild = client.guilds.resolve(interaction.guild_id);

      const configDocRef = firestore.collection(guild.id).doc("config");

      const method = interaction.data.options[0].name;
      if (method === "view") {
      } else if (method === "add") {
        const voiceChannel: string = interaction.data.options[0].value;
        const textChannel: string = interaction.data.options[2].value;

        if (client.channels.resolve(voiceChannel).type !== "voice")
          return [
            {
              color: props.color.red,
              title: `**⚙️ ${state.locale.voiceRole.voiceRole}**`,
              description: `❌ **${state.locale.notVoiceChannel}**`,
            },
          ];
        if (client.channels.resolve(textChannel).type !== "text")
          return [
            {
              color: props.color.red,
              title: `**⚙️ ${state.locale.voiceRole.voiceRole}**`,
              description: `❌ **${state.locale.notTextChannel}**`,
            },
          ];

        state.voiceRoles.push({
          voiceChannel: voiceChannel,
          role: interaction.data.options[0].options[1].value,
          textChannel: interaction.data.options[0].options.length >= 3 ? textChannel : null,
        });

        await configDocRef.update({ voiceRole: state.voiceRoles });
      } else if (method === "remove") {
        const voiceChannel = interaction.data.options[0].options[0].value;

        if (client.channels.resolve(voiceChannel).type !== "voice")
          return [
            {
              color: props.color.red,
              title: `**⚙️ ${state.locale.voiceRole.voiceRole}**`,
              description: `❌ **${state.locale.notVoiceChannel}**`,
            },
          ];

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

          for (const [memberID, member] of client.guilds.resolve(interaction.guild_id).roles.resolve(voiceRole.role).members) {
            if (member.voice.channelID === voiceRole.voiceChannel) continue;
            await member.roles.remove(voiceRole.role, "[VoiceRole] Force Update");
            payload.push({ member: memberID, action: "-=", role: voiceRole.role });
          }

          for (const [memberID, member] of client.guilds.resolve(interaction.guild_id).channels.resolve(voiceRole.voiceChannel).members) {
            if (member.user.bot || member.roles.cache.has(voiceRole.role)) continue;
            await member.roles.add(voiceRole.role, "[VoiceRole] Force Update");
            payload.push({ member: memberID, action: "+=", role: voiceRole.role });
          }
        }

        let description = payload.length ? `✅ **${state.locale.voiceRole.updated.replace("{cnt}", String(payload.length))}**` : `🙅 **${state.locale.voiceRole.noChanges}**\n`;
        payload.forEach((item) => (description += `\n<@${item.member}> **${item.action}** <@&${item.role}>`));

        return [
          {
            color: props.color.purple,
            title: `**⚙️ ${state.locale.voiceRole.voiceRole}**`,
            description: description,
          },
        ];
      }

      const fields: EmbedFieldData[] = [];
      if (state.voiceRoles.length >= 1)
        state.voiceRoles.forEach((voiceRole: VoiceRole) =>
          fields.push({
            name: `${guild.channels.resolve(voiceRole.voiceChannel).name}`,
            value: `<@&${voiceRole.role}>${voiceRole.textChannel ? `(<#${voiceRole.textChannel}>)` : ""}`,
          })
        );

      return [
        {
          color: props.color.yellow,
          title: `**⚙️ ${state.locale.voiceRole.voiceRole}**`,
          fields: fields.length >= 1 ? fields : [{ name: "\u200B", value: state.locale.voiceRole.empty }],
        },
      ];
    } catch (err) {
      createError("VoiceRole", err, { interaction: interaction });
    }
  },
};

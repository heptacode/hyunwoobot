import { EmbedFieldData, TextChannel } from "discord.js";
import { client } from "../app";
import firestore from "../modules/firestore";
import { getChannelName } from "../modules/converter";
import props from "../props";
import { Interaction, Locale, State, VoiceRole } from "../";
import Log from "../modules/logger";

export default {
  name: "voicerole",
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
    ];
  },
  async execute(state: State, interaction: Interaction) {
    try {
      const guild = client.guilds.cache.get(interaction.guild_id);
      const channel = guild.channels.cache.get(interaction.channel_id) as TextChannel;

      if (!guild.members.cache.get(interaction.member.user.id).hasPermission("MANAGE_CHANNELS"))
        return (await client.users.cache.get(interaction.member.user.id).createDM()).send(state.locale.insufficientPerms.manage_channels);

      const method = interaction.data.options[0].name;

      const configDocRef = firestore.collection(guild.id).doc("config");
      const configDocSnapshot = await configDocRef.get();

      let voiceRole: VoiceRole[] = [];

      if (method === "view") {
        voiceRole = configDocSnapshot.data().voiceRole as VoiceRole[];
      } else if (method === "add") {
        const voiceChannel = interaction.data.options[0].options[0].value;
        const role = interaction.data.options[0].options[1].value;
        const textChannel = interaction.data.options[0].options[2].value;

        voiceRole = configDocSnapshot.data().voiceRole as VoiceRole[];

        if (!textChannel) voiceRole.push({ voiceChannel: voiceChannel, role: role });
        else voiceRole.push({ voiceChannel: voiceChannel, role: role, textChannel: textChannel });

        await configDocRef.update({ voiceRole: voiceRole });
      } else if (method === "remove") {
        const voiceChannel = interaction.data.options[0].options[0].value;

        voiceRole = configDocSnapshot.data().voiceRole as VoiceRole[];

        const idx = voiceRole.findIndex((voiceConfig: VoiceRole) => voiceConfig.voiceChannel === voiceChannel);
        voiceRole.splice(idx, 1);

        await configDocRef.update({ voiceRole: voiceRole });
      } else if (method === "purge") {
        await configDocRef.update({ voiceRole: [] });
      }

      const fields: EmbedFieldData[] = [];
      if (voiceRole.length >= 1)
        voiceRole.forEach((voiceConfig: VoiceRole) => {
          fields.push({
            name: `${getChannelName(guild, voiceConfig.voiceChannel)}`,
            value: `<@&${voiceConfig.role}>${voiceConfig.textChannel ? `(<#${voiceConfig.textChannel}>)` : ""}`,
          });
        });

      return channel.send({
        embed: { title: state.locale.voiceRole.voiceRole, color: props.color.yellow, fields: fields.length >= 1 ? fields : [{ name: "\u200B", value: state.locale.voiceRole.empty }] },
      });
    } catch (err) {
      Log.e(`Voice > ${err}`);
    }
  },
};

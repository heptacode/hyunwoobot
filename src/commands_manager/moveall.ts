import { Guild, GuildChannel } from "discord.js";
import { createError } from "../modules/createError";
import { checkPermission } from "../modules/permissionChecker";
import { client } from "../app";
import props from "../props";
import { Interaction, Locale, State } from "../";

export default {
  name: "moveall",
  version: 2,
  options(locale: Locale) {
    return [
      {
        type: 7,
        name: "from",
        description: locale.voiceChannel,
        required: true,
      },
      {
        type: 7,
        name: "to",
        description: locale.voiceChannel,
        required: true,
      },
    ];
  },
  async execute(state: State, interaction: Interaction) {
    try {
      if (await checkPermission(state.locale, { interaction: interaction }, "MOVE_MEMBERS")) throw new Error("Missing Permissions");

      const guild: Guild = client.guilds.resolve(interaction.guild_id);
      const fromChannel: GuildChannel = guild.channels.resolve(interaction.data.options[0].value);
      const targetChannel: GuildChannel = guild.channels.resolve(interaction.data.options[1].value);

      if (fromChannel.type !== "voice" || targetChannel.type !== "voice")
        return [
          {
            color: props.color.red,
            title: `**⚙️ ${state.locale.move.move}**`,
            description: `❌ **${state.locale.notVoiceChannel}**`,
          },
        ];

      const cnt = fromChannel.members.size;
      if (cnt <= 0) return;

      for (const [key, member] of fromChannel.members) {
        try {
          await member.voice.setChannel(targetChannel, `[MoveAll] Executed by ${interaction.member.user.username}#${interaction.member.user.discriminator}`);
        } catch (err) {}
      }

      return [
        {
          color: props.color.green,
          title: `**⚙️ ${state.locale.move.move}**`,
          description: `✅ **${cnt}${state.locale.move.moved}${fromChannel.name} ➡️ ${targetChannel.name}**`,
        },
      ];
    } catch (err) {
      createError("MoveAll", err, { interaction: interaction });
    }
  },
};

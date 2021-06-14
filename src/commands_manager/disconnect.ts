import { GuildChannel } from "discord.js";
import { createError } from "../modules/createError";
import { checkPermission } from "../modules/permissionChecker";
import { client } from "../app";
import props from "../props";
import { Interaction, Locale, State } from "../";

export default {
  name: "disconnect",
  version: 1,
  options(locale: Locale) {
    return [{ type: 7, name: "voiceChannel", description: locale.voiceChannel, required: true }];
  },
  async execute(state: State, interaction: Interaction) {
    try {
      if (await checkPermission(state.locale, { interaction: interaction }, "MOVE_MEMBERS")) throw new Error("Missing Permissions");

      const channel: GuildChannel = client.channels.resolve(interaction.data.options[0].value) as GuildChannel;

      if (channel.type !== "voice")
        return [
          {
            color: props.color.red,
            title: `**⚙️ ${state.locale.disconnect.disconnect}**`,
            description: `❌ **${state.locale.notVoiceChannel}**`,
          },
        ];

      const cnt = channel.members.size;
      if (cnt <= 0) return;

      for (const [key, member] of channel.members) {
        try {
          await member.voice.kick(`[Disconnect] Executed by ${interaction.member.user.username}#${interaction.member.user.discriminator}}`);
        } catch (err) {}
      }

      return [
        {
          color: props.color.purple,
          title: `**⚙️ ${state.locale.disconnect.disconnect}**`,
          description: `✅ **${state.locale.disconnect.disconnected
            .replace("{voiceChannel}", client.guilds.resolve(interaction.guild_id).channels.resolve(interaction.data.options[0].value).name)
            .replace("{cnt}", String(cnt))}**`,
        },
      ];
    } catch (err) {
      createError("Disconnect", err, { interaction: interaction });
    }
  },
};

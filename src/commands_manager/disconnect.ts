import { GuildChannel } from "discord.js";
import { getChannelName } from "../modules/converter";
import { sendEmbed } from "../modules/embedSender";
import Log from "../modules/logger";
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
      if (await checkPermission(state.locale, { interaction: interaction }, "MOVE_MEMBERS")) return;

      const channel: GuildChannel = client.channels.cache.get(interaction.data.options[0].value) as GuildChannel;

      const cnt = channel.members.size;
      if (cnt <= 0) return;

      for (const [key, member] of channel.members) {
        try {
          await member.voice.kick();
        } catch (err) {}
      }

      return sendEmbed(
        { interaction: interaction },
        {
          color: props.color.purple,
          title: state.locale.disconnect.disconnect,
          description: `**${cnt}${state.locale.disconnect.disconnected}${getChannelName(client.guilds.cache.get(interaction.guild_id), interaction.data.options[0].value)}**`,
          timestamp: new Date(),
        },
        { guild: true }
      );
    } catch (err) {
      Log.e(`Disconnect > ${err}`);
    }
  },
};

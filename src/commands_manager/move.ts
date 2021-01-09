import { Guild, GuildChannel } from "discord.js";
import { getChannelName } from "../modules/converter";
import { sendEmbed } from "../modules/embedSender";
import Log from "../modules/logger";
import { checkPermission } from "../modules/permissionChecker";
import { client } from "../app";
import props from "../props";
import { Interaction, Locale, State } from "../";

export default {
  name: "move",
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
      if (await checkPermission(state.locale, { interaction: interaction }, "MOVE_MEMBERS")) return;

      const fromChannel = interaction.data.options[0].value;
      const targetChannel = interaction.data.options[1].value;

      const guild: Guild = client.guilds.cache.get(interaction.guild_id);
      const channel: GuildChannel = guild.channels.cache.get(fromChannel) as GuildChannel;

      const cnt = channel.members.size;
      if (cnt <= 0) return;

      for (const [key, member] of channel.members) {
        try {
          await member.voice.setChannel(targetChannel);
        } catch (err) {}
      }

      return sendEmbed(
        { interaction: interaction },
        {
          color: props.color.green,
          title: `⚙️ ${state.locale.move.move}`,
          description: `✅ **${cnt}${state.locale.move.moved}${getChannelName(guild, fromChannel)} ➡️ ${getChannelName(guild, targetChannel)}**`,
          timestamp: new Date(),
        },
        { guild: true }
      );
    } catch (err) {
      Log.e(`Move > ${err}`);
    }
  },
};

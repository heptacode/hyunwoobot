import { Guild, GuildChannel } from "discord.js";
import { sendEmbed } from "../modules/embedSender";
import { log } from "../modules/logger";
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

      const guild: Guild = client.guilds.resolve(interaction.guild_id);
      const fromChannel: GuildChannel = guild.channels.resolve(interaction.data.options[0].value);
      const targetChannel: GuildChannel = guild.channels.resolve(interaction.data.options[1].value);

      if (fromChannel.type !== "voice" || targetChannel.type !== "voice")
        return sendEmbed(
          { interaction: interaction },
          {
            color: props.color.red,
            title: `**⚙️ ${state.locale.move.move}**`,
            description: `❌ **${state.locale.notVoiceChannel}**`,
          }
        );

      const cnt = fromChannel.members.size;
      if (cnt <= 0) return;

      for (const [key, member] of fromChannel.members) {
        try {
          await member.voice.setChannel(targetChannel, `[Move] Executed by ${interaction.member.user.username}#${interaction.member.user.discriminator}`);
        } catch (err) {}
      }

      return sendEmbed(
        { interaction: interaction },
        {
          color: props.color.green,
          title: `**⚙️ ${state.locale.move.move}**`,
          description: `✅ **${cnt}${state.locale.move.moved}${fromChannel.name} ➡️ ${targetChannel.name}**`,
          timestamp: new Date(),
        },
        { guild: true }
      );
    } catch (err) {
      log.e(`Move > ${err}`);
    }
  },
};

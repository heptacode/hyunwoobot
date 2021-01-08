import { TextChannel } from "discord.js";
import { getChannelName } from "../modules/converter";
import { Interaction, Locale, State } from "../";
import Log from "../modules/logger";
import props from "../props";
import { client } from "../app";

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
      const guild = client.guilds.cache.get(interaction.guild_id);
      const channel = guild.channels.cache.get(interaction.channel_id) as TextChannel;

      if (!guild.members.cache.get(interaction.member.user.id).hasPermission("MOVE_MEMBERS"))
        return (await client.users.cache.get(interaction.member.user.id).createDM()).send(state.locale.insufficientPerms.move_members);

      const fromChannel = interaction.data.options[0].value;
      const targetChannel = interaction.data.options[1].value;

      const cnt = guild.channels.cache.get(fromChannel).members.size;
      if (cnt <= 0) return;

      for (const [key, member] of guild.channels.cache.get(fromChannel).members) {
        try {
          await member.voice.setChannel(targetChannel);
        } catch (err) {}
      }

      return channel.send({
        embed: {
          color: props.color.primary,
          author: { name: `⚙️ ${state.locale.move.move}` },
          description: `${cnt}${state.locale.move.moved}${getChannelName(guild, fromChannel)} ➡️ ${getChannelName(guild, targetChannel)}`,
          footer: { text: `${interaction.member.user.username}#${interaction.member.user.discriminator}` },
          timestamp: new Date(),
        },
      });
    } catch (err) {
      Log.e(`Move > ${err}`);
    }
  },
};

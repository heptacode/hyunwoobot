import { TextChannel } from "discord.js";
import { client } from "../app";
import { getChannelName } from "../modules/converter";
import { Interaction, Locale, State } from "../";
import props from "../props";
import Log from "../modules/logger";

export default {
  name: "disconnect",
  version: 1,
  options(locale: Locale) {
    return [{ type: 7, name: "voiceChannel", description: locale.voiceChannel, required: true }];
  },
  async execute(state: State, interaction: Interaction) {
    try {
      const guild = client.guilds.cache.get(interaction.guild_id);
      const channel = guild.channels.cache.get(interaction.channel_id) as TextChannel;

      if (!guild.members.cache.get(interaction.member.user.id).hasPermission("MOVE_MEMBERS"))
        return (await client.users.cache.get(interaction.member.user.id).createDM()).send(state.locale.insufficientPerms.move_members);

      const cnt = guild.channels.cache.get(interaction.data.options[0].value).members.size;
      if (cnt <= 0) return;

      for (const [key, member] of guild.channels.cache.get(interaction.data.options[0].value).members) {
        try {
          await member.voice.kick();
        } catch (err) {}
      }

      return channel.send({
        embed: {
          color: props.color.purple,
          author: { name: state.locale.disconnect.disconnect },
          description: `${cnt}${state.locale.disconnect.disconnected}${getChannelName(guild, interaction.data.options[0].value)}`,
          footer: { text: `${interaction.member.user.username}#${interaction.member.user.discriminator}` },
          timestamp: new Date(),
        },
      });
    } catch (err) {
      Log.e(`Disconnect > ${err}`);
    }
  },
};

import { GuildMember, Message, TextChannel } from "discord.js";
import { client } from "../app";
import { getChannelName } from "../modules/converter";
import { Interaction, State } from "../";
import Log from "../modules/logger";

export default {
  name: "disconnectall",
  options: [{ type: 7, name: "voiceChannel", description: "VoiceChannel", required: true }],
  async execute(state: State, interaction: Interaction) {
    try {
      const guild = client.guilds.cache.get(interaction.guild_id);
      const channel = guild.channels.cache.get(interaction.channel_id) as TextChannel;

      if (!guild.members.cache.get(interaction.member.user.id).hasPermission("MOVE_MEMBERS"))
        return (await client.users.cache.get(interaction.member.user.id).createDM()).send(state.locale.insufficientPerms.move_members);

      let cnt = 0;

      guild.channels.cache.get(interaction.data.options[0].value).members.forEach(async (_member: GuildMember) => {
        try {
          await _member.voice.kick();
          cnt++;
        } catch (err) {}
      });
      return channel.send(`Disconnected ${cnt}user(s) from ${getChannelName(guild, interaction.data.options[0].value)}`);
    } catch (err) {
      Log.e(`Voice > ${err}`);
    }
  },
};

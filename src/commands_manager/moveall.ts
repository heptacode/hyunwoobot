import { GuildMember, TextChannel } from "discord.js";
import { getChannelName } from "../modules/converter";
import { Interaction, State } from "../";
import Log from "../modules/logger";
import { client } from "../app";

export default {
  name: "moveall",
  options: [
    {
      type: 7,
      name: "from",
      description: "From TextChannel",
      required: true,
    },
    {
      type: 7,
      name: "to",
      description: "Target TextChannel",
      required: true,
    },
  ],
  async execute(state: State, interaction: Interaction) {
    try {
      const guild = client.guilds.cache.get(interaction.guild_id);
      const channel = guild.channels.cache.get(interaction.channel_id) as TextChannel;

      if (!guild.members.cache.get(interaction.member.user.id).hasPermission("MOVE_MEMBERS"))
        return (await client.users.cache.get(interaction.member.user.id).createDM()).send(state.locale.insufficientPerms.move_members);

      const fromChannel = interaction.data.options[0].value;
      const targetChannel = interaction.data.options[1].value;

      let cnt = 0;

      guild.channels.cache.get(fromChannel).members.forEach(async (_member: GuildMember) => {
        try {
          await _member.voice.setChannel(targetChannel);
          cnt++;
        } catch (err) {}
      });
      return channel.send(`Moved ${cnt}user(s) from ${getChannelName(guild, interaction.data.options[0].value)}`);
    } catch (err) {
      Log.e(`Voice > ${err}`);
    }
  },
};

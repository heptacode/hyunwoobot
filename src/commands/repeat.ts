import { TextChannel } from "discord.js";
import { client } from "../app";
import { Interaction, State } from "../";
import Log from "../modules/logger";

export default {
  name: "repeat",
  version: 1,
  async execute(state: State, interaction: Interaction) {
    try {
      const guild = client.guilds.cache.get(interaction.guild_id);
      const channel = guild.channels.cache.get(interaction.channel_id) as TextChannel;
      const voiceChannel = guild.members.cache.get(interaction.member.user.id).voice.channel;

      if (!voiceChannel) return (await client.users.cache.get(interaction.member.user.id).createDM()).send(state.locale.repeat.joinToToggle);

      state.isRepeated = !state.isRepeated;

      return channel.send(`${state.locale.repeat.toggled}${state.isRepeated ? `${state.locale.on}` : `${state.locale.off}`}`);
    } catch (err) {
      Log.e(`ToggleRepeat > ${err}`);
    }
  },
};

import { TextChannel } from "discord.js";
import { client } from "../app";
import props from "../props";
import { Interaction, Locale, State } from "../";
import Log from "../modules/logger";

export default {
  name: "delete",
  version: 1,
  options(locale: Locale) {
    return [
      {
        type: 4,
        name: "amount",
        description: "2~99",
        required: true,
      },
    ];
  },
  async execute(state: State, interaction: Interaction) {
    try {
      const guild = client.guilds.cache.get(interaction.guild_id);
      const channel = guild.channels.cache.get(interaction.channel_id) as TextChannel;

      if (!guild.members.cache.get(interaction.member.user.id).hasPermission("MANAGE_MESSAGES"))
        return (await client.users.cache.get(interaction.member.user.id).createDM()).send(state.locale.insufficientPerms.manage_messages);

      await channel.bulkDelete(Number(interaction.data.options[0].value) + 1);

      return channel.send({
        embed: {
          color: props.color.primary,
          author: { name: `🗑 ${interaction.data.options[0].value}${state.locale.delete.deleted}` },
          footer: { text: interaction.member.user.tag },
          timestamp: new Date(),
        },
      });
    } catch (err) {
      Log.e(`Delete > 1 > ${err}`);
    }
  },
};

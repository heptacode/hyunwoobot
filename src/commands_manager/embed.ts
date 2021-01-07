import { MessageEmbed, TextChannel } from "discord.js";
import { client } from "../app";
import { getChannelID } from "../modules/converter";
import { Interaction, Locale, State } from "../";
import Log from "../modules/logger";

export default {
  name: "embed",
  options(locale: Locale) {
    return [
      {
        type: 3,
        name: "embed",
        description: locale.embed,
        required: true,
      },
    ];
  },
  async execute(state: State, interaction: Interaction) {
    try {
      const guild = client.guilds.cache.get(interaction.guild_id);

      if (!guild.members.cache.get(interaction.member.user.id).hasPermission("MANAGE_MESSAGES"))
        return (await client.users.cache.get(interaction.member.user.id).createDM()).send(state.locale.insufficientPerms.manage_messages);

      return await (guild.channels.cache.get(interaction.channel_id) as TextChannel).send({ embed: JSON.parse(interaction.data.options[0].value.replace(/\n/g, "\\n")) as MessageEmbed });
    } catch (err) {
      Log.e(`Embed > ${err}`);
    }
  },
};

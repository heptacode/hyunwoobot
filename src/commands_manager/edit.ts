import { MessageEmbed, TextChannel } from "discord.js";
import { Interaction, Locale, State } from "../";
import Log from "../modules/logger";
import { client } from "../app";

export default {
  name: "edit",
  options(locale: Locale) {
    return [
      {
        type: 3,
        name: "messageID",
        description: "2~100",
        required: true,
      },
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

      const _message = await (guild.channels.cache.get(interaction.channel_id) as TextChannel).messages.fetch(interaction.data.options[1].value);

      return await _message.edit({ embed: JSON.parse(interaction.data.options[1].value.replace(/\n/g, "\\n")) as MessageEmbed });
    } catch (err) {
      Log.e(`Edit > ${err}`);
    }
  },
};

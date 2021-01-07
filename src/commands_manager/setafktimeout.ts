import firestore from "../modules/firestore";
import { client } from "../app";
import { Interaction, Locale, State } from "../";
import Log from "../modules/logger";

export default {
  name: "setafktimeout",
  options(locale: Locale) {
    return [
      {
        type: 4,
        name: "minutes",
        description: locale.afkTimeout.options.minutesToKick,
        required: true,
      },
    ];
  },
  async execute(state: State, interaction: Interaction) {
    try {
      const guild = client.guilds.cache.get(interaction.guild_id);

      if (!guild.members.cache.get(interaction.member.user.id).hasPermission("MANAGE_GUILD"))
        return (await client.users.cache.get(interaction.member.user.id).createDM()).send(state.locale.insufficientPerms.manage_guild);

      await firestore.collection(guild.id).doc("config").update({ afkTimeout: interaction.data.options[0].value });

      return guild.systemChannel.send(`${state.locale.afkTimeout.set}${interaction.data.options[0].value}`);
    } catch (err) {
      Log.e(`SetAfkTimeout > ${err}`);
    }
  },
};

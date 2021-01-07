import { TextChannel } from "discord.js";
import firestore from "../modules/firestore";
import { client, locales } from "../app";
import { Interaction, Locale, State } from "../";
import Log from "../modules/logger";

const choices = [];
for (const [code, locale] of locales) {
  choices.push({ name: locale.locale.name, value: code });
}

export default {
  name: "locale",
  version: 1,
  options(locale: Locale) {
    return [
      {
        type: 3,
        name: "locale",
        description: locale.locale.locale,
        required: true,
        choices: choices,
      },
    ];
  },
  async execute(state: State, interaction: Interaction) {
    try {
      const guild = client.guilds.cache.get(interaction.guild_id);
      const channel = guild.channels.cache.get(interaction.channel_id) as TextChannel;

      if (!guild.members.cache.get(interaction.member.user.id).hasPermission("MANAGE_GUILD"))
        return (await client.users.cache.get(interaction.member.user.id).createDM()).send(state.locale.insufficientPerms.manage_guild);

      const configDocRef = firestore.collection(guild.id).doc("config");

      await configDocRef.update({ locale: interaction.data.options[0].value });

      return channel.send(`${state.locale.locale.changed}${interaction.data.options[0].value}`);
    } catch (err) {
      Log.e(`ChangeLocale > ${err}`);
    }
  },
};

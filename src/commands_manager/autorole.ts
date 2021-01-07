import { EmbedFieldData, TextChannel } from "discord.js";
import { client } from "../app";
import firestore from "../modules/firestore";
import props from "../props";
import { AutoRole, Interaction, Locale, State } from "../";
import Log from "../modules/logger";

export default {
  name: "autorole",
  options(locale: Locale) {
    return [
      {
        type: 1,
        name: "view",
        description: `${locale.manager} ${locale.autoRole.options.view}`,
      },
      {
        type: 1,
        name: "add",
        description: `${locale.manager} ${locale.autoRole.options.add}`,
        options: [
          {
            type: 3,
            name: "type",
            description: "User/Bot",
            required: true,
            choices: [
              { name: "user", value: "user" },
              { name: "bot", value: "bot" },
            ],
          },
          { type: 8, name: "role", description: locale.role, required: true },
        ],
      },
      {
        type: 1,
        name: "purge",
        description: `${locale.manager} ${locale.autoRole.options.purge}`,
      },
    ];
  },
  async execute(state: State, interaction: Interaction) {
    try {
      const guild = client.guilds.cache.get(interaction.guild_id);
      const channel = guild.channels.cache.get(interaction.channel_id) as TextChannel;

      if (!guild.members.cache.get(interaction.member.user.id).hasPermission("MANAGE_ROLES"))
        return (await client.users.cache.get(interaction.member.user.id).createDM()).send(`<@${interaction.member.user.id}>, ${state.locale.insufficientPerms.manage_roles}`);

      const method = interaction.data.options[0].name;

      const configDocRef = firestore.collection(guild.id).doc("config");
      const configDocSnapshot = await configDocRef.get();

      let autoRoleConfig: AutoRole[] = [];

      if (method === "show") {
        autoRoleConfig = configDocSnapshot.data().autoRole as AutoRole[];
      } else if (method === "add") {
        autoRoleConfig = configDocSnapshot.data().autoRole as AutoRole[];
        autoRoleConfig.push({ type: interaction.data.options[0].options[0].value, role: interaction.data.options[0].options[1].value });
        await configDocRef.update({ autoRole: autoRoleConfig });
      } else if (method === "purge") {
        await configDocRef.update({ autoRole: [] });
      }

      const fields: EmbedFieldData[] = [];
      if (autoRoleConfig.length >= 1)
        autoRoleConfig.forEach((autoRoleConfig: AutoRole) => {
          fields.push({ name: autoRoleConfig.type, value: `<@&${autoRoleConfig.role}>` });
        });

      return channel.send({
        embed: { title: state.locale.autoRole.autoRole, color: props.color.yellow, fields: fields.length >= 1 ? fields : [{ name: "\u200B", value: state.locale.autoRole.empty }] },
      });
    } catch (err) {
      Log.e(`AutoRole > ${err}`);
    }
  },
};

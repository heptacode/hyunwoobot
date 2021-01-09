import { EmbedFieldData } from "discord.js";
import firestore from "../modules/firestore";
import { sendEmbed } from "../modules/embedSender";
import Log from "../modules/logger";
import { checkPermission } from "../modules/permissionChecker";
import props from "../props";
import { AutoRole, Interaction, Locale, State } from "../";

export default {
  name: "autorole",
  version: 1,
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
      if (await checkPermission(state.locale, { interaction: interaction }, "MANAGE_ROLES")) return;

      const method = interaction.data.options[0].name;

      const configDocRef = firestore.collection(interaction.guild_id).doc("config");
      const autoRole = (await configDocRef.get()).data().autoRole;

      let autoRoleConfig: AutoRole[] = autoRole;

      if (method === "view") {
      } else if (method === "add") {
        autoRoleConfig.push({ type: interaction.data.options[0].options[0].value, role: interaction.data.options[0].options[1].value });
        await configDocRef.update({ autoRole: autoRoleConfig });
      } else if (method === "purge") {
        autoRoleConfig = [];
        await configDocRef.update({ autoRole: [] });
      }

      const fields: EmbedFieldData[] = [];
      if (autoRoleConfig.length >= 1) {
        for (const autoRole of autoRoleConfig) {
          fields.push({ name: autoRole.type, value: `<@&${autoRole.role}>` });
        }
      }

      return sendEmbed(
        { interaction: interaction },
        { color: props.color.yellow, title: `⚙️ ${state.locale.autoRole.autoRole}`, fields: fields.length >= 1 ? fields : [{ name: "\u200B", value: state.locale.autoRole.empty }] },
        { guild: true }
      );
    } catch (err) {
      Log.e(`AutoRole > ${err}`);
    }
  },
};

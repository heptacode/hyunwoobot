import { EmbedFieldData } from "discord.js";
import { firestore } from "../modules/firebase";
import { sendEmbed } from "../modules/embedSender";
import { log } from "../modules/logger";
import { checkPermission } from "../modules/permissionChecker";
import props from "../props";
import { Interaction, Locale, State } from "../";

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

      if (method === "view") {
      } else if (method === "add") {
        state.autoRoles.push({ type: interaction.data.options[0].options[0].value, role: interaction.data.options[0].options[1].value });
        await firestore.collection(interaction.guild_id).doc("config").update({ autoRoles: state.autoRoles });
      } else if (method === "purge") {
        state.autoRoles = [];
        await firestore.collection(interaction.guild_id).doc("config").update({ autoRoles: [] });
      }

      const fields: EmbedFieldData[] = [];
      if (state.autoRoles.length >= 1)
        for (const autoRole of state.autoRoles) {
          fields.push({ name: autoRole.type, value: `<@&${autoRole.role}>` });
        }

      return sendEmbed(
        { interaction: interaction },
        {
          color: props.color.yellow,
          title: `**⚙️ ${state.locale.autoRole.autoRole}**`,
          fields: fields.length >= 1 ? fields : [{ name: "\u200B", value: state.locale.autoRole.empty }],
        },
        { guild: true }
      );
    } catch (err) {
      log.e(`AutoRole > ${err}`);
    }
  },
};

import { sendEmbed } from "../modules/embedSender";
import { firestore } from "../modules/firebase";
import { log } from "../modules/logger";
import { checkPermission } from "../modules/permissionChecker";
import { client } from "../app";
import props from "../props";
import { Interaction, Locale, State, UserRole } from "../";

export default {
  name: "userrole",
  version: 2,
  options(locale: Locale) {
    return [
      {
        type: 1,
        name: "view",
        description: `${locale.manager} ${locale.userRole.options.view}`,
      },
      {
        type: 1,
        name: "add",
        description: `${locale.manager} ${locale.userRole.options.add}`,
        options: [
          {
            type: 8,
            name: "role",
            description: locale.role,
            required: true,
          },
        ],
      },
      {
        type: 1,
        name: "remove",
        description: `${locale.manager} ${locale.userRole.options.remove}`,
        options: [
          {
            type: 8,
            name: "role",
            description: locale.role,
            required: true,
          },
        ],
      },
      {
        type: 1,
        name: "purge",
        description: `${locale.manager} ${locale.userRole.options.purge}`,
      },
    ];
  },
  async execute(state: State, interaction: Interaction) {
    try {
      if (await checkPermission(state.locale, { interaction: interaction }, "MANAGE_ROLES")) throw new Error("Missing Permissions");

      const guild = client.guilds.resolve(interaction.guild_id);

      const configDocRef = firestore.collection(guild.id).doc("config");

      const method = interaction.data.options[0].name;
      if (method === "view") {
      } else if (method === "add") {
        state.userRoles.push({
          id: guild.roles.resolveID(interaction.data.options[0].options[0].value),
          name: guild.roles.resolve(interaction.data.options[0].options[0].value).name,
          color: guild.roles.resolve(interaction.data.options[0].options[0].value).color === 0 ? null : guild.roles.resolve(interaction.data.options[0].options[0].value).hexColor,
        });

        // Sort
        const payload = [];
        for (const userRole of state.userRoles) {
          payload[guild.roles.cache.get(userRole.id).rawPosition] = userRole;
        }
        state.userRoles = payload.filter((userRole: UserRole) => userRole).reverse();

        await configDocRef.update({ userRoles: state.userRoles });
      } else if (method === "remove") {
        const idx = state.userRoles.findIndex((userRole: UserRole) => userRole.id === interaction.data.options[0].options[0].value);
        state.userRoles.splice(idx, 1);

        await configDocRef.update({ userRoles: state.userRoles });
      } else if (method === "purge") {
        state.userRoles = [];
        await configDocRef.update({ userRoles: [] });
      }

      let description = "";
      if (state.userRoles.length >= 1) state.userRoles.forEach((userRole: UserRole) => (description += `\n<@&${userRole.id}>`));
      else description = state.locale.userRole.empty;

      return [
        {
          color: props.color.yellow,
          title: `**⚙️ ${state.locale.userRole.userRole}**`,
          description: description,
        },
      ];
    } catch (err) {
      log.e(`VoiceRole > ${err}`);
    }
  },
};

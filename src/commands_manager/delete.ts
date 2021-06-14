import { TextChannel } from "discord.js";
import { createError } from "../modules/createError";
import { checkPermission } from "../modules/permissionChecker";
import { client } from "../app";
import props from "../props";
import { Interaction, Locale, State } from "../";

export default {
  name: "delete",
  version: 2,
  options(locale: Locale) {
    return [
      {
        type: 4,
        name: "amount",
        description: "1~100",
        required: true,
      },
    ];
  },
  async execute(state: State, interaction: Interaction) {
    try {
      if (await checkPermission(state.locale, { interaction: interaction }, "MANAGE_MESSAGES")) throw new Error("Missing Permissions");

      await (client.channels.resolve(interaction.channel_id) as TextChannel).bulkDelete(Number(interaction.data.options[0].value));

      return [
        {
          color: props.color.purple,
          description: `🗑 **${interaction.data.options[0].value}${state.locale.delete.deleted}**`,
        },
      ];
    } catch (err) {
      createError("Delete", err, { interaction: interaction });
    }
  },
};

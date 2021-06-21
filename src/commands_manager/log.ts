import { createError } from "../modules/createError";
import { firestore } from "../modules/firebase";
import { checkPermission } from "../modules/permissionChecker";
import props from "../props";
import { Interaction, Locale, State } from "../";

export default {
  name: "log",
  version: 2,
  options(locale: Locale) {
    return [
      {
        type: 7,
        name: "text_channel",
        description: locale.textChannel,
        required: true,
      },
    ];
  },
  async execute(state: State, interaction: Interaction) {
    try {
      if (await checkPermission(state.locale, { interaction: interaction }, "MANAGE_MESSAGES")) throw new Error("Missing Permissions");

      await firestore.collection(interaction.guild_id).doc("config").update({ logChannel: interaction.data.options[0].value });

      return [
        {
          color: props.color.green,
          title: `**📦 ${state.locale.log.log}**`,
          description: `✅ **${state.locale.log.set}<#${interaction.data.options[0].value}>**`,
        },
      ];
    } catch (err) {
      createError("Log", err, { interaction: interaction });
    }
  },
};

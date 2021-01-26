import { sendEmbed } from "../modules/embedSender";
import { firestore } from "../modules/firebase";
import Log from "../modules/logger";
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
        name: "textChannel",
        description: locale.textChannel,
        required: true,
      },
    ];
  },
  async execute(state: State, interaction: Interaction) {
    try {
      if (await checkPermission(state.locale, { interaction: interaction }, "MANAGE_MESSAGES")) return;

      await firestore.collection(interaction.guild_id).doc("config").update({ log: interaction.data.options[0].value });

      return sendEmbed(
        { interaction: interaction },
        {
          color: props.color.green,
          title: `📦 ${state.locale.log.log}`,
          description: `✅ **${state.locale.log.set}<#${interaction.data.options[0].value}>**`,
          timestamp: new Date(),
        },
        { guild: true }
      );
    } catch (err) {
      Log.e(`Log > ${err}`);
    }
  },
};

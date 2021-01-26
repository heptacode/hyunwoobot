import { sendEmbed } from "../modules/embedSender";
import { firestore } from "../modules/firebase";
import Log from "../modules/logger";
import { checkPermission } from "../modules/permissionChecker";
import props from "../props";
import { Interaction, Locale, State } from "../";

export default {
  name: "setafktimeout",
  version: 1,
  options(locale: Locale) {
    return [
      {
        type: 4,
        name: "minutes",
        description: locale.afkTimeout.options.minutesToDisconnect,
        required: true,
      },
    ];
  },
  async execute(state: State, interaction: Interaction) {
    try {
      if (await checkPermission(state.locale, { interaction: interaction }, "MANAGE_GUILD")) return;

      await firestore.collection(interaction.guild_id).doc("config").update({ afkTimeout: interaction.data.options[0].value });

      return sendEmbed(
        { interaction: interaction },
        {
          color: props.color.green,
          title: state.locale.afkTimeout.afkTimeout,
          description: `✅ **${state.locale.afkTimeout.set}${interaction.data.options[0].value}**`,
          timestamp: new Date(),
        },
        { guild: true, system: true }
      );
    } catch (err) {
      Log.e(`SetAfkTimeout > ${err}`);
    }
  },
};

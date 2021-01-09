import { TextChannel } from "discord.js";
import { sendEmbed } from "../modules/embedSender";
import Log from "../modules/logger";
import { checkPermission } from "../modules/permissionChecker";
import { client } from "../app";
import props from "../props";
import { Interaction, Locale, State } from "../";

export default {
  name: "delete",
  version: 1,
  options(locale: Locale) {
    return [
      {
        type: 4,
        name: "amount",
        description: "2~99",
        required: true,
      },
    ];
  },
  async execute(state: State, interaction: Interaction) {
    try {
      if (await checkPermission(state.locale, { interaction: interaction }, "MANAGE_MESSAGES")) return;

      await (client.channels.cache.get(interaction.channel_id) as TextChannel).bulkDelete(Number(interaction.data.options[0].value) + 1);

      return sendEmbed(
        { interaction: interaction },
        {
          color: props.color.purple,
          description: `🗑 **${interaction.data.options[0].value}${state.locale.delete.deleted}**`,
          timestamp: new Date(),
        },
        { guild: true }
      );
    } catch (err) {
      Log.e(`Delete > ${err}`);
    }
  },
};

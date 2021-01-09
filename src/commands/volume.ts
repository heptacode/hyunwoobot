import { sendEmbed } from "../modules/embedSender";
import { voiceStateCheck } from "../modules/voiceManager";
import Log from "../modules/logger";
import props from "../props";
import { Interaction, Locale, State } from "../";

export default {
  name: "volume",
  version: 1,
  options(locale: Locale) {
    return [
      {
        type: 4,
        name: "value",
        description: "1~10",
        required: true,
        choices: [
          { name: 1, value: 1 },
          { name: 2, value: 2 },
          { name: 3, value: 3 },
          { name: 4, value: 4 },
          { name: 5, value: 5 },
          { name: 6, value: 6 },
          { name: 7, value: 7 },
          { name: 8, value: 8 },
          { name: 9, value: 9 },
          { name: 10, value: 10 },
        ],
      },
    ];
  },
  async execute(state: State, interaction: Interaction) {
    try {
      await voiceStateCheck(state.locale, interaction);

      const newVolume = Number(interaction.data.options[0].value);

      state.dispatcher.setVolume(newVolume / 5);

      state.volume = newVolume;

      return sendEmbed(
        { interaction: interaction },
        {
          color: props.color.purple,
          description: `🔈 **${state.locale.music.volumeChanged}**`,
        },
        { guild: true }
      );
    } catch (err) {
      Log.e(`ChangeVolume > 1 > ${err}`);
    }
  },
};

import { Interaction, Locale, State } from "../";
import { play } from "../modules/musicManager";

export default {
  name: "play",
  version: 2,
  options(locale: Locale) {
    return [
      {
        type: 3,
        name: "query",
        description: locale.music.options.query,
        required: false,
      },
    ];
  },
  async execute(state: State, interaction: Interaction) {
    play(state, interaction);
  },
};

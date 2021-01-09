import { play } from "../modules/musicManager";
import { Interaction, Locale, State } from "../";

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

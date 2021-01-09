import { toggleRepeat } from "../modules/musicManager";
import { Interaction, State } from "../";

export default {
  name: "repeat",
  version: 1,
  async execute(state: State, interaction: Interaction) {
    toggleRepeat(state, interaction);
  },
};

import { skip } from "../modules/musicManager";
import { Interaction, State } from "../";

export default {
  name: "skip",
  version: 1,
  execute(state: State, interaction: Interaction) {
    skip(state, interaction);
  },
};

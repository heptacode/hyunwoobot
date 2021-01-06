import { toggleLoop } from "../modules/musicManager";
import { State, Interaction } from "../";

export default {
  name: "loop",
  execute(state: State, interaction: Interaction) {
    toggleLoop(state, interaction);
  },
};

import { stop } from "../modules/musicManager";
import { Interaction, State } from "../";

export default {
  name: "stop",
  execute(state: State, interaction: Interaction) {
    stop(state, interaction);
  },
};

import { stop } from "../modules/musicManager";
import { Interaction, State } from "../";

export default {
  name: "stop",
  version: 1,
  execute(state: State, interaction: Interaction) {
    stop(state, interaction);
  },
};

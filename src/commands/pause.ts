import { pause } from "../modules/musicManager";
import { Interaction, State } from "../";

export default {
  name: "pause",
  execute(state: State, interaction: Interaction) {
    pause(state, interaction);
  },
};

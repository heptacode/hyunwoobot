import { voiceConnect } from "../modules/voiceManager";
import { Interaction, State } from "../";

export default {
  name: "join",
  execute(state: State, interaction: Interaction) {
    voiceConnect(state, interaction);
  },
};

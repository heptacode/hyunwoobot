import { voiceConnect } from "../modules/voiceManager";
import { Interaction, State } from "../";

export default {
  name: "join",
  version: 1,
  execute(state: State, interaction: Interaction) {
    voiceConnect(state, interaction);
  },
};

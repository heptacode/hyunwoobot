import { voiceDisconnect } from "../modules/voiceManager";
import { Interaction, State } from "../";

export default {
  name: "leave",
  execute(state: State, interaction: Interaction) {
    voiceDisconnect(state, interaction);
  },
};

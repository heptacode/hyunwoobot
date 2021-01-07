import { voiceDisconnect } from "../modules/voiceManager";
import { Interaction, State } from "../";

export default {
  name: "leave",
  version: 1,
  execute(state: State, interaction: Interaction) {
    voiceDisconnect(state, interaction);
  },
};

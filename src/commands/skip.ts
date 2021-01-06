import { skip } from "../modules/musicManager";
import { Interaction, State } from "../";

export default {
  name: "skip",
  aliases: ["fs"],
  execute(state: State, interaction: Interaction) {
    skip(state, interaction);
  },
};

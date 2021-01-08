import { TextChannel } from "discord.js";
import { client } from "../app";
import { Interaction, State } from "../";
import { toggleRepeat } from "../modules/musicManager";

export default {
  name: "repeat",
  version: 1,
  async execute(state: State, interaction: Interaction) {
    toggleRepeat(state, interaction);
  },
};

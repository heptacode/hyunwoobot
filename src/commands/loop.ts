import { Message } from "discord.js";
import { Locale, State, Args } from "../";
import { toggleLoop } from "../modules/musicManager";

module.exports = {
  name: "loop",
  aliases: ["rpall"],
  description: "Toggle loop for the playlist",
  execute(locale: Locale, state: State, message: Message, args: Args) {
    toggleLoop(locale, state, message);
  },
};

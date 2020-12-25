import { Message } from "discord.js";
import { Locale, State, Args } from "../";
import { toggleLoop } from "../modules/musicManager";

export default {
  name: "loop",
  aliases: ["rpall"],
  execute(locale: Locale, state: State, message: Message, args: Args) {
    toggleLoop(locale, state, message);
  },
};

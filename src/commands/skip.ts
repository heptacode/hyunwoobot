import { Message } from "discord.js";
import { Args, Locale, State } from "../";
import { skip } from "../modules/musicManager";

export default {
  name: "skip",
  aliases: ["fs"],
  execute(locale: Locale, state: State, message: Message, args: Args) {
    skip(locale, state, message);
  },
};

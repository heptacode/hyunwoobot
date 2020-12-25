import { Message } from "discord.js";
import { Args, Locale, State } from "../";
import { pause } from "../modules/musicManager";

export default {
  name: "pause",
  aliases: ["ps"],
  execute(locale: Locale, state: State, message: Message, args: Args) {
    pause(locale, state, message);
  },
};

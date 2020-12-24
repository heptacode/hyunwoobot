import { Message } from "discord.js";
import { Args, Locale, State } from "../";
import { pause } from "../modules/musicManager";

module.exports = {
  name: "pause",
  aliases: ["ps"],
  description: "Pause the song",
  execute(locale: Locale, state: State, message: Message, args: Args) {
    pause(locale, state, message);
  },
};

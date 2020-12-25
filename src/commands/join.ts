import { Message } from "discord.js";
import { Args, Locale, State } from "../";
import { voiceConnect } from "../modules/voiceManager";

export default {
  name: "join",
  aliases: ["j"],
  execute(locale: Locale, state: State, message: Message, args: Args) {
    voiceConnect(locale, state, message);
  },
};

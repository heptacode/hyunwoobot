import { Message } from "discord.js";
import { Args, Locale, State } from "../";
import { voiceDisconnect } from "../modules/voiceManager";

export default {
  name: "leave",
  aliases: ["l", "dc", "q", "quit", "unbind"],
  execute(locale: Locale, state: State, message: Message, args: Args) {
    voiceDisconnect(locale, state, message);
  },
};

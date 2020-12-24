import { Message } from "discord.js";
import { Args, Locale, State } from "../";
import { voiceDisconnect } from "../modules/voiceManager";

module.exports = {
  name: "leave",
  aliases: ["l", "dc", "q", "quit", "unbind"],
  description: "Unbind from a voice channel you are in",
  execute(locale: Locale, state: State, message: Message, args: Args) {
    voiceDisconnect(locale, state, message);
  },
};

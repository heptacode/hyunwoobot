import { Message } from "discord.js";
import { Args, Locale, State } from "../";
import { voiceConnect } from "../modules/voiceManager";

module.exports = {
  name: "join",
  aliases: ["j"],
  description: "Join a voice channel you are in",
  execute(locale: Locale, state: State, message: Message, args: Args) {
    voiceConnect(locale, state, message);
  },
};

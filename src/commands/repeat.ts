import { Message } from "discord.js";
import { Args, Locale, State } from "../";
import Log from "../modules/logger";

export default {
  name: "repeat",
  aliases: ["rp"],
  async execute(locale: Locale, state: State, message: Message, args: Args) {
    try {
      if (!message.member.voice.channel) {
        message.react("❌");
        return message.channel.send(locale.repeat.joinToToggle);
      }

      state.isRepeated = !state.isRepeated;

      Log.s(`ToggleRepeat : ${state.isRepeated ? "ON" : "OFF"}`);
      message.react("✅");
      return message.channel.send(`${locale.repeat.toggled}${state.isRepeated ? `${locale.on}` : `${locale.off}`}`);
    } catch (err) {
      message.react("❌");
      Log.e(`ToggleRepeat > 1 > ${err}`);
    }
  },
};

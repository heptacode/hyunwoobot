import { Message } from "discord.js";
import { Args, Locale, State } from "../";
import Log from "../modules/logger";

module.exports = {
  name: "repeat",
  aliases: ["rp"],
  description: "Toggle repeat",
  execute(locale: Locale, state: State, message: Message, args: Args) {
    try {
      if (!message.member.voice.channel) return message.channel.send(locale.joinToToggleRepeat);

      state.isRepeated = !state.isRepeated;

      Log.s(`ToggleRepeat : ${state.isRepeated ? "ON" : "OFF"}`);
      message.channel.send(`${locale.toggleRepeat}${state.isRepeated ? `${locale.on}` : `${locale.off}`}`);
    } catch (err) {
      Log.e(`ToggleRepeat > 1 > ${err}`);
      message.channel.send(locale.err_cmd);
    }
  },
};

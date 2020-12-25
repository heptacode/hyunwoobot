import { Message } from "discord.js";
import { Locale, State, Args } from "../";
import Log from "../modules/logger";

export default {
  name: "volume",
  aliases: ["v", "vol"],
  execute(locale: Locale, state: State, message: Message, args: Args) {
    try {
      if (!message.member.voice.channel) return message.channel.send(locale.joinToChangeVolume);

      const newVolume = Number(args[0]);
      if (!newVolume) {
        return message.channel.send(`${locale.currentVolume}${state.volume}`);
      } else if (!(newVolume >= 0 && newVolume <= 10)) {
        Log.w(`ChangeVolume > Invalid value: ${newVolume}`);
        return message.channel.send(locale.invalidVolume);
      }

      state.dispatcher.setVolume(newVolume / 5);

      state.volume = newVolume;

      Log.s(`ChangeVolume: ${newVolume}`);
      message.channel.send(locale.changeVolume);
    } catch (err) {
      Log.e(`ChangeVolume > 1 > ${err}`);
      message.channel.send(locale.err_cmd);
    }
  },
};

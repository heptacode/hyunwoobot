import { Message } from "discord.js";
import { Locale, State, Args } from "../";
import Log from "../modules/logger";

export default {
  name: "volume",
  aliases: ["v", "vol"],
  async execute(locale: Locale, state: State, message: Message, args: Args) {
    try {
      if (!message.member.voice.channel) {
        message.react("❌");
        return message.channel.send(locale.volume.joinToChange).then((_message: Message) => {
          _message.delete({ timeout: 5000 });
        });
      }

      const newVolume = Number(args[0]);
      if (!newVolume) {
        return message.channel.send(`${locale.volume.currentVolume}${state.volume}`);
      } else if (!(newVolume >= 0 && newVolume <= 10)) {
        Log.w(`ChangeVolume > Invalid value: ${newVolume}`);
        message.react("❌");
        return message.channel.send(locale.volume.invalid);
      }

      state.dispatcher.setVolume(newVolume / 5);

      state.volume = newVolume;

      Log.s(`ChangeVolume: ${newVolume}`);
      message.react("✅");
      return message.channel.send(locale.volume.changed);
    } catch (err) {
      message.react("❌");
      Log.e(`ChangeVolume > 1 > ${err}`);
    }
  },
};

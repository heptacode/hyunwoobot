import { Message } from "discord.js";
import { Locale, State, Args } from "../";
import { alarmDB, sendAlarm } from "../modules/voiceManager";

export default {
  name: "🧪testalarm",
  async execute(locale: Locale, state: State, message: Message, args: Args) {
    await message.delete();
    return sendAlarm(alarmDB);
  },
};

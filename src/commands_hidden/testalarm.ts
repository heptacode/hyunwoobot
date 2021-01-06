import { Message } from "discord.js";
import { alarmDB, sendAlarm } from "../modules/voiceManager";
import { Args, State } from "../";

export default {
  name: "testalarm",
  async execute(state: State, message: Message, args: Args) {
    await message.delete();
    return sendAlarm(alarmDB);
  },
};

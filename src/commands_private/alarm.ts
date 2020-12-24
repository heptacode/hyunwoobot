import { Message } from "discord.js";
import schedule from "node-schedule";
import { alarmDB, activateAlarm, sendAlarm } from "../modules/voiceManager";
import { AlarmDB, Args, Locale, State } from "../";
import Log from "../modules/logger";

schedule.scheduleJob(
  { minute: 59, second: 51 },
  async (alarmDB: AlarmDB): Promise<void> => {
    if (alarmDB.voiceChannel) {
      Log.d(`Sending Alarm to ${alarmDB.voiceChannel.name}`);
      await sendAlarm(alarmDB);
    } else Log.d(`Skipping Alarm`);
  }
);

module.exports = {
  name: "alarm",
  execute(locale: Locale, state: State, message: Message, args: Args) {
    activateAlarm(message, alarmDB);
  },
};

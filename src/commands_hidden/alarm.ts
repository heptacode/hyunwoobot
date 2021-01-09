import { Message } from "discord.js";
import schedule from "node-schedule";
import Log from "../modules/logger";
import { checkPermission } from "../modules/permissionChecker";
import { alarmDB, activateAlarm, sendAlarm } from "../modules/voiceManager";
import { AlarmDB, Args, State } from "../";

schedule.scheduleJob(
  { minute: 59, second: 51 },
  async (alarmDB: AlarmDB): Promise<void> => {
    if (alarmDB.voiceChannel) {
      Log.d(`Sending Alarm to ${alarmDB.voiceChannel.name}`);
      await sendAlarm(alarmDB);
    } else Log.d(`Skipping Alarm`);
  }
);

export default {
  name: "alarm",
  async execute(state: State, message: Message, args: Args) {
    if (await checkPermission(state.locale, { message: message }, "ADMINISTRATOR")) return;
    activateAlarm(message, alarmDB);
  },
};

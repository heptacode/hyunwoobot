import * as schedule from "node-schedule";
import { toggleAlarm, sendAlarm } from "../util/voiceManager";
import Log from "../util/logger";

schedule.scheduleJob({ minute: 59, second: 51 }, async () => {
  Log.d("Sending Alarm");
  await sendAlarm();
});

module.exports = {
  name: "alarm",
  aliases: ["notification", "알림", "알람"],
  description: "Send timed notification to a voice channel",
  execute(locale, dbRef, docRef, message, args) {
    toggleAlarm(locale, dbRef, docRef, message);
  },
};

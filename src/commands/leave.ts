import Log from "../util/logger";
import { voiceDisconnect } from "../util/voiceManager";

module.exports = {
  name: "leave",
  aliases: ["q", "quit", "l", "disconnect", "unbound"],
  description: "Unbound from a voice channel you are in",
  async execute(locale, dbRef, docRef, message, args) {
    try {
      await voiceDisconnect(locale, dbRef, docRef, message);
    } catch (err) {
      Log.e(`Leave > 1 > ${err}`);
      message.reply(`${locale.err_cmd}`);
    }
  },
};

import Log from "../util/logger";
import { voiceConnect } from "../util/voiceManager";

module.exports = {
  name: "join",
  aliases: ["j"],
  description: "Join a voice channel you are in",
  async execute(locale, dbRef, docRef, message, args) {
    try {
      await voiceConnect(locale, dbRef, docRef, message);
    } catch (err) {
      Log.e(`Join > ${err}`);
      message.channel.send(`${locale.err_cmd}`);
    }
  },
};

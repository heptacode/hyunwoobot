import Log from "../util/logger";

module.exports = {
  name: "stop",
  aliases: ["정지", "중지", "중단", "스톱"],
  description: "Stop the music",
  execute(locale, dbRef, docRef, message, args) {
    try {
      if (!message.member.voice.channel) return message.channel.send(`${locale.joinToStop}`);
      dbRef.connection.dispatcher.end();
      Log.i(`Stop`);
    } catch (err) {
      Log.e(`Stop > 1 > ${err}`);
      return message.channel.send(`${locale.stopNotNow}`);
    }
  },
};

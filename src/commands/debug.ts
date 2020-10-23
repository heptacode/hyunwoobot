import Log from "../util/logger";

module.exports = {
  name: "debug",
  aliases: ["디버그"],
  description: "Send debug information to the developer",
  async execute(locale, dbRef, docRef, message, args) {
    try {
      let docSnapshot = await docRef.get();
      Log.v("------------------------------------------------------------------------------------");
      Log.d(`TextChannel : ${JSON.stringify(docSnapshot.data().textChannel)}`);
      Log.d(`VoiceChannel : ${JSON.stringify(docSnapshot.data().voiceChannel)}`);
      Log.d(`Playlist : ${JSON.stringify(docSnapshot.data().playlist)}`);
      Log.d(`IsPlaying : ${docSnapshot.data().isPlaying}`);
      Log.d(`Volume : ${docSnapshot.data().volume}`);
      Log.v("------------------------------------------------------------------------------------");
      Log.d(JSON.stringify(message));
      Log.v("------------------------------------------------------------------------------------");
    } catch (err) {
      Log.e(`Debug > 1 > ${err}`);
      message.channel.send(`${locale.err_cmd}`);
    }
  },
};

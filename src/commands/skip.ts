import Log from "../util/logger";

module.exports = {
  name: "skip",
  aliases: ["fs", "스킵", "스킾"],
  description: "Skip current music",
  async execute(locale, dbRef, docRef, message, args) {
    try {
      if (!message.member.voice.channel) return message.reply(`${locale.joinToSkip}`);

      let docSnapshot = await docRef.get();
      if (docSnapshot.exists) {
        if (docSnapshot.data().playlist.length == 0) return message.reply(`${locale.noSongToSkip}`);

        let playlist = docSnapshot.data().playlist;
        playlist.shift();
        let result = await docRef.update({ playlist: playlist });
        if (result) {
          Log.i(`Skip`);
          message.reply(`${locale.skipped}`);
          dbRef.connection.dispatcher.end();
        } else {
          Log.e(`Skip > 3 > ${result}`);
          message.reply(`${locale.err_cmd}`);
        }
      } else {
        Log.e(`Skip > 2 > docSnapshot Not Exists`);
        message.reply(`${locale.err_cmd}`);
      }
    } catch (err) {
      Log.e(`Skip > 1 > ${err}`);
      message.reply(`${locale.err_cmd}`);
    }
  },
};

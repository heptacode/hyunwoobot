import Log from "../util/logger";

module.exports = {
  name: "skip",
  aliases: ["fs", "스킵", "스킾"],
  description: "Skip current music",
  async execute(locale, dbRef, docRef, message, args) {
    try {
      if (!message.member.voice.channel) return `${locale.joinToSkip}`;

      let docSnapshot = await docRef.get();
      if (docSnapshot.exists) {
        if (docSnapshot.data().playlist.length == 0) return `${locale.noSongToSkip}`;

        let playlist = docSnapshot.data().playlist;
        playlist.shift();
        let result = await docRef.update({ playlist: playlist });
        if (result) {
          Log.i(`Skip`);
          `${locale.skipped}`;
          dbRef.connection.dispatcher.end();
        } else {
          Log.e(`Skip > 3 > ${result}`);
          `${locale.err_cmd}`;
        }
      } else {
        Log.e(`Skip > 2 > docSnapshot Not Exists`);
        `${locale.err_cmd}`;
      }
    } catch (err) {
      Log.e(`Skip > 1 > ${err}`);
      `${locale.err_cmd}`;
    }
  },
};

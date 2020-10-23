import Log from "../util/logger";

module.exports = {
  name: "loop",
  aliases: ["전체반복"],
  description: "Toggle loop for the playlist",
  async execute(locale, dbRef, docRef, message, args) {
    try {
      if (!message.member.voice.channel) return message.reply(`${locale.joinToToggleLoop}`);

      let docSnapshot = await docRef.get();

      let newValue = !docSnapshot.data().isLooped;

      let result = await docRef.update({ isLooped: newValue });
      if (result) {
        Log.s(`ToggleLoop : ${newValue ? "ON" : "OFF"}`);
        message.reply(`${locale.toogleLoop}${newValue ? `${locale.on}` : `${locale.off}`}`);
      } else {
        Log.e(`ToggleLoop > 2 > ${result}`);
        message.reply(`${locale.err_cmd}`);
      }
    } catch (err) {
      Log.e(`ToggleLoop > 1 > ${err}`);
      message.reply(`${locale.err_cmd}`);
    }
  },
};
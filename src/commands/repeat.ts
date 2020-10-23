import Log from "../util/logger";

module.exports = {
  name: "repeat",
  aliases: ["반복", "한곡반복"],
  description: "Toggle repeat",
  async execute(locale, dbRef, docRef, message, args) {
    try {
      if (!message.member.voice.channel) return `${locale.joinToToggleRepeat}`;

      let docSnapshot = await docRef.get();

      let newValue = !docSnapshot.data().isRepeated;

      let result = await docRef.update({ isRepeated: newValue });
      if (result) {
        Log.s(`ToggleRepeat : ${newValue ? "ON" : "OFF"}`);
        `${locale.toggleRepeat}${newValue ? `${locale.on}` : `${locale.off}`}`;
      } else {
        Log.e(`ToggleRepeat > 2 > ${result}`);
        `${locale.err_cmd}`;
      }
    } catch (err) {
      Log.e(`ToggleRepeat > 1 > ${err}`);
      `${locale.err_cmd}`;
    }
  },
};

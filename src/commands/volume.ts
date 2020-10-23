import Log from "../util/logger";

module.exports = {
  name: "volume",
  aliases: ["vol", "음량", "볼륨"],
  description: "Change the volume",
  async execute(locale, dbRef, docRef, message, args) {
    try {
      if (!message.member.voice.channel) return message.reply(`${locale.joinToChangeVolume}`);

      let newVolume = Number(message.content.split(" ")[1]);
      if (newVolume === NaN || !(newVolume >= 0 && newVolume <= 10)) {
        Log.w(`ChangeVolume : Invalid value : ${newVolume}`);
        return message.reply(`${locale.invalidVolume}`);
      }

      let result = await docRef.update({ volume: newVolume });
      if (result) {
        Log.s(`ChangeVolume : ${newVolume}`);
        message.reply(`${locale.changeVolume}`);
      } else {
        Log.e(`ChangeVolume > 2 > ${result}`);
        message.reply(`${locale.err_cmd}`);
      }
    } catch (err) {
      Log.e(`ChangeVolume > 1 > ${err}`);
      message.reply(`${locale.err_cmd}`);
    }
  },
};

import FS from "../FS";
import Log from "../util/logger";
const locales = ["en", "ko"];

module.exports = {
  name: "locale",
  aliases: ["lang", "언어"],
  description: "Change the default locale",
  async execute(locale, dbRef, docRef, message, args) {
    try {
      let server = message.guild;

      let configDocRef = FS.collection(server.id).doc("config");

      let newValue = message.content.split(" ")[1];

      if (!locales.includes(newValue)) return message.channel.send(`Please enter a valid locale!\nSupported locales : ${locales}`);

      let result = await configDocRef.update({ locale: newValue });
      if (result) {
        Log.s(`ChangeLocale : ${newValue}`);
        message.channel.send(`${locale.changeLocale}${newValue}`);
      } else {
        Log.e(`ChangeLocale > 2 > ${result}`);
        message.channel.send(`${locale.err_cmd}`);
      }
    } catch (err) {
      Log.e(`ChangeLocale > 1 > ${err}`);
      message.channel.send(`${locale.err_cmd}`);
    }
  },
};

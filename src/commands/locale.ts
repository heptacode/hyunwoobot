import { Message } from "discord.js";
import { Args, Locale, State } from "../";
import firestore from "../modules/firestore";
import { locales } from "../app";
import Log from "../modules/logger";

const locales_list: string[] = [...locales.keys()];

export default {
  name: "locale",
  aliases: ["lang"],
  async execute(locale: Locale, state: State, message: Message, args: Args) {
    try {
      const configDocRef = firestore.collection(message.guild.id).doc("config");

      const newValue = message.content.split(" ")[1];

      if (!locales_list.includes(newValue)) return message.channel.send(`Please enter a valid locale!\nSupported locales : ${locales_list.join(", ")}`);

      const result = await configDocRef.update({ locale: newValue });
      if (result) {
        Log.d(`ChangeLocale : ${newValue}`);
        message.react("✅");
        return message.channel.send(`${locale.changeLocale}${newValue}`);
      } else {
        message.react("❌");
        Log.e(`ChangeLocale > 2 > ${result}`);
      }
    } catch (err) {
      message.react("❌");
      Log.e(`ChangeLocale > 1 > ${err}`);
    }
  },
};

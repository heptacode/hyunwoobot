import { Message } from "discord.js";
import firestore from "../modules/firestore";
import { Args, Locale, State } from "../";
import props from "../props";
import Log from "../modules/logger";
import { getChannelID } from "../modules/converter";

export default {
  name: "log",
  async execute(locale: Locale, state: State, message: Message, args: Args) {
    try {
      if (!message.member.hasPermission("MANAGE_MESSAGES")) {
        message.react("❌");
        return message.channel.send(locale.insufficientPerms.manage_messages).then((_message: Message) => {
          _message.delete({ timeout: 5000 });
        });
      }

      (await firestore.collection(message.guild.id).doc("config").get()).data().log = getChannelID(message.guild, args[0]);

      await firestore
        .collection(message.guild.id)
        .doc("config")
        .update({ log: getChannelID(message.guild, args[0]) });

      await message.channel.send({
        embed: {
          title: locale.log.log,
          color: props.color.yellow,
          description: `${locale.log.set}<#${getChannelID(message.guild, args[0])}>`,
        },
      });

      return message.react("✅");
    } catch (err) {
      message.react("❌");
      Log.e(`Log > ${err}`);
    }
  },
};

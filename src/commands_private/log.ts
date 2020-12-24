import { Message } from "discord.js";
import firestore from "../firestore";
import { Args, Locale, State } from "../";
import config from "../config";
import Log from "../modules/logger";
import { channelConvert } from "../modules/converter";

module.exports = {
  name: "log",
  async execute(locale: Locale, state: State, message: Message, args: Args) {
    try {
      if (!(message.member.hasPermission("ADMINISTRATOR") || message.member.hasPermission("MANAGE_MESSAGES")))
        return message.channel.send(locale.insufficientPerms_manage_messages).then((msg: Message) => {
          msg.delete({ timeout: 5000 });
        });

      (await firestore.collection(message.guild.id).doc("config").get()).data().log = channelConvert(message.guild, args[0]);

      message.channel.send({
        embed: {
          title: locale.log,
          color: config.color.yellow,
          description: `${locale.log_set}<#${channelConvert(message.guild, args[0])}>`,
        },
      });
    } catch (err) {
      Log.e(`Log > ${err}`);
    }
  },
};

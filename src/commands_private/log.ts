import { Message, MessageEmbed } from "discord.js";
import firestore from "../firestore";
import { Args, Locale, State } from "../";
import Log from "../modules/logger";

module.exports = {
  name: "log",
  async execute(locale: Locale, state: State, message: Message, args: Args) {
    try {
      if (!(message.member.hasPermission("ADMINISTRATOR") || message.member.hasPermission("MANAGE_MESSAGES")))
        return message.channel.send(locale.insufficientPerms_manage_messages).then((msg: Message) => {
          msg.delete({ timeout: 5000 });
        });

      (await firestore.collection(message.guild.id).doc("config").get()).data().log = args[0];

      message.channel.send({
        embed: { title: "Log", description: `Log channel set to ${args[0]}` } as MessageEmbed,
      });
    } catch (err) {
      Log.e(`Log > ${err}`);
    }
  },
};

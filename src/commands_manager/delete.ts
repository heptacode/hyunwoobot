import { Message, TextChannel } from "discord.js";
import { Args, Locale, State } from "../";
import props from "../props";
import Log from "../modules/logger";

export default {
  name: "delete",
  aliases: ["del", "rm", "remove", "purge"],
  async execute(locale: Locale, state: State, message: Message, args: Args) {
    try {
      if (!message.member.hasPermission("MANAGE_MESSAGES")) {
        message.react("❌");
        return message.reply(locale.insufficientPerms.manage_messages).then((_message: Message) => {
          _message.delete({ timeout: 5000 });
        });
      }

      const amount = Number(args[0]);
      if (amount === NaN || !(amount >= 2 && amount <= 100)) {
        Log.w(`Delete : Invalid value : ${amount}`);
        message.react("❌");
        return message.channel.send(locale.delete.invalidAmount);
      }

      await (message.channel as TextChannel).bulkDelete(amount);

      return message.channel.send({ embed: { color: props.color.primary, author: { name: `🗑 ${amount}${locale.delete.deleted}` }, footer: { text: message.author.tag }, timestamp: new Date() } });
    } catch (err) {
      message.react("❌");
      Log.e(`Delete > 1 > ${err}`);
    }
  },
};

import { Message, TextChannel } from "discord.js";
import { Args, Locale, State } from "../";
import config from "../config";
import Log from "../modules/logger";

module.exports = {
  name: "delete",
  aliases: ["del", "rm", "remove", "purge"],
  description: "Bulk delete",
  async execute(locale: Locale, state: State, message: Message, args: Args) {
    try {
      if (!(message.member.hasPermission("ADMINISTRATOR") || message.member.hasPermission("MANAGE_MESSAGES")))
        return message.reply(locale.insufficientPerms_manage_messages).then((msg: Message) => {
          msg.delete({ timeout: 5000 });
        });

      const amount = Number(args[0]);
      if (amount === NaN || !(amount >= 2 && amount <= 100)) {
        Log.w(`Delete : Invalid value : ${amount}`);
        return message.channel.send(locale.invalidAmount);
      }

      const result = await (message.channel as TextChannel).bulkDelete(amount);

      if (result) return message.channel.send({ embed: { color: config.color.primary, author: { name: `🗑 ${amount}${locale.delete}` }, footer: { text: message.author.tag }, timestamp: new Date() } });
      else return message.channel.send(locale.err_cmd);
    } catch (err) {
      Log.e(`Delete > 1 > ${err}`);
      message.channel.send(locale.err_cmd);
    }
  },
};

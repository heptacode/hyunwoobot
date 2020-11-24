import * as Discord from "discord.js";
import Log from "../util/logger";

module.exports = {
  name: "delete",
  aliases: ["del", "rm", "remove", "삭제", "청소"],
  description: "Bulk delete",
  async execute(locale, dbRef, docRef, message, args) {
    try {
      if (!message.member.guild.me.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`${locale.insufficientPerms_delete}`);

      let amount = Number(args[0]);
      if (amount === NaN || !(amount >= 2 && amount <= 100)) {
        Log.w(`Delete : Invalid value : ${amount}`);
        return message.channel.send(`${locale.invalidAmount}`);
      }

      let result = await message.channel.bulkDelete(amount);
      if (result) return message.channel.send(new Discord.MessageEmbed().setColor("#7788D4").setAuthor(`${amount}${locale.delete}`));
      else return message.channel.send(`${locale.err_cmd}`);
    } catch (err) {
      Log.e(`Delete > 1 > ${err}`);
      message.channel.send(`${locale.err_cmd}`);
    }
  },
};

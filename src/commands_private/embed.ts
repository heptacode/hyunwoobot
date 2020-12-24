import { Message, MessageEmbed } from "discord.js";
import { Args, Locale, State } from "../";
import Log from "../modules/logger";

module.exports = {
  name: "embed",
  execute(locale: Locale, state: State, message: Message, args: Args) {
    try {
      if (!(message.member.hasPermission("ADMINISTRATOR") || message.member.hasPermission("MANAGE_MESSAGES")))
        return message.channel.send(locale.insufficientPerms_manage_messages).then((msg: Message) => {
          msg.delete({ timeout: 5000 });
        });

      message.channel.send({
        embed: JSON.parse(args.join(" ")) as MessageEmbed,
      });
    } catch (err) {
      Log.e(`Embed > ${err}`);
    }
  },
};

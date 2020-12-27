import { Message, MessageEmbed } from "discord.js";
import { Args, Locale, State } from "../";
import Log from "../modules/logger";

export default {
  name: "edit",
  async execute(locale: Locale, state: State, message: Message, args: Args) {
    try {
      if (!(message.member.hasPermission("ADMINISTRATOR") || message.member.hasPermission("MANAGE_MESSAGES"))) {
        message.react("❌");
        return message.channel.send(locale.insufficientPerms_manage_messages).then((_message: Message) => {
          _message.delete({ timeout: 5000 });
        });
      }

      const _message = await message.channel.messages.fetch(args[0]);

      args.shift();

      await _message.edit({ embed: JSON.parse(args.join(" ").replace(/\n/g, "\\n")) as MessageEmbed });

      return message.react("✅");
    } catch (err) {
      message.react("❌");
      Log.e(`Embed > ${err}`);
    }
  },
};

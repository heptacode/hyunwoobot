import { Message, MessageEmbed, TextChannel } from "discord.js";
import { Args, Locale, State } from "../";
import { getChannelID } from "../modules/converter";
import Log from "../modules/logger";

export default {
  name: "edit",
  async execute(locale: Locale, state: State, message: Message, args: Args) {
    try {
      if (!message.member.hasPermission("MANAGE_MESSAGES")) {
        message.react("❌");
        return message.channel.send(locale.insufficientPerms_manage_messages).then((_message: Message) => {
          _message.delete({ timeout: 5000 });
        });
      }

      if (args.length <= 3) {
        await message.react("❌");
        return message.channel.send(locale.edit_usage);
      }

      const _message = await ((await message.guild.channels.cache.get(getChannelID(message.guild, args[0]))) as TextChannel).messages.fetch(args[1]);

      args.splice(0, 2);

      console.log(JSON.parse(args.join(" ").replace(/\n/g, "\\n")));
      await _message.edit({ embed: JSON.parse(args.join(" ").replace(/\n/g, "\\n")) as MessageEmbed });

      return message.react("✅");
    } catch (err) {
      message.react("❌");
      Log.e(`Embed > ${err}`);
    }
  },
};

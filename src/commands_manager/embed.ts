import { Message, MessageEmbed, TextChannel } from "discord.js";
import { Args, Locale, State } from "../";
import { getChannelID } from "../modules/converter";
import Log from "../modules/logger";

export default {
  name: "embed",
  async execute(locale: Locale, state: State, message: Message, args: Args) {
    try {
      if (!message.member.hasPermission("MANAGE_MESSAGES")) {
        message.react("❌");
        return message.channel.send(locale.insufficientPerms.manage_messages).then((_message: Message) => {
          _message.delete({ timeout: 5000 });
        });
      }

      if (args.length <= 1) {
        message.react("❌");
        return message.channel.send(locale.usage.embed);
      }

      const textChannel = getChannelID(message.guild, args[0]);
      args.shift();
      await (message.guild.channels.cache.get(textChannel) as TextChannel).send({ embed: JSON.parse(args.join(" ").replace(/\n/g, "\\n")) as MessageEmbed });

      return message.react("✅");
    } catch (err) {
      message.react("❌");
      Log.e(`Embed > ${err}`);
    }
  },
};

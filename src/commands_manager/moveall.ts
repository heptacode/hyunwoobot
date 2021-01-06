import { GuildMember, Message } from "discord.js";
import { Args, Locale, State } from "../";
import { getChannelID } from "../modules/converter";
import Log from "../modules/logger";

export default {
  name: "moveall",
  async execute(locale: Locale, state: State, message: Message, args: Args) {
    try {
      if (!message.member.hasPermission("MOVE_MEMBERS")) {
        message.react("❌");
        return message.channel.send(locale.insufficientPerms.move_members).then((_message: Message) => {
          _message.delete({ timeout: 5000 });
        });
      }

      const fromChannel = getChannelID(message.guild, args[0]);
      const targetChannel = getChannelID(message.guild, args[1]);

      if (args.length <= 1) {
        return message.channel.send(locale.usage.moveAll);
      } else if ((args[0] === "afk" || fromChannel) && (args[1] === "afk" || targetChannel)) {
        return message.guild.channels.cache.get(fromChannel).members.forEach(async (_member: GuildMember) => {
          try {
            await _member.voice.setChannel(targetChannel);
          } catch (err) {
            Log.e(`MoveAll > ${err}`);
          }
          return await message.react("✅");
        });
      }
      return await message.react("❌");
    } catch (err) {
      message.react("❌");
      Log.e(`Voice > ${err}`);
    }
  },
};

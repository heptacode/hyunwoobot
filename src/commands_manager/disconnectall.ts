import { GuildMember, Message } from "discord.js";
import { Args, Locale, State } from "../";
import { getChannelID } from "../modules/converter";
import Log from "../modules/logger";

export default {
  name: "disconnectall",
  async execute(locale: Locale, state: State, message: Message, args: Args) {
    try {
      if (!message.member.hasPermission("MOVE_MEMBERS")) {
        message.react("❌");
        return message.channel.send(locale.insufficientPerms_move_members).then((_message: Message) => {
          _message.delete({ timeout: 5000 });
        });
      }

      if (args.length <= 0) {
        return message.channel.send(locale.disconnectAll_usage);
      } else if (args[0] === "afk") {
        message.guild.afkChannel.members.forEach(async (_member: GuildMember) => {
          try {
            await _member.voice.kick();
          } catch (err) {
            Log.e(`DisconnectAll > AFK > ${err}`);
          }
          return await message.react("✅");
        });
      } else if (getChannelID(message.guild, args[0])) {
        message.guild.channels.cache.get(getChannelID(message.guild, args[0])).members.forEach(async (_member: GuildMember) => {
          try {
            await _member.voice.kick();
          } catch (err) {
            Log.e(`DisconnectAll > ${args[0]} > ${err}`);
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

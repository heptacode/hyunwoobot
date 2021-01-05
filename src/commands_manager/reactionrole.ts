import { Message, TextChannel } from "discord.js";
import { Args, Locale, ReactionRole, State } from "../";
import { getChannelID, getHexfromEmoji, getRoleID } from "../modules/converter";
import firestore from "../modules/firestore";
import Log from "../modules/logger";

export default {
  name: "reactionrole",
  async execute(locale: Locale, state: State, message: Message, args: Args) {
    try {
      if (!message.member.hasPermission("MANAGE_MESSAGES")) {
        await message.react("❌");
        return message.channel.send(locale.insufficientPerms_manage_messages).then((_message: Message) => {
          _message.delete({ timeout: 5000 });
        });
      }

      const method = args[0];
      const channelID = getChannelID(message.guild, args[1]);
      const messageID = args[2];
      const emoji = args[3];
      const role = args[4];

      const channelDocRef = firestore.collection(message.guild.id).doc(channelID);
      let channelDocSnapshot = await channelDocRef.get();

      if (!channelDocSnapshot.exists) {
        await channelDocRef.set({ reactionRoles: [] });
        channelDocSnapshot = await channelDocRef.get();
      }

      const reactionRoles = channelDocSnapshot.data().reactionRoles;

      if (args.length <= 1) {
        await message.react("❌");
        return message.channel.send(locale.reactionrole_usage);
      } else if (method === "add") {
        if (args.length <= 3) return message.channel.send(locale.reactionrole_usage);

        try {
          const _message = await ((await message.guild.channels.cache.get(channelID)) as TextChannel).messages.fetch(messageID);
          await _message.react(emoji);

          reactionRoles.push({ message: _message.id, emoji: getHexfromEmoji(emoji), role: getRoleID(message.guild, role) });
          await channelDocRef.update({ reactionRoles: reactionRoles });

          return await message.react("✅");
        } catch (err) {
          await message.react("❌");
          Log.e(`ReactionRole > Add > ${err}`);
        }
      } else if (method === "remove") {
        if (args.length <= 2) return message.channel.send(locale.reactionrole_usage);
        try {
          const _message = await ((await message.guild.channels.cache.get(channelID)) as TextChannel).messages.fetch(messageID);

          const idx = reactionRoles.findIndex((reactionRole: ReactionRole) => reactionRole.emoji === getHexfromEmoji(emoji));
          if (!idx) return await message.react("❌");

          reactionRoles.splice(idx, 1);
          await channelDocRef.update({ reactionRoles: reactionRoles });
          await _message.reactions.cache.get(emoji).remove();
          return await message.react("✅");
        } catch (err) {
          await message.react("❌");
          Log.e(`ReactionRole > Remove > ${err}`);
        }
      } else if (method === "purge") {
        try {
          const _message = await ((await message.guild.channels.cache.get(channelID)) as TextChannel).messages.fetch(messageID);

          reactionRoles.forEach(() => {
            const idx = reactionRoles.findIndex((reactionRole: ReactionRole) => reactionRole.message === messageID);
            reactionRoles.splice(idx, 1);
          });
          await channelDocRef.update({ reactionRoles: reactionRoles });
          await _message.reactions.removeAll();
          return await message.react("✅");
        } catch (err) {
          await message.react("❌");
          Log.e(`ReactionRole > Purge > ${err}`);
        }
      }
    } catch (err) {
      await message.react("❌");
      Log.e(`ReactionRole > ${err}`);
    }
  },
};

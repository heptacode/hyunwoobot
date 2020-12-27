import { Message } from "discord.js";
import { Args, Locale, ReactionRole, ReactionRoleItem, State } from "../";
import { getHexfromEmoji, getRoleID } from "../modules/converter";
import firestore from "../modules/firestore";
import Log from "../modules/logger";

export default {
  name: "reactionrole",
  async execute(locale: Locale, state: State, message: Message, args: Args) {
    try {
      if (!(message.member.hasPermission("ADMINISTRATOR") || message.member.hasPermission("MANAGE_MESSAGES"))) {
        await message.react("❌");
        return message.channel.send(locale.insufficientPerms_manage_messages).then((_message: Message) => {
          _message.delete({ timeout: 5000 });
        });
      }

      const method = args[0];
      const messageID = args[1];
      const emoji = args[2];
      const role = args[3];

      const reactionRoleDocRef = firestore.collection(message.guild.id).doc(message.channel.id);
      const reactionRoleDocSnapshot = await reactionRoleDocRef.get();

      if (args.length <= 1) {
        await message.react("❌");
        return message.channel.send(locale.reactionrole_usage);
      } else if (method === "add") {
        if (args.length <= 3) return message.channel.send(locale.reactionrole_usage);

        try {
          const _message = await message.channel.messages.fetch(messageID);
          await _message.react(emoji);

          if (!reactionRoleDocSnapshot.exists) await reactionRoleDocRef.set({ [_message.id]: [{ emoji: getHexfromEmoji(emoji), role: getRoleID(message.guild, role) }] } as ReactionRole);
          else {
            for (const [key, reactionRoleConfig] of Object.entries(reactionRoleDocSnapshot.data())) {
              if (key === messageID) {
                reactionRoleConfig.push({ emoji: getHexfromEmoji(emoji), role: getRoleID(message.guild, role) });
                await reactionRoleDocRef.update({ [_message.id]: reactionRoleConfig });
                return await message.react("✅");
              }
            }
          }
        } catch (err) {
          await message.react("❌");
          Log.e(`ReactionRole > Add > ${err}`);
        }
      } else if (method === "remove") {
        if (args.length <= 2) return message.channel.send(locale.reactionrole_usage);

        try {
          const _message = await message.channel.messages.fetch(messageID);
          if (reactionRoleDocSnapshot.exists) {
            for (const [key, reactionRoleConfig] of Object.entries(reactionRoleDocSnapshot.data())) {
              if (key === messageID) {
                for (const i in reactionRoleConfig as ReactionRoleItem[]) {
                  if (reactionRoleConfig[i].emoji == getHexfromEmoji(emoji)) {
                    reactionRoleConfig.splice(Number(i), 1);
                    await reactionRoleDocRef.update({ [_message.id]: reactionRoleConfig });
                    await _message.reactions.cache.get(emoji).remove();
                    return await message.react("✅");
                  }
                }
              }
            }
          }
        } catch (err) {
          await message.react("❌");
          Log.e(`ReactionRole > Remove > ${err}`);
        }
      } else if (method === "purge") {
        try {
          const _message = await message.channel.messages.fetch(args[1]);

          const payload: ReactionRole[] = reactionRoleDocSnapshot.data() as ReactionRole[];
          for (const i in payload) {
            if (payload[messageID] === messageID) {
              payload.splice(Number(i), 1);

              if (payload.length >= 1) await reactionRoleDocRef.update({ [messageID]: payload });
              else await reactionRoleDocRef.delete();

              await _message.reactions.removeAll();
              return await message.react("✅");
            }
          }
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

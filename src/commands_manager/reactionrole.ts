import { Message } from "discord.js";
import { Args, Locale, ReactionRole, ReactionRoleItem, State } from "..";
import firestore from "../modules/firestore";
import Log from "../modules/logger";

export default {
  name: "reacationrole",
  async execute(locale: Locale, state: State, message: Message, args: Args) {
    try {
      if (!(message.member.hasPermission("ADMINISTRATOR") || message.member.hasPermission("MANAGE_MESSAGES")))
        return message.channel.send(locale.insufficientPerms_manage_messages).then((_message: Message) => {
          _message.delete({ timeout: 5000 });
        });

      const action = args[0];
      const messageID = args[1];
      const emoji = args[2];
      const role = args[3];

      const reactionRoleDocRef = firestore.collection(message.guild.id).doc(message.channel.id);
      const reactionRoleDocSnapshot = await reactionRoleDocRef.get();

      if (args.length <= 2) {
        return message.channel.send(locale.reactionrole_usage);
      } else if (action === "add") {
        const _message = await message.channel.messages.fetch(messageID);
        await _message.react(emoji);

        if (!reactionRoleDocSnapshot.exists) await reactionRoleDocRef.set({ [_message.id]: [{ emoji: emoji, role: role }] } as ReactionRole);
        else {
          if (reactionRoleDocSnapshot.data().id === _message.id) {
            const payload: ReactionRoleItem[] = reactionRoleDocSnapshot.data()[_message.id] as ReactionRoleItem[];
            payload.push({ emoji: emoji, role: role });
            await reactionRoleDocRef.update(payload);
          } else {
            const payload = reactionRoleDocSnapshot.data();
            payload[_message.id] = [{ emoji: emoji, role: role }];
            await reactionRoleDocRef.update(payload);
          }
        }
      } else if (args[0] === "remove") {
        if (!reactionRoleDocSnapshot.exists) return;
        const _message = await message.channel.messages.fetch(messageID);
        if (reactionRoleDocSnapshot.data().id !== _message.id) return;

        const payload: ReactionRoleItem[] = reactionRoleDocSnapshot.data()[messageID] as ReactionRoleItem[];
        for (const i in payload as ReactionRoleItem[]) {
          if (!payload[i]) return;
          if (payload[i].emoji === emoji) payload.splice(Number(i), 1);
        }
        await reactionRoleDocRef.update({ [messageID]: payload });
        _message.reactions.cache.get(args[1]).remove();
      } else if (args[0] === "purge") {
        const _message = await message.channel.messages.fetch(args[1]);

        const payload: ReactionRole[] = reactionRoleDocSnapshot.data() as ReactionRole[];
        for (const i in payload as ReactionRole[]) {
          console.log(payload[messageID]);
          if (payload[messageID] === messageID) payload.splice(Number(i), 1);
        }

        if (payload.length >= 1) await reactionRoleDocRef.update({ [messageID]: payload });
        else await reactionRoleDocRef.delete();

        _message.reactions.removeAll();
      }
      await message.react("✅");
    } catch (err) {
      Log.e(`Reaction Add > ${err}`);
    }
  },
};

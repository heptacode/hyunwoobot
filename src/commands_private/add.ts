import { Message } from "discord.js";
import { Args, Locale, ReactionRole, ReactionRoleItem, State } from "../";
import firestore from "../firestore";
import Log from "../modules/logger";

module.exports = {
  name: "add",
  async execute(locale: Locale, state: State, message: Message, args: Args) {
    try {
      if (!(message.member.hasPermission("ADMINISTRATOR") || message.member.hasPermission("MANAGE_MESSAGES")))
        return message.channel.send(locale.insufficientPerms_manage_messages).then((msg: Message) => {
          msg.delete({ timeout: 5000 });
        });

      const msg = await message.channel.messages.fetch(args[0]);

      await msg.react(args[1]);

      const reactionRoleDocRef = firestore.collection(message.guild.id).doc(message.channel.id);
      const reactionRoleDocSnapshot = await reactionRoleDocRef.get();
      if (!reactionRoleDocSnapshot.exists) await reactionRoleDocRef.set({ [msg.id]: [{ emoji: args[1], role: args[2] }] } as ReactionRole);
      else {
        if (reactionRoleDocSnapshot.data().id === msg.id) {
          const payload: ReactionRoleItem[] = reactionRoleDocSnapshot.data()[msg.id] as ReactionRoleItem[];
          payload.push({ emoji: args[1], role: args[2] });
          await reactionRoleDocRef.update(payload);
        } else {
          const payload = reactionRoleDocSnapshot.data();
          payload[msg.id] = [{ emoji: args[1], role: args[2] }];
          await reactionRoleDocRef.update(payload);
        }
      }

      await message.react("✅");
    } catch (err) {
      Log.e(`Reaction Add > ${err}`);
    }
  },
};

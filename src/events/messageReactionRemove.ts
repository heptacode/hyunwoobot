import { MessageReaction, User } from "discord.js";
import { getHexfromEmoji } from "../modules/converter";
import { sendEmbed } from "../modules/embedSender";
import firestore from "../modules/firestore";
import Log from "../modules/logger";
import { client, state } from "../app";
import props from "../props";
import { ReactionRole } from "../";

export default () => {
  client.on("messageReactionRemove", async (reaction: MessageReaction, user: User) => {
    if (reaction.me) return;
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (err) {
        Log.e(`MessageReactionRemove > Fetch > ${err}`);
        return;
      }
    }
    try {
      const channelDocRef = firestore.collection(reaction.message.guild.id).doc(reaction.message.channel.id);
      const channelDocSnapshot = await channelDocRef.get();
      if (!channelDocSnapshot.exists) return;

      const reactionRoles: ReactionRole[] = channelDocSnapshot.data().reactionRoles;
      const reactionRole = reactionRoles.find((reactionRole: ReactionRole) => reactionRole.message === reaction.message.id && reactionRole.emoji === getHexfromEmoji(reaction.emoji.name));
      // Check If Role Exists
      if (!reactionRole || !reaction.message.guild.roles.cache.has(reactionRole.role)) return;
      // Check If User Has Role
      if (!reaction.message.guild.member(user).roles.cache.has(reactionRole.role)) return;
      reaction.message.guild.member(user).roles.remove(reactionRole.role, "[ReactionRole] MessageReactionRemove");

      return await sendEmbed(
        { member: reaction.message.member },
        {
          color: props.color.red,
          author: { name: state.get(reaction.message.guild.id).locale.reactionRole.roleRemoved, iconURL: user.avatarURL() },
          description: `<@${user.id}> -= <@&${reactionRole.role}>`,
          timestamp: new Date(),
        },
        { guild: true, log: true }
      );
    } catch (err) {
      Log.e(`MessageReactionRemove > ${err}`);
    }
  });
};

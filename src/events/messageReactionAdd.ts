import { MessageReaction, User } from "discord.js";
import firestore from "../modules/firestore";
import { client } from "../app";
import { getHexfromEmoji } from "../modules/converter";
import props from "../props";
import { ReactionRole } from "../";
import Log from "../modules/logger";

export default () => {
  client.on("messageReactionAdd", async (reaction: MessageReaction, user: User) => {
    if (reaction.me) return;
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (err) {
        Log.e(`MessageReactionAdd > Fetch > ${err}`);
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
      if (reaction.message.guild.member(user).roles.cache.has(reactionRole.role)) return;
      reaction.message.guild.member(user).roles.add(reactionRole.role);
      return await Log.p({
        guild: reaction.message.guild,
        embed: {
          color: props.color.info,
          author: { name: "Role Append [ReactionRole]", iconURL: user.avatarURL() },
          description: `<@${user.id}> += <@&${reactionRole.role}>`,
          timestamp: new Date(),
        },
      });
    } catch (err) {
      Log.e(`MessageReactionAdd > ${err}`);
    }
  });
};

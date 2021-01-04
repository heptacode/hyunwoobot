import { MessageReaction, User } from "discord.js";
import firestore from "../modules/firestore";
import { ReactionRole, ReactionRoleItem } from "../";
import { getHexfromEmoji } from "../modules/converter";
import props from "../props";
import { client } from "../app";
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
      const guildRolesRef: ReactionRole[] = (await firestore.collection(reaction.message.guild.id).doc(reaction.message.channel.id).get()).data() as ReactionRole[];
      if (!guildRolesRef[reaction.message.id]) return;

      const reactionRoleItem: ReactionRoleItem = guildRolesRef[reaction.message.id].find((reactionRoleItem: ReactionRoleItem) => reactionRoleItem.emoji === getHexfromEmoji(reaction.emoji.name));
      // Check If Role Exists
      if (!reactionRoleItem || !reaction.message.guild.roles.cache.has(reactionRoleItem.role)) return;
      // Check If User Has Role
      if (reaction.message.guild.member(user).roles.cache.has(reactionRoleItem.role)) return;

      reaction.message.guild.member(user).roles.add(reactionRoleItem.role);

      return await Log.p({
        guild: reaction.message.guild,
        embed: {
          color: props.color.info,
          author: { name: "Role Append [ReactionRole]", iconURL: user.avatarURL() },
          description: `<@${user.id}> += <@&${reactionRoleItem.role}>`,
          timestamp: new Date(),
        },
      });
    } catch (err) {
      Log.e(`MessageReactionAdd > ${err}`);
    }
  });
};

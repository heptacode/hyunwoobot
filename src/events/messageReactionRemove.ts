import { MessageReaction, User } from 'discord.js';
import { getHexFromEmoji } from '@/modules/converter';
import { createError } from '@/modules/createError';
import { sendEmbed } from '@/modules/embedSender';
import { log } from '@/modules/logger';
import { client, states } from '@/app';
import { props } from '@/props';
import { ReactionRole } from '@/types';

export async function messageReactionRemove(reaction: MessageReaction, user: User) {
  // if (reaction.me || reaction.message.channel.type === "dm") return;
  // if (reaction.partial) {
  //   try {
  //     await reaction.fetch();
  //   } catch (err) {
  //     log.e(`MessageReactionRemove > Fetch > ${err}`);
  //     return;
  //   }
  // }
  // try {
  //   const reactionRole = states
  //     .get(reaction.message.guild.id)
  //     .reactionRoles.find((reactionRole: ReactionRole) => reactionRole.message === reaction.message.id && reactionRole.emoji === getHexFromEmoji(reaction.emoji.name));
  //   // Check If Role Exists
  //   if (!reactionRole || !reaction.message.guild.roles.cache.has(reactionRole.role)) return;
  //   // Check If User Has Role
  //   if (!reaction.message.guild.member(user).roles.cache.has(reactionRole.role)) return;
  //   reaction.message.guild.member(user).roles.remove(reactionRole.role, "[ReactionRole] MessageReactionRemove");
  //   return sendEmbed(
  //     { member: reaction.message.member },
  //     {
  //       color: props.color.red,
  //       author: { name: states.get(reaction.message.guild.id).locale.reactionRole.roleRemoved, iconURL: user.avatarURL() },
  //       description: `<@${user.id}> -= <@&${reactionRole.role}>`,
  //       timestamp: new Date(),
  //     },
  //     { guild: true, log: true }
  //   );
  // } catch (err) {
  //   createError("MessageReactionRemove", err, { message: reaction.message });
  // }
}

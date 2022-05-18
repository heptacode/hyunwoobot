import { states } from '@/app';
import { createError } from '@/modules/createError';
import { setGuild } from '@/modules/initializer';
import { sendEmbed } from '@/modules/sendEmbed';
import { props } from '@/props';
import { GuildMember } from 'discord.js';

export async function guildMemberAdd(member: GuildMember) {
  try {
    sendEmbed(
      { member: member },
      {
        color: props.color.cyan,
        author: {
          name: states.get(member.guild.id).locale.log.guildMemberAdd,
          iconURL: props.icon.in,
        },
        description: `**<@${member.user.id}>${
          states.get(member.guild.id).locale.log.guildMemberAdded
        }**`,
        timestamp: new Date(),
      },
      { guild: true, log: true }
    );

    for (const autoRole of states.get(member.guild.id).autoRoles) {
      if (
        !(
          (autoRole.type === 'user' && !member.user.bot) ||
          (autoRole.type === 'bot' && member.user.bot)
        )
      )
        continue;

      await member.roles.add(autoRole.role, '[AutoRole] GuildMemberAdd');

      await sendEmbed(
        { member: member },
        {
          color: props.color.cyan,
          author: {
            name: states.get(member.guild.id).locale.autoRole.roleAppended,
            iconURL: props.icon.role_append,
          },
          description: `**<@${member.user.id}> += <@&${autoRole.role}>**`,
          timestamp: new Date(),
        },
        { guild: true, log: true }
      );
    }

    return setGuild(member.guild.id);
  } catch (err) {
    createError('GuildMemberAdd', err, { guild: member.guild });
  }
}

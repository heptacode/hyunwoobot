import { states } from '@/app';
import { createError } from '@/modules/createError';
import { setGuild } from '@/modules/initializer';
import { sendEmbed } from '@/modules/sendEmbed';
import { props } from '@/props';
import { GuildMember } from 'discord.js';

export async function guildMemberRemove(member: GuildMember) {
  try {
    sendEmbed(
      { member: member },
      {
        color: props.color.cyan,
        author: {
          name: states.get(member.guild.id).locale.log.guildMemberRemove,
          iconURL: props.icon.out,
        },
        description: `**<@${member.user.id}>${
          states.get(member.guild.id).locale.log.guildMemberRemoved
        }**`,
        timestamp: new Date(),
      },
      { guild: true, log: true }
    );

    return setGuild(member.guild.id);
  } catch (err) {
    createError('GuildMemberRemove', err, { guild: member.guild });
  }
}

import { client } from '@/app';
import { createError } from '@/modules/createError';
import { sendEmbed } from '@/modules/sendEmbed';
import { props } from '@/props';
import { Locale } from '@/types';
import { CommandInteraction, Message, PermissionResolvable } from 'discord.js';

export async function checkPermission(
  locale: Locale,
  payload: { interaction?: CommandInteraction; message?: Message },
  permission: PermissionResolvable
): Promise<boolean> {
  try {
    if (
      (payload.interaction && payload.interaction.member.user.id === props.developerID) ||
      (payload.message && payload.message.member.id === props.developerID)
    )
      return false;
    if (
      payload.interaction &&
      !client.guilds
        .resolve(payload.interaction.guildId)
        .members.resolve(payload.interaction.member.user.id)
        .permissions.has(permission)
    ) {
      await sendEmbed(
        { interaction: payload.interaction },
        {
          description: `❌ **${locale.insufficientPerms[String(permission).toLowerCase()]}**`,
        }
      );
      return true;
    } else if (
      payload.message &&
      !payload.message.guild.members.resolve(payload.message.member.id).permissions.has(permission)
    ) {
      await sendEmbed(
        { message: payload.message },
        {
          description: `❌ **${locale.insufficientPerms[String(permission).toLowerCase()]}**`,
        }
      );
      return true;
    }
    return false;
  } catch (err) {
    createError('CheckPermission', err, payload);
  }
}

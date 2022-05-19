import { sendEmbed } from '@/modules/sendEmbed';
import { props } from '@/props';
import { State, VoiceRole } from '@/types';
import { TextChannel, VoiceState } from 'discord.js';

export async function oldVoiceRole(state: State, oldState: VoiceState) {
  if (state.voiceRoles && state.voiceRoles.length >= 1) {
    const voiceRole: VoiceRole = state.voiceRoles.find(
      (voiceRole: VoiceRole) => voiceRole.voiceChannel === oldState.channelId
    );
    if (voiceRole && oldState.member.roles.cache.has(voiceRole.role)) {
      if (voiceRole.textChannel) {
        (oldState.guild.channels.resolve(voiceRole.textChannel) as TextChannel).send({
          embeds: [
            {
              color: props.color.red,
              author: {
                name: oldState.member.displayName,
                iconURL: oldState.member.user.avatarURL(),
              },
            },
          ],
        });
      }

      await oldState.member.roles.remove(voiceRole.role, '[VoiceRole] Switch/Leave Voice');

      sendEmbed(
        { member: oldState.member },
        {
          color: props.color.cyan,
          author: { name: state.locale.voiceRole.roleRemoved, iconURL: props.icon.role_remove },
          description: `<@${oldState.member.user.id}> -= <@&${voiceRole.role}>`,
          timestamp: new Date(),
        },
        { guild: true, log: true }
      );
      return;
    }
  }
}

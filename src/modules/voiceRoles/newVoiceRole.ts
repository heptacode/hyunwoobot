import { sendEmbed } from '@/modules/sendEmbed';
import { props } from '@/props';
import { State, VoiceRole } from '@/types';
import { TextChannel, VoiceState } from 'discord.js';

export async function newVoiceRole(state: State, newState: VoiceState) {
  if (state.voiceRoles && state.voiceRoles.length >= 1) {
    const voiceRole: VoiceRole = state.voiceRoles.find(
      (voiceRole: VoiceRole) => voiceRole.voiceChannel === newState.channelId
    );
    if (voiceRole && !newState.member.roles.cache.has(voiceRole.role)) {
      await newState.member.roles.add(voiceRole.role, '[VoiceRole] Join Voice');

      if (voiceRole.textChannel) {
        (newState.guild.channels.resolve(voiceRole.textChannel) as TextChannel).send({
          embeds: [
            {
              color: props.color.cyan,
              author: {
                name: newState.member.displayName,
                iconURL: newState.member.user.avatarURL(),
              },
            },
          ],
        });
      }

      sendEmbed(
        { member: newState.member },
        {
          color: props.color.cyan,
          author: {
            name: state.locale.voiceRole.roleAppended,
            iconURL: props.icon.role_append,
          },
          description: `<@${newState.member.user.id}> += <@&${voiceRole.role}>`,
          timestamp: new Date(),
        },
        { guild: true, log: true }
      );
      return;
    }
  }
}

import { createError } from '@/modules/createError';
import { sendEmbed } from '@/modules/sendEmbed';
import { props } from '@/props';
import { State } from '@/types';
import { VoiceState } from 'discord.js';

export function newAfkChannel(state: State, newState: VoiceState) {
  if (state.afkChannel && state.afkChannel.has(newState.member.id)) {
    clearTimeout(state.afkChannel.get(newState.member.id));
    state.afkChannel.delete(newState.member.id);
  }

  if (state.afkTimeout > 0 && newState.channelId === newState.guild.afkChannelId) {
    state.afkChannel.set(
      newState.member.id,
      setTimeout(async () => {
        try {
          if (!newState.guild.afkChannel.members.has(newState.member.id)) return;

          await newState.disconnect('[AFKTimeout] Disconnected due to inactivity');

          sendEmbed(
            { member: newState.member },
            {
              color: props.color.purple,
              description: `**${state.locale.afkTimeout.disconnected_dm.replace(
                '{min}',
                String(state.afkTimeout)
              )}**`,
            },
            { dm: true }
          );

          sendEmbed(
            { member: newState.member },
            {
              color: props.color.cyan,
              author: {
                name: state.locale.afkTimeout.afkTimeout,
                iconURL: props.icon.call_end,
              },
              description: `**<@${
                newState.member.user.id
              }>${state.locale.afkTimeout.disconnected.replace(
                '{min}',
                String(state.afkTimeout)
              )}**`,
              timestamp: new Date(),
            },
            { guild: true, log: true }
          );
          return;
        } catch (err) {
          createError('VoiceStateUpdate > AFK', err, { guild: newState.guild });
        }
      }, state.afkTimeout * 60000)
    );

    sendEmbed(
      { member: newState.member },
      {
        color: props.color.cyan,
        author: {
          name: `${state.locale.afkTimeout.countdownStarted.replace(
            '{min}',
            String(state.afkTimeout)
          )}`,
          iconURL: props.icon.timer,
        },
        description: `<@${newState.member.user.id}>`,
        timestamp: new Date(),
      },
      { guild: true, log: true }
    );
    return;
  }
}

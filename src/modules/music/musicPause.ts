import { createError } from '@/modules/createError';
import { voiceDisconnect, voiceStateCheck } from '@/modules/voice';
import { props } from '@/props';
import { State } from '@/types';
import { CommandInteraction } from 'discord.js';

export async function musicPause(state: State, interaction: CommandInteraction) {
  try {
    if (
      (await voiceStateCheck(state.locale, { interaction: interaction })) ||
      !state.connection ||
      !state.player
    )
      return;
    state.player.pause();
    state.isPlaying = false;

    if (state.timeout) {
      clearTimeout(state.timeout);
    }
    state.timeout = setTimeout(() => voiceDisconnect(state), props.disconnectTimeout);
  } catch (err) {
    createError('Pause', err, { interaction: interaction });
  }
}

import { createError } from '@/modules/createError';
import { voiceDisconnect, voiceStateCheck } from '@/modules/voice';
import { props } from '@/props';
import { State } from '@/types';
import { CommandInteraction } from 'discord.js';

export async function musicStop(state: State, interaction: CommandInteraction) {
  try {
    if (
      (await voiceStateCheck(state.locale, { interaction: interaction })) ||
      !state.connection ||
      !state.player
    )
      return;
    state.isPlaying = false;
    state.queue = [];
    state.player.stop();

    if (state.timeout) {
      clearTimeout(state.timeout);
    }
    state.timeout = setTimeout(() => voiceDisconnect(state), props.disconnectTimeout);
  } catch (err) {
    createError('Stop', err, { interaction: interaction });
  }
}

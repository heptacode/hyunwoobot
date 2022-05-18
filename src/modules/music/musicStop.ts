import { Interaction } from 'discord.js';
import { createError } from '@/modules/createError';
import { voiceDisconnect, voiceStateCheck } from '@/modules/voice';
import { props } from '@/props';
import { State } from '@/types';

export async function musicStop(state: State, interaction: Interaction) {
  try {
    // if (
    //   (await voiceStateCheck(state.locale, { interaction: interaction })) ||
    //   !state.connection ||
    //   !state.connection.dispatcher
    // )
    //   return;
    // state.isPlaying = false;
    // state.queue = [];
    // if (state.stream) {
    //   state.stream.pause();
    //   state.stream.destroy();
    // }
    // state.connection.dispatcher.end();
    // if (state.timeout) clearTimeout(state.timeout);
    // state.timeout = setTimeout(() => voiceDisconnect(state), props.disconnectTimeout);
  } catch (err) {
    createError('Stop', err, { interaction: interaction });
  }
}

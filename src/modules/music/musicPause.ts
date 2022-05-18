import { CommandInteraction } from 'discord.js';
import { createError } from '@/modules/createError';
import { voiceStateCheck } from '@/modules/voice';
import { State } from '@/types';

export async function musicPause(state: State, interaction: CommandInteraction) {
  try {
    // if (
    //   (await voiceStateCheck(state.locale, { interaction: interaction })) ||
    //   !state.connection ||
    //   !state.connection.dispatcher
    // )
    //   return;
    // state.connection.dispatcher.pause();
    // state.isPlaying = false;
  } catch (err) {
    createError('Pause', err, { interaction: interaction });
  }
}

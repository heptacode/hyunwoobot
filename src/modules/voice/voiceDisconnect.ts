import { createError } from '@/modules/createError';
import { State } from '@/types';
import { getVoiceConnection } from '@discordjs/voice';
import { CommandInteraction } from 'discord.js';

export async function voiceDisconnect(state: State, interaction?: CommandInteraction) {
  try {
    if (!state.connection || !getVoiceConnection(state.guildId)) return;

    state.isPlaying = false;
    getVoiceConnection(state.guildId).destroy();
    state.connection = null;
  } catch (err) {
    createError('VoiceDisconnect', err, { interaction: interaction });
  }
}

import { Interaction } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import { createError } from '@/modules/createError';
import { State } from '@/types';

export async function voiceDisconnect(state: State, interaction?: Interaction) {
  try {
    if (!state.connection || /*!state.connection.voice*/ !getVoiceConnection(state.guildId)) return;

    state.isPlaying = false;
    getVoiceConnection(state.guildId).destroy();
    // state.connection.voice.channel.leave();
    state.connection = null;
  } catch (err) {
    createError('VoiceDisconnect', err, { interaction: interaction });
  }
}

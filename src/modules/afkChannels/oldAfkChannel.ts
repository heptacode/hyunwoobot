import { State } from '@/types';
import { VoiceState } from 'discord.js';

export function oldAfkChannel(state: State, oldState: VoiceState) {
  if (state.afkChannel && state.afkChannel.has(oldState.member.id)) {
    clearTimeout(state.afkChannel.get(oldState.member.id));
    state.afkChannel.delete(oldState.member.id);
  }
}

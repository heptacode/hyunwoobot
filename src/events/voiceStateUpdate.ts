import { client, states } from '@/app';
import { newAfkChannel, oldAfkChannel } from '@/modules/afkChannels';
import { createError } from '@/modules/createError';
import { newPrivateRoom, oldPrivateRoom } from '@/modules/privateRooms';
import { newVoiceRole, oldVoiceRole } from '@/modules/voiceRoles';
import { firestore } from '@/services/firebase.service';
import { State } from '@/types';
import { VoiceState } from 'discord.js';

export async function voiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
  if (oldState?.channelId === newState?.channelId) return;

  const state: State = states.get(newState.guild.id || oldState.guild.id);

  if (oldState.member.user.id === client.user.id) {
    if (state.timeout) {
      clearTimeout(state.timeout);
    }
    state.connection = null;
    return;
  }
  // if (newState.member.user.id === client.user.id) return (state.connection = newState.connection);

  if (oldState.member.user.bot || newState.member.user.bot) return;

  const configDocRef = firestore.collection(newState.guild.id || oldState.guild.id).doc('config');

  if (oldState.channelId) {
    // User Leave
    try {
      oldPrivateRoom(state, oldState, newState, configDocRef);

      oldAfkChannel(state, oldState);

      oldVoiceRole(state, oldState);
    } catch (err) {
      createError('VoiceStateUpdate > Switch/Leave', err, { guild: oldState.guild });
    }
  }

  if (newState.channelId) {
    // User Join
    try {
      newPrivateRoom(state, newState, configDocRef);

      newAfkChannel(state, newState);

      newVoiceRole(state, newState);
    } catch (err) {
      createError('VoiceStateUpdate > Join/Switch', err, { guild: oldState.guild });
    }
  }
}

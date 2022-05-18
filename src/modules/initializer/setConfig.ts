import { createError } from '../createError';
import { firestore } from '@/services/firebase';
import { Config } from '@/types';

export async function setConfig(guildID: string) {
  try {
    const configDocRef = firestore.collection(guildID).doc('config');
    if ((await configDocRef.get()).exists) return;

    await configDocRef.create({
      afkTimeout: -1,
      alarmChannel: null,
      autoRoles: [],
      locale: 'ko',
      logChannel: null,
      logMessageEvents: false,
      privateRoom: { generator: null, fallback: null },
      privateRooms: [],
      reactionRoles: [],
      userRoles: [],
      voiceRoles: [],
    } as Config);
  } catch (err) {
    createError('Initializer > Config', err, { guild: guildID });
  }
}

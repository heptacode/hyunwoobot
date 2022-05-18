import { createError } from '@/modules/createError';
import { firestore } from '@/services/firebase.service';
import { Config } from '@/types';

export async function setConfig(guildId: string) {
  try {
    const configDocRef = firestore.collection(guildId).doc('config');
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
    createError('Initializer > Config', err, { guild: guildId });
  }
}

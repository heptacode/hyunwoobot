import { client } from '@/app';
import { log } from '@/modules/logger';
import { firestore } from '@/services/firebase.service';

export async function setGuild(guildId: string) {
  try {
    await firestore
      .collection(guildId)
      .doc('guild')
      .set(JSON.parse(JSON.stringify(client.guilds.resolve(guildId))));
  } catch (err) {
    log.e(`SetGuild > ${err}`);
  }
}

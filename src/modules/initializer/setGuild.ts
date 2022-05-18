import { client } from '@/app';
import { log } from '@/modules/logger';
import { firestore } from '@/services/firebase';

export async function setGuild(guildID: string) {
  try {
    await firestore
      .collection(guildID)
      .doc('guild')
      .set(JSON.parse(JSON.stringify(client.guilds.resolve(guildID))));
  } catch (err) {
    log.e(`SetGuild > ${err}`);
  }
}

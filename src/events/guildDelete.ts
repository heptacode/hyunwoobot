import { createError } from '@/modules/createError';
import { log } from '@/modules/logger';
import { firestore } from '@/services/firebase.service';
import { Guild } from 'discord.js';

export async function guildDelete(guild: Guild) {
  try {
    await firestore.collection(guild.id).doc('commands').delete();

    log.w(`Deleted Commands due to GuildDelete [ ${guild.name}(${guild.id}) ]`);
  } catch (err) {
    createError('GuildDelete', err, { guild: guild });
  }
}

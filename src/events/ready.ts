import { client, locales, states } from '@/app';
import { createError } from '@/modules/createError';
import { registerCommands, setGuild, setState } from '@/modules/initializer';
import { log } from '@/modules/logger';
import { firestore } from '@/services/firebase.service';
import { Config } from '@/types';
import { Guild, TextChannel } from 'discord.js';

export async function ready() {
  try {
    for (const collection of await firestore.listCollections()) {
      const guild: Guild = client.guilds.resolve(collection.id);
      if (!guild) {
        log.w(
          `Initialize Skipped [ ${(await collection.doc('guild').get()).data().name} (${
            collection.id
          }) ]`
        );
        continue;
      }

      firestore
        .collection(guild.id)
        .doc('config')
        .onSnapshot(
          async docSnapshot => {
            const config: Config = docSnapshot.data() as Config;
            if (!states.has(guild.id)) {
              log.d(`Initialize Started [ ${guild.name} (${guild.id}) ]`);

              setState(guild.id, config);

              await registerCommands(guild.id);

              for (const reactionRole of config.reactionRoles) {
                await (
                  guild.channels.resolve(reactionRole.textChannel) as TextChannel
                ).messages.fetch({ limit: 100 });
              }

              await setGuild(guild.id);

              log.i(`Initialize Complete [ ${guild.name} (${guild.id}) ]`);
            } else {
              for (const [key, _config] of Object.entries(config)) {
                if (key === 'locale') states.get(guild.id)[key] = locales.get(_config);
                else states.get(guild.id)[key] = _config;
              }
            }
          },
          err => {
            createError('Initialize > Firestore > DocumentUpdate', err);
          }
        );
    }

    await client.user.setPresence(
      process.env.NODE_ENV !== 'production'
        ? {
            status: 'dnd',
            activities: [
              {
                type: 'WATCHING',
                name: 'Visual Studio Code',
                url: 'https://bot.hyunwoo.dev',
              },
            ],
          }
        : {
            status: 'online',
            activities: [{ type: 'WATCHING', name: '/help', url: 'https://bot.hyunwoo.dev' }],
          }
    );
  } catch (err) {
    createError('Ready', err);
  }

  log.i(`Login w/ ${client.user.tag}`);
}

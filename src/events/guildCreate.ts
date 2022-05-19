import { createError } from '@/modules/createError';
import { registerCommands, setConfig, setGuild, setState } from '@/modules/initializer';
import { log } from '@/modules/logger';
import { Guild } from 'discord.js';

export async function guildCreate(guild: Guild) {
  try {
    log.d(`Initialize Started [ ${guild.name}(${guild.id}) ]`);

    await Promise.all([setConfig(guild.id), setGuild(guild.id)]);
    setState(guild.id);
    await registerCommands(guild.id, true);

    log.i(`Initialize Complete [ ${guild.name}(${guild.id}) ]`);
  } catch (err) {
    createError('GuildCreate', err, { guild: guild });
  }
}

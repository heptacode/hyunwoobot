import { Guild } from 'discord.js';

export function getChannelId(guild: Guild, arg: string): string {
  if (arg.startsWith('<#')) arg = arg.slice(2, -1);
  return guild.channels.cache.find(
    channel => channel.id === arg || channel.name.toLowerCase() === arg.toLowerCase()
  ).id;
}

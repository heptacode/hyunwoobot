import { Guild } from "discord.js";

export const getChannelID = (guild: Guild, arg: string): string => {
  if (arg.startsWith("<#")) arg = arg.slice(2, -1);
  return guild.channels.cache.find((channel) => channel.id === arg || channel.name === arg).id;
};

export const getChannelName = (guild: Guild, arg: string): string => {
  if (arg.startsWith("<#")) arg = arg.slice(2, -1);
  return guild.channels.cache.find((channel) => channel.id === arg || channel.name === arg).name;
};

export const getRoleID = (guild: Guild, arg: string): string => {
  if (arg.startsWith("<@&")) arg = arg.slice(3, -1);
  return guild.roles.cache.find((role) => role.id === arg || role.name === arg).id;
};

export const getRoleName = (guild: Guild, arg: string): string => {
  if (arg.startsWith("<@&")) arg = arg.slice(3, -1);
  return guild.roles.cache.find((role) => role.id === arg || role.name === arg).name;
};

export const getLength = (length: number): string => {
  const hours = Math.floor(length / 3600);
  const minutes = Math.floor((length - hours * 3600) / 60);
  const seconds = length % 60;
  if (hours > 0) return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

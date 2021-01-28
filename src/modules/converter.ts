import { Guild, Role } from "discord.js";

export const getRoleID = (guild: Guild, arg: string): string => {
  if (arg.startsWith("<@&")) arg = arg.slice(3, -1);
  return guild.roles.cache.find((role) => role.id === arg || role.name.toLowerCase() === arg.toLowerCase()).id;
};

export const getRoleName = (guild: Guild, arg: string): string => {
  if (arg.startsWith("<@&")) arg = arg.slice(3, -1);
  return guild.roles.cache.find((role) => role.id === arg || role.name.toLowerCase() === arg.toLowerCase()).name;
};

export const getRoleColor = (guild: Guild, arg: string): number => {
  return guild.roles.cache.get(arg).color;
};

export const getRoleHexColor = (guild: Guild, arg: string): string => {
  return guild.roles.cache.get(arg).hexColor;
};

export const getChannelID = (guild: Guild, arg: string): string => {
  if (arg.startsWith("<#")) arg = arg.slice(2, -1);
  return guild.channels.cache.find((channel) => channel.id === arg || channel.name.toLowerCase() === arg.toLowerCase()).id;
};

export const getChannelName = (guild: Guild, arg: string): string => {
  if (arg.startsWith("<#")) arg = arg.slice(2, -1);
  return guild.channels.cache.find((channel) => channel.id === arg || channel.name.toLowerCase() === arg.toLowerCase()).name;
};

export const getHexfromEmoji = (emoji: string): string => {
  return emoji.codePointAt(0).toString(16);
};

export const getEmojifromHex = (hex: string): string => {
  return String.fromCodePoint(Number(`0x${hex}`));
};

export const getLength = (length: number): string => {
  const hours = Math.floor(length / 3600);
  const minutes = Math.floor((length - hours * 3600) / 60);
  const seconds = length % 60;
  if (hours > 0) return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

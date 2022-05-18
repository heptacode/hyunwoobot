import * as managerCommandsList from '@/commands/manager';
import * as userCommandsList from '@/commands/user';
import * as localeList from '@/locales';
import { props } from '@/props';
import '@/services/api.service';
import { Command, Locale, State } from '@/types';
import { Client, Collection } from 'discord.js';
import 'dotenv/config';

export const prefix: string = process.env.PREFIX || props.bot.prefix;
export const client: Client = new Client({
  intents: [
    'DIRECT_MESSAGES',
    'DIRECT_MESSAGE_REACTIONS',
    'GUILDS',
    'GUILD_EMOJIS_AND_STICKERS',
    'GUILD_INTEGRATIONS',
    'GUILD_INVITES',
    'GUILD_MEMBERS',
    'GUILD_MESSAGES',
    'GUILD_MESSAGE_REACTIONS',
    'GUILD_VOICE_STATES',
    'GUILD_WEBHOOKS',
  ],
});
export const locales: Collection<string, Locale> = new Collection();
export const states: Collection<string, State> = new Collection();
export const userCommands: Collection<string, Command> = new Collection();
export const managerCommands: Collection<string, Command> = new Collection();

for (const [code, locale] of Object.entries(localeList)) {
  locales.set(code, locale);
}

for (const [name, command] of Object.entries(userCommandsList)) {
  userCommands.set(name, command);
}

for (const [name, command] of Object.entries(managerCommandsList)) {
  managerCommands.set(name, command);
}

client.login(process.env.TOKEN);

require('@/events');

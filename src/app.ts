import * as managerCommandsList from '@/commands/manager';
import * as userCommandsList from '@/commands/user';
import * as localeList from '@/locales';
import { props } from '@/props';
import '@/services/api.service';
import { Command, Locale, State } from '@/types';
import { Client, Collection, Intents } from 'discord.js';
import 'dotenv/config';

export const prefix: string = process.env.PREFIX || props.bot.prefix;
export const client: Client = new Client({
  intents: [
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_WEBHOOKS,
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

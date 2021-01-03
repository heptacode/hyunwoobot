import path from "path";
import fs from "fs";
import { Client, Collection } from "discord.js";
import { Command, Locale, State } from "./";
import config from "./config";
import "dotenv/config";

export const prefix: string = process.env.PREFIX || config.bot.prefix;
export const client: Client = new Client();
export const locales: Collection<string, Locale> = new Collection();
export const state: Collection<string, State> = new Collection();
export const commands: Collection<string, Command> = new Collection();
export const commands_manager: Collection<string, Command> = new Collection();
export const commands_hidden: Collection<string, Command> = new Collection();

for (const file of fs.readdirSync(path.resolve(__dirname, "../src/locales")).filter((file) => file.match(/(.js|.ts)$/))) {
  const locale: Locale = require(path.resolve(__dirname, `../src/locales/${file}`)).default;
  locales.set(locale.locale, locale);
}

for (const file of fs.readdirSync(path.resolve(__dirname, "../src/commands")).filter((file) => file.match(/(.js|.ts)$/))) {
  const command: Command = require(path.resolve(__dirname, `../src/commands/${file}`)).default;
  commands.set(command.name, command);
}

for (const file of fs.readdirSync(path.resolve(__dirname, "../src/commands_manager")).filter((file) => file.match(/(.js|.ts)$/))) {
  const command: Command = require(path.resolve(__dirname, `../src/commands_manager/${file}`)).default;
  commands_manager.set(command.name, command);
}

for (const file of fs.readdirSync(path.resolve(__dirname, "../src/commands_hidden")).filter((file) => file.match(/(.js|.ts)$/))) {
  const command: Command = require(path.resolve(__dirname, `../src/commands_hidden/${file}`)).default;
  commands_hidden.set(command.name, command);
}

for (const file of fs.readdirSync(path.resolve(__dirname, "../src/events")).filter((file) => file.match(/(.js|.ts)$/))) {
  require(path.resolve(__dirname, `../src/events/${file}`)).default();
}

client.login(process.env.TOKEN);

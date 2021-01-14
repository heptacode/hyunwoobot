import path from "path";
import fs from "fs";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import { Client, Collection } from "discord.js";
import Log from "./modules/logger";
import props from "./props";
import "dotenv/config";
import { Command, Locale, State } from "./";

export const prefix: string = process.env.PREFIX || props.bot.prefix;
export const client: Client = new Client();
export const locales: Collection<string, Locale> = new Collection();
export const state: Collection<string, State> = new Collection();
export const commands: Collection<string, Command> = new Collection();
export const commands_manager: Collection<string, Command> = new Collection();
export const commands_hidden: Collection<string, Command> = new Collection();

for (const file of fs.readdirSync(path.resolve(__dirname, "../src/locales")).filter((file) => file.match(/(.js|.ts)$/))) {
  const locale: Locale = require(path.resolve(__dirname, `../src/locales/${file}`)).default;
  locales.set(locale.locale.code, locale);
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

const app: express.Application = express();

app.use(
  cors({
    origin: "http://example.com",
    optionsSuccessStatus: 200,
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());

app.set("trust proxy", true);
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

app.get("/guild/:guild", (req, res) => {
  res.json(client.guilds.cache.get(req.params.guild).roles);
});

app.listen(80, () => {
  Log.i(`Listening on http://localhost`);
});

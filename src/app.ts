import axios from "axios";
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
import { APIGuild, Command, Locale, State, UserRole } from "./";
import firestore from "./modules/firestore";

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

app.use(cors());
app.use(helmet());
app.use(morgan("short"));
app.use(compression());

app.set("trust proxy", true);
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

app.post("/fetch", async (req, res) => {
  try {
    const payload = {
      user: (await axios.get("https://discord.com/api/v8/users/@me", { headers: { Authorization: `Bearer ${req.body.token}` } })).data,
      guilds: [],
    };
    const guilds: APIGuild[] = (await axios.get("https://discord.com/api/v8/users/@me/guilds", { headers: { Authorization: `Bearer ${req.body.token}` } })).data;
    for (const collection of await firestore.listCollections()) {
      const guild: APIGuild = guilds.find((guild: APIGuild) => guild.id === collection.id);
      if (!guild) continue;
      payload.guilds.push(guild);
    }
    res.send(payload);
  } catch (err) {
    Log.e(err);
    res.sendStatus(400);
  }
});

app.post("/roles", async (req, res) => {
  try {
    const payload = [];
    const member = client.guilds.cache.get(req.body.guild).members.cache.get(req.body.member);
    const memberRolesCache = member.roles.cache;
    const userRoles: UserRole[] = (await firestore.collection(req.body.guild).doc("config").get()).data().userRoles;
    if (!member || !userRoles) return res.sendStatus(400);

    for (const userRole of userRoles) {
      if (memberRolesCache.has(userRole.id)) payload.push(userRole.id);
    }
    res.json(payload);
  } catch (err) {
    Log.e(err);
    res.sendStatus(400);
  }
});

app.put("/roles", async (req, res) => {
  try {
    const member = client.guilds.cache.get(req.body.guild).members.cache.get(req.body.member);
    if (!member) return res.sendStatus(400);

    // Roles Validate
    if (req.body.roles)
      for (const roleID of req.body.roles) {
        if (!client.guilds.cache.get(req.body.guild).roles.cache.has(roleID)) return res.sendStatus(400);
      }

    const memberRole = member.roles;
    for (const userRole of (await firestore.collection(req.body.guild).doc("config").get()).data().userRoles) {
      const idx = req.body.roles.findIndex((roleID) => roleID === userRole.id);
      if (idx !== -1) {
        if (!memberRole.cache.has(userRole.id)) await memberRole.add(userRole.id);
      } else {
        if (memberRole.cache.has(userRole.id)) await memberRole.remove(userRole.id);
      }
    }
    res.sendStatus(200);
  } catch (err) {
    Log.e(err);
    res.sendStatus(400);
  }
});

app.listen(process.env.HTTP_PORT || 14003, () => {
  Log.i(`Listening on http://${process.env.HTTP_HOST || "localhost"}:${process.env.HTTP_PORT || 14003}`);
});

import axios from "axios";
import { readdirSync } from "fs";
import { resolve } from "path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import { Client, Collection } from "discord.js";
import { log } from "./modules/logger";
import props from "./props";
import "dotenv/config";
import { APIGuild, APIUserRole, Command, Locale, State, UserRole } from "./";
import { firestore } from "./modules/firebase";

export const prefix: string = process.env.PREFIX || props.bot.prefix;
export const client: Client = new Client();
export const locales: Collection<string, Locale> = new Collection();
export const states: Collection<string, State> = new Collection();
export const commands: Collection<string, Command> = new Collection();
export const commands_manager: Collection<string, Command> = new Collection();
// export const commands_hidden: Collection<string, Command> = new Collection();

for (const file of readdirSync(resolve(__dirname, "./locales")).filter((file) => file.match(/(.js|.ts)$/))) {
  const locale: Locale = require(resolve(__dirname, `./locales/${file}`)).default;
  locales.set(locale.locale.code, locale);
}

for (const file of readdirSync(resolve(__dirname, "./commands")).filter((file) => file.match(/(.js|.ts)$/))) {
  const command: Command = require(resolve(__dirname, `./commands/${file}`)).default;
  commands.set(command.name, command);
}

for (const file of readdirSync(resolve(__dirname, "./commands_manager")).filter((file) => file.match(/(.js|.ts)$/))) {
  const command: Command = require(resolve(__dirname, `./commands_manager/${file}`)).default;
  commands_manager.set(command.name, command);
}

// for (const file of readdirSync(resolve(__dirname, "./commands_hidden")).filter((file) => file.match(/(.js|.ts)$/))) {
//   const command: Command = require(resolve(__dirname, `./commands_hidden/${file}`)).default;
//   commands_hidden.set(command.name, command);
// }

for (const file of readdirSync(resolve(__dirname, "./events")).filter((file) => file.match(/(.js|.ts)$/))) {
  require(resolve(__dirname, `./events/${file}`));
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
    log.e(err);
    res.sendStatus(400);
  }
});

app.post("/roles", async (req, res) => {
  try {
    const payload = [];
    const member = client.guilds.cache.get(req.body.guild).members.cache.get(req.body.member);
    const memberRolesCache = member.roles.cache;
    const userRoles: UserRole[] = (await firestore.collection(req.body.guild).doc("config").get()).data().userRoles;
    if (!member || !userRoles) return res.sendStatus(404);

    for (const userRole of userRoles) {
      if (memberRolesCache.has(userRole.id)) payload.push(userRole.id);
    }
    res.json(payload);
  } catch (err) {
    log.e(err);
    res.sendStatus(400);
  }
});

app.put("/roles", async (req, res) => {
  try {
    const member = client.guilds.cache.get(req.body.guild).members.cache.get(req.body.member);
    const memberRole = member.roles;

    if (!member || !req.body.roles) return res.sendStatus(404);

    const userRoles: APIUserRole[] = (await firestore.collection(req.body.guild).doc("config").get()).data().userRoles;

    for (const roleID of req.body.roles) {
      if (!client.guilds.cache.get(req.body.guild).roles.cache.has(roleID) || userRoles.findIndex((userRole: APIUserRole) => userRole.id === roleID) === -1) return res.sendStatus(404);
    }

    for (const userRole of userRoles) {
      const idx = req.body.roles.findIndex((roleID) => roleID === userRole.id);
      if (idx !== -1) {
        if (!memberRole.cache.has(userRole.id)) await memberRole.add(userRole.id, "[Dashboard] Role Update");
      } else {
        if (memberRole.cache.has(userRole.id)) await memberRole.remove(userRole.id, "[Dashboard] Role Update");
      }
    }
    res.sendStatus(200);
  } catch (err) {
    log.e(err);
    res.sendStatus(400);
  }
});

app.listen(process.env.HTTP_PORT || 20002, () => {
  log.i(`Listening on http://${process.env.HTTP_HOST || "localhost"}:${process.env.HTTP_PORT || 20002}`);
});

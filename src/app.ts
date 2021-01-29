import axios from "axios";
import { readdirSync } from "fs";
import { resolve } from "path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import { Client, Collection, GuildMember } from "discord.js";
import { log } from "./modules/logger";
import props from "./props";
import "dotenv/config";
import { APIGuild, APIGuildMember, APIUser, Command, Locale, State, UserRole } from "./";

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

const fetchGuildMember = (guildID: string, memberID: string): APIGuildMember => {
  const _roles: string[] = [];

  const member = client.guilds.cache.get(guildID).member(memberID);
  for (const userRole of states.get(guildID).userRoles) {
    if (member.roles.cache.has(userRole.id)) _roles.push(userRole.id);
  }

  return {
    displayName: member.displayName,
    displayHexColor: member.displayHexColor,
    presence: {
      activities: member.user.presence.activities,
      status: member.user.presence.status,
    },
    roles: _roles,
  };
};

app.post("/fetch", async (req, res) => {
  try {
    const payload: { user: APIUser; guilds: APIGuild[] } = {
      user: (await axios.get("https://discord.com/api/v8/users/@me", { headers: { Authorization: `Bearer ${req.body.token}` } })).data,
      guilds: [],
    };
    const guilds: APIGuild[] = (await axios.get("https://discord.com/api/v8/users/@me/guilds", { headers: { Authorization: `Bearer ${req.body.token}` } })).data;
    for (const [guildID, state] of states) {
      const guild: APIGuild = guilds.find((guild: APIGuild) => guild.id === guildID);
      if (!guild) continue;

      payload.guilds.push({
        ...guild,
        member: fetchGuildMember(guildID, payload.user.id),
        userRoles: states.get(guildID).userRoles,
      });
    }
    res.send(payload);
  } catch (err) {
    log.e(err);
    res.sendStatus(400);
  }
});

app.post("/guild", async (req, res) => {
  try {
    if (!states.get(req.body.guild) || !client.guilds.cache.get(req.body.guild).member(req.body.member)) return;

    res.json({
      member: fetchGuildMember(req.body.guild, req.body.member),
      userRoles: states.get(req.body.guild).userRoles,
    });
  } catch (err) {
    log.e(err);
    res.sendStatus(400);
  }
});

app.put("/roles", async (req, res) => {
  try {
    const member: GuildMember = client.guilds.cache.get(req.body.guild).member(req.body.member);

    if (!member || !req.body.roles) return res.sendStatus(404);

    for (const roleID of req.body.roles) {
      if (!client.guilds.cache.get(req.body.guild).roles.cache.has(roleID) || states.get(req.body.guild).userRoles.findIndex((userRole: UserRole) => userRole.id === roleID) === -1)
        return res.sendStatus(404);
    }

    for (const userRole of states.get(req.body.guild).userRoles) {
      const idx = req.body.roles.findIndex((roleID) => roleID === userRole.id);
      if (idx !== -1) {
        if (!member.roles.cache.has(userRole.id)) await member.roles.add(userRole.id, "[Dashboard] Role Update");
      } else {
        if (member.roles.cache.has(userRole.id)) await member.roles.remove(userRole.id, "[Dashboard] Role Update");
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

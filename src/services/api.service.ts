import { client, states } from '@/app';
import { log } from '@/modules/logger';
import { APIGuild, APIGuildMember, APIUser, UserRole } from '@/types';
import axios from 'axios';
import compression from 'compression';
import cors from 'cors';
import { GuildMember } from 'discord.js';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

const app: express.Application = express();

app.use(cors());
app.use(helmet());
app.use(morgan('short'));
app.use(compression());

app.set('trust proxy', true);
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

const fetchGuildMember = (guildID: string, memberID: string): APIGuildMember => {
  const _roles: string[] = [];

  const member = client.guilds.resolve(guildID).members.resolve(memberID);
  for (const userRole of states.get(guildID).userRoles) {
    if (member.roles.cache.has(userRole.id)) _roles.push(userRole.id);
  }

  return {
    displayName: member.displayName,
    displayHexColor: member.displayHexColor,
    presence: {
      activities: member.presence.activities,
      status: member.presence.status,
    },
    roles: _roles,
  };
};

app.post('/fetch', async (req, res) => {
  try {
    if (!req.body.token) return res.sendStatus(401);

    const payload: { user: APIUser; guilds: APIGuild[] } = {
      user: (
        await axios.get('https://discord.com/api/v8/users/@me', {
          headers: { Authorization: `Bearer ${req.body.token}` },
        })
      ).data,
      guilds: [],
    };
    const guilds: APIGuild[] = (
      await axios.get('https://discord.com/api/v8/users/@me/guilds', {
        headers: { Authorization: `Bearer ${req.body.token}` },
      })
    ).data;
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
    // createError('Dashboard > Fetch', err);
    res.sendStatus(400);
  }
});

app.post('/guild', async (req, res) => {
  try {
    if (!req.body.token) return res.sendStatus(401);

    if (
      !states.get(req.body.guild) ||
      !client.guilds.resolve(req.body.guild).members.resolve(req.body.member)
    )
      return;

    res.json({
      member: fetchGuildMember(req.body.guild, req.body.member),
      userRoles: states.get(req.body.guild).userRoles,
    });
  } catch (err) {
    // createError('Dashboard > Guild', err);
    res.sendStatus(400);
  }
});

app.put('/roles', async (req, res) => {
  try {
    if (!req.body.token) return res.sendStatus(401);

    const member: GuildMember = client.guilds
      .resolve(req.body.guild)
      .members.resolve(req.body.member);

    if (!member || !req.body.roles) return res.sendStatus(404);

    for (const roleID of req.body.roles) {
      if (
        !client.guilds.resolve(req.body.guild).roles.cache.has(roleID) ||
        states
          .get(req.body.guild)
          .userRoles.findIndex((userRole: UserRole) => userRole.id === roleID) === -1
      )
        return res.sendStatus(404);
    }

    for (const userRole of states.get(req.body.guild).userRoles) {
      const idx = req.body.roles.findIndex(roleID => roleID === userRole.id);
      if (idx !== -1) {
        if (!member.roles.cache.has(userRole.id))
          await member.roles.add(userRole.id, '[Dashboard] Role Update');
      } else {
        if (member.roles.cache.has(userRole.id))
          await member.roles.remove(userRole.id, '[Dashboard] Role Update');
      }
    }
    res.sendStatus(200);
  } catch (err) {
    // createError('Dashboard > Roles', err);
    res.sendStatus(400);
  }
});

app.listen(process.env.HTTP_PORT || 20002, () => {
  log.i(
    `Listening on http://${process.env.HTTP_HOST || 'localhost'}:${process.env.HTTP_PORT || 20002}`
  );
});

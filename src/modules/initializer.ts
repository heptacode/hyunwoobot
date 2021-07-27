import axios from "axios";
import { Collection } from "discord.js";
import { createError } from "./createError";
import { firestore } from "./firebase";
import { log } from "./logger";
import { client, commands, commands_manager, locales, states } from "../app";
import { Command, Config, State } from "../";

export const setConfig = async (guildID: string) => {
  try {
    const configDocRef = firestore.collection(guildID).doc("config");
    if ((await configDocRef.get()).exists) return;

    await configDocRef.create({
      afkTimeout: -1,
      alarmChannel: null,
      autoRoles: [],
      locale: "ko",
      logChannel: null,
      logMessageEvents: false,
      privateRoom: { generator: null, fallback: null },
      privateRooms: [],
      reactionRoles: [],
      userRoles: [],
      voiceRoles: [],
    } as Config);
  } catch (err) {
    createError("Initializer > Config", err, { guild: guildID });
  }
};

export const setState = (guildID: string, config?: Config) => {
  states.set(guildID, {
    afkChannel: new Collection(),
    afkTimeout: config ? config.afkTimeout : -1,
    alarmChannel: config ? config.alarmChannel : null,
    autoRoles: config ? config.autoRoles : [],
    locale: config ? locales.get(config.locale) : locales.get("ko"),
    logChannel: config ? config.logChannel : null,
    logMessageEvents: config ? config.logMessageEvents : false,
    mentionDebounce: null,
    privateRoom: config ? config.privateRoom : undefined,
    privateRooms: config ? config.privateRooms : [],
    reactionRoles: config ? config.reactionRoles : [],
    userRoles: config ? config.userRoles : [],
    voiceRoles: config ? config.voiceRoles : [],

    connection: null,
    queue: [],
    isLooped: false,
    isRepeated: false,
    isPlaying: false,
    volume: 3,
  } as State);
};

export const registerCommands = async (guildID: string, force?: boolean) => {
  const commandsDocRef = firestore.collection(guildID).doc("commands");
  const commandsDocSnapshot = await commandsDocRef.get();

  if (!commandsDocSnapshot.exists) await commandsDocRef.create({});

  const registeredCommands: { [key: string]: Command } = commandsDocSnapshot.exists ? commandsDocSnapshot.data() : {};
  const updatedCommands: { [key: string]: Command } = {};

  for (const [name, command] of commands) {
    try {
      if (((registeredCommands[name] && registeredCommands[name].version >= command.version) || command.messageOnly) && !force) continue;
      updatedCommands[name] = {
        id: (
          await (client as any).api
            .applications(process.env.APPLICATION)
            .guilds(guildID)
            .commands.post({
              data: {
                name: name,
                description: states.get(guildID).locale.help[name],
                options: command.options ? command.options(states.get(guildID).locale) : [],
              },
            })
        ).id,
        name: name,
        version: command.version,
      };
    } catch (err) {
      createError(`Initializer > CommandRegister > [${name}]`, err, { guild: guildID });
    }
  }

  for (const [name, command] of commands_manager) {
    try {
      if (((registeredCommands[name] && registeredCommands[name].version >= command.version) || command.messageOnly) && !force) continue;
      updatedCommands[name] = {
        id: (
          await (client as any).api
            .applications(process.env.APPLICATION)
            .guilds(guildID)
            .commands.post({
              data: {
                name: name,
                description: `${states.get(guildID).locale.manager} ${states.get(guildID).locale.help[name]}`,
                options: command.options ? command.options(states.get(guildID).locale) : [],
              },
            })
        ).id,
        name: name,
        version: command.version,
      };
    } catch (err) {
      createError(`Initializer > CommandRegister > Manager > [${name}]`, err, { guild: guildID });
    }
  }

  if (Object.keys(updatedCommands).length) {
    log.s(`Registered ${Object.keys(updatedCommands).length} command(s) for guild [ ${client.guilds.resolve(guildID).name}(${guildID}) ]: ${Object.keys(updatedCommands).join(", ")}`);
    await commandsDocRef.update(updatedCommands);
  }
};

export const setGuild = async (guildID: string) => {
  try {
    await firestore
      .collection(guildID)
      .doc("guild")
      .set(JSON.parse(JSON.stringify(client.guilds.resolve(guildID))));
  } catch (err) {
    log.e(`SetGuild > ${err}`);
  }
};

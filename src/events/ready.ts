import { Collection, Guild, TextChannel } from "discord.js";
import { firestore } from "../modules/firebase";
import { log } from "../modules/logger";
import { client, commands, commands_manager, locales, states } from "../app";
import { Command, Config, State } from "../";
import locale from "../commands_manager/locale";

client.once("ready", async () => {
  try {
    for (const collection of await firestore.listCollections()) {
      const guild: Guild = client.guilds.cache.get(collection.id);
      if (!guild) {
        log.d(`Skipping Initialize for guild [ ${(await collection.doc("server").get()).data().name} | ${collection.id} ]`);
        continue;
      }

      firestore
        .collection(guild.id)
        .doc("config")
        .onSnapshot(
          async (docSnapshot) => {
            const config: Config = docSnapshot.data() as Config;
            if (!states.has(guild.id)) {
              log.d(`LocalDB Initialize for guild [ ${guild.name} ]`);

              states.set(guild.id, {
                afkChannel: new Collection(),
                afkTimeout: config.afkTimeout,
                alarmChannel: config.alarmChannel,
                autoRoles: config.autoRoles,
                locale: locales.get(config.locale),
                logChannel: config.logChannel,
                logMessageEvents: config.logMessageEvents,
                privateRoom: config.privateRoom,
                privateRooms: config.privateRooms,
                reactionRoles: config.reactionRoles,
                timeout: null,
                userRoles: config.userRoles,
                voiceRoles: config.voiceRoles,

                textChannel: null,
                voiceChannel: null,
                connection: null,
                queue: [],
                isLooped: false,
                isRepeated: false,
                isPlaying: false,
                volume: 1,
              } as State);

              for (const reactionRole of config.reactionRoles) {
                await (guild.channels.cache.get(reactionRole.textChannel) as TextChannel).messages.fetch({ limit: 100 });
              }

              const commandsDocRef = collection.doc("commands");
              const registeredCommands = (await commandsDocRef.get()).data();
              const updatedCommands: { [key: string]: Command } = {};

              for (const [name, command] of commands) {
                try {
                  if (registeredCommands[name] && registeredCommands[name].version >= command.version) continue;
                  updatedCommands[name] = {
                    id: (
                      await (client as any).api
                        .applications(process.env.APPLICATION)
                        .guilds(guild.id)
                        .commands.post({
                          data: {
                            name: name,
                            description: states.get(guild.id).locale.help[name],
                            options: command.options ? command.options(states.get(guild.id).locale) : [],
                          },
                        })
                    ).id,
                    name: name,
                    version: command.version,
                  };
                } catch (err) {
                  log.e(`CommandRegister > ${err}`);
                }
              }

              for (const [name, command] of commands_manager) {
                try {
                  if ((registeredCommands[name] && registeredCommands[name].version >= command.version) || command.messageOnly) continue;
                  updatedCommands[name] = {
                    id: (
                      await (client as any).api
                        .applications(process.env.APPLICATION)
                        .guilds(guild.id)
                        .commands.post({
                          data: {
                            name: name,
                            description: `${states.get(guild.id).locale.manager} ${states.get(guild.id).locale.help[name]}`,
                            options: command.options ? command.options(states.get(guild.id).locale) : [],
                          },
                        })
                    ).id,
                    name: name,
                    version: command.version,
                  };
                } catch (err) {
                  log.e(`CommandRegister > Manager > ${err}`);
                }
              }

              if (Object.keys(updatedCommands).length) {
                log.s(`Updated ${Object.keys(updatedCommands).length} command(s) for guild [ ${guild.name} ]: ${Object.keys(updatedCommands).join(", ")}`);
                await commandsDocRef.update(updatedCommands);
              }
            } else {
              states.get(guild.id).afkTimeout = config.afkTimeout;
              states.get(guild.id).alarmChannel = config.alarmChannel;
              states.get(guild.id).autoRoles = config.autoRoles;
              states.get(guild.id).locale = locales.get(config.locale);
              states.get(guild.id).logChannel = config.logChannel;
              states.get(guild.id).logMessageEvents = config.logMessageEvents;
              states.get(guild.id).privateRoom = config.privateRoom;
              states.get(guild.id).privateRooms = config.privateRooms;
              states.get(guild.id).reactionRoles = config.reactionRoles;
              states.get(guild.id).userRoles = config.userRoles;
              states.get(guild.id).voiceRoles = config.voiceRoles;
            }
          },
          (err) => {
            console.log(`Firestore > DocumentUpdate > ${err}`);
          }
        );
    }

    await client.user.setPresence(
      process.env.NODE_ENV !== "production"
        ? {
            status: "dnd",
            activity: {
              type: "WATCHING",
              name: "Visual Studio Code",
            },
          }
        : { status: "online", activity: { type: "WATCHING", name: "/help" } }
    );
  } catch (err) {
    log.e(`Initialize > ${err}`);
  }

  log.i(`Login w/ ${client.user.tag}`);
});

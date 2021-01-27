import { Collection, Guild, TextChannel } from "discord.js";
import { firestore } from "../modules/firebase";
import { log } from "../modules/logger";
import { client, commands, commands_manager, locales, states } from "../app";
import { Config, State } from "../";

client.once("ready", async () => {
  try {
    for (const collection of await firestore.listCollections()) {
      const guild: Guild = client.guilds.cache.get(collection.id);
      if (!guild) {
        log.d(`Skipping Initialize for guild [ ${(await collection.doc("server").get()).data().name} | ${collection.id} ]`);
        continue;
      }

      const config: Config = (await collection.doc("config").get()).data() as Config;

      states.set(guild.id, {
        afkChannel: new Collection(),
        alarmChannel: config.alarmChannel,
        locale: locales.get(config.locale),
        textChannel: null,
        voiceChannel: null,
        connection: null,
        queue: [],
        isLooped: false,
        isRepeated: false,
        isPlaying: false,
        volume: 1,
        timeout: null,
      } as State);

      log.d(`LocalDB Initialize for guild [ ${guild.name} ]`);

      for (const doc of (await collection.get()).docs) {
        if (!["server", "config", "commands"].includes(doc.id)) ((await guild.channels.cache.get(doc.id)) as TextChannel).messages.fetch({ limit: 100 });
      }

      const commandsDocRef = collection.doc("commands");
      const registeredCommands = (await commandsDocRef.get()).data();
      const updatedCommands: any = {};

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

  log.i(`Ready! ${client.user.tag}`);
});

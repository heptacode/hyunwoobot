import { Collection, Guild, TextChannel } from "discord.js";
import firestore from "../modules/firestore";
import { client, commands, commands_manager, locales, state } from "../app";
import { Command, State } from "../";
import Log from "../modules/logger";

export default () => {
  client.once("ready", async () => {
    try {
      for (const collection of await firestore.listCollections()) {
        const guild: Guild = client.guilds.cache.get(collection.id);
        if (!guild) {
          Log.d(`Skipping Initialize for guild [ ${(await collection.doc("server").get()).data().name} | ${collection.id} ]`);
          continue;
        }

        state.set(guild.id, {
          locale: locales.get(await (await collection.doc("config").get()).data().locale),
          textChannel: null,
          voiceChannel: null,
          connection: null,
          playlist: [],
          isLooped: false,
          isRepeated: false,
          isPlaying: false,
          volume: 2,
          timeout: null,
          afkChannel: new Collection(),
        } as State);

        Log.d(`LocalDB Initialize for guild [ ${guild.name} | ${guild.id} ]`);

        for (const doc of (await collection.get()).docs) {
          if (!["server", "config", "commands"].includes(doc.id)) ((await guild.channels.cache.get(doc.id)) as TextChannel).messages.fetch({ limit: 100 });
        }

        const commandsDocRef = collection.doc("commands");
        const registeredCommands = (await commandsDocRef.get()).data();
        const updatedCommands: { id: string; name: string; version: number }[] = [];

        for (const [name, command] of commands) {
          try {
            if (registeredCommands[name] && registeredCommands[name].version >= command.version) continue;
            console.dir(name);
            updatedCommands.push({
              id: (
                await (client as any).api
                  .applications(process.env.APPLICATION)
                  .guilds(guild.id)
                  .commands.post({
                    data: {
                      name: name,
                      description: state.get(guild.id).locale.help[name],
                      options: command.options ? command.options(state.get(guild.id).locale) : [],
                    },
                  })
              ).id,
              name: name,
              version: command.version,
            });
          } catch (err) {
            Log.e(`CommandRegister > ${err}`);
          }
        }

        for (const [name, command] of commands_manager) {
          try {
            if (registeredCommands[name] && registeredCommands[name].version >= command.version) continue;
            console.dir(name);
            updatedCommands.push({
              id: (
                await (client as any).api
                  .applications(process.env.APPLICATION)
                  .guilds(guild.id)
                  .commands.post({
                    data: {
                      name: name,
                      description: `${state.get(guild.id).locale.manager} ${state.get(guild.id).locale.help[name]}`,
                      options: command.options ? command.options(state.get(guild.id).locale) : [],
                    },
                  })
              ).id,
              name: name,
              version: command.version,
            });
          } catch (err) {
            Log.e(`CommandRegister > Manager > ${err}`);
          }
        }

        if (updatedCommands.length) {
          const payload: any = {};
          for (const command of updatedCommands) {
            payload[command.name] = { id: command.id, name: command.name, version: command.version };
          }
          await commandsDocRef.update(payload);
        }
      }

      await client.user.setActivity({
        type: "WATCHING",
        // name: `${prefix}help`,
        name: "/help",
      });

      await client.user.setStatus("online");
      // await client.user.setStatus("dnd");
    } catch (err) {
      Log.e(`Initialize > ${err}`);
    }

    Log.i(`Ready! ${client.user.tag}`);
  });
};

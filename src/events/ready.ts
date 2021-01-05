import { Guild, TextChannel } from "discord.js";
import firestore from "../modules/firestore";
import { client, locales, prefix, state } from "../app";
import { State } from "../";
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
        } as State);

        Log.d(`LocalDB Initialize for guild [ ${guild.name} | ${guild.id} ]`);

        for (const doc of (await collection.get()).docs) {
          if (!["server", "config"].includes(doc.id)) ((await guild.channels.cache.get(doc.id)) as TextChannel).messages.fetch({ limit: 100 });
        }
      }

      await client.user.setActivity({
        type: "WATCHING",
        name: `${prefix}help`,
      });

      await client.user.setStatus("online");
      // await client.user.setStatus("dnd");
    } catch (err) {
      Log.e(`Initialize > ${err}`);
    }

    Log.i(`Ready! ${client.user.tag}`);
  });
};

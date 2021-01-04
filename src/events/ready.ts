import { Guild, TextChannel } from "discord.js";
import firestore from "../modules/firestore";
import { prefix, client } from "../app";
import Log from "../modules/logger";

export default () => {
  client.once("ready", async () => {
    await client.user.setStatus("online");
    // await client.user.setStatus("dnd");

    await client.user.setActivity({
      type: "WATCHING",
      name: `${prefix}help`,
    });

    try {
      for (const collection of await firestore.listCollections()) {
        const guild: Guild = client.guilds.cache.find((guild) => guild.id == collection.id);
        if (!guild) continue;

        (await firestore.collection(collection.id).get()).docs.map(async (doc) => {
          try {
            if (!["server", "config"].includes(doc.id)) ((await guild.channels.cache.get(doc.id)) as TextChannel).messages.fetch({ limit: 100 });
          } catch (err) {
            Log.e(`Fetch > 2 > ${err}`);
          }
        });
      }
    } catch (err) {
      Log.e(`Fetch > 1 > ${err}`);
    }

    Log.i(`Ready! ${client.user.tag}`);
  });
};

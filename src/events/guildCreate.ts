import { Guild } from "discord.js";
import firestore from "../modules/firestore";
import { client } from "../app";
import { Config } from "../";
import Log from "../modules/logger";

export default () => {
  client.on("guildCreate", async (guild: Guild) => {
    Log.d(`Joined new guild: ${guild.name}`);

    const serverDocRef = firestore.collection(guild.id).doc("server");
    const serverDocSnapshot = await serverDocRef.get();

    const configDocRef = firestore.collection(guild.id).doc("config");
    const configDocSnapshot = await configDocRef.get();

    if (!configDocSnapshot.exists || !serverDocSnapshot.exists) {
      Log.d(`Firestore Initialize for guild [ ${guild.name} | ${guild.id} ]`);
      try {
        await serverDocRef.set(JSON.parse(JSON.stringify(guild)));
        await configDocRef.set({ autorole: [], locale: "ko", log: "", privateRoom: "", privateRooms: [], voice: [] } as Config);
      } catch (err) {
        Log.e(`Firestore Initialize > ${err}`);
      }
    }
  });
};

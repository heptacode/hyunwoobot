import { Guild } from "discord.js";
import firestore from "../modules/firestore";
import Log from "../modules/logger";
import { client } from "../app";
import { Config } from "../";

export default () => {
  client.on("guildCreate", async (guild: Guild) => {
    await firestore
      .collection(guild.id)
      .doc("server")
      .set(JSON.parse(JSON.stringify(guild)));

    await firestore.collection(guild.id).doc("commands").set({});

    const configDocRef = firestore.collection(guild.id).doc("config");
    const configDocSnapshot = await configDocRef.get();

    if (!configDocSnapshot.exists) {
      try {
        await configDocRef.set({ afkTimeout: -1, autorole: [], locale: "ko", log: "", logMessageEvents: false, privateRoom: "", privateRooms: [], voiceRole: [] } as Config);
        Log.d(`Firestore Initialize for guild [ ${guild.name} | ${guild.id} ]`);
      } catch (err) {
        Log.e(`Firestore Initialize > ${err}`);
      }
    }
  });
};

import { Guild } from "discord.js";
import firestore from "../modules/firestore";
import { client } from "../app";
import { Config } from "../";
import Log from "../modules/logger";

export default () => {
  client.on("guildCreate", async (guild: Guild) => {
    Log.d(`Joined new guild: ${guild.name}`);

    await firestore
      .collection(guild.id)
      .doc("server")
      .set(JSON.parse(JSON.stringify(guild)));

    const configDocRef = firestore.collection(guild.id).doc("config");
    const configDocSnapshot = await configDocRef.get();

    if (!configDocSnapshot.exists) {
      Log.d(`Firestore Initialize for guild [ ${guild.name} | ${guild.id} ]`);
      try {
        await configDocRef.set({ autorole: [], locale: "ko", log: "", privateRoom: "", privateRooms: [], voiceRole: [] } as Config);
      } catch (err) {
        Log.e(`Firestore Initialize > ${err}`);
      }
    }
  });
};

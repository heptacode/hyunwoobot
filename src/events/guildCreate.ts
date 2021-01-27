import { Guild } from "discord.js";
import { firestore } from "../modules/firebase";
import { log } from "../modules/logger";
import { client } from "../app";
import { Config } from "../";

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
      await configDocRef.set({
        afkTimeout: -1,
        alarmChannel: null,
        autorole: [],
        locale: "ko",
        log: "",
        logMessageEvents: false,
        privateRoom: "",
        privateRooms: [],
        userRoles: [],
        voiceRole: [],
      } as Config);
      log.d(`Firestore Initialize for guild [ ${guild.name} | ${guild.id} ]`);
    } catch (err) {
      log.e(`Firestore Initialize > ${err}`);
    }
  }
});

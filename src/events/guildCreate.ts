import { Guild } from "discord.js";
import { firestore } from "../modules/firebase";
import { log } from "../modules/logger";
import { client } from "../app";
import { Config } from "../";

client.on("guildCreate", async (guild: Guild) => {
  try {
    await firestore
      .collection(guild.id)
      .doc("config")
      .create({
        afkTimeout: -1,
        alarmChannel: null,
        autoRoles: [],
        locale: "ko",
        logChannel: "",
        logMessageEvents: false,
        privateRoom: { generator: null, fallback: null },
        privateRooms: [],
        reactionRoles: [],
        userRoles: [],
        voiceRoles: [],
      } as Config);

    await firestore
      .collection(guild.id)
      .doc("server")
      .set(JSON.parse(JSON.stringify(guild)));

    await firestore.collection(guild.id).doc("commands").create({});

    log.d(`Firestore Initialize for guild [ ${guild.name} | ${guild.id} ]`);
  } catch (err) {
    log.e(`Firestore Initialize > ${err}`);
  }
});

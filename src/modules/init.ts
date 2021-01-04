import { Guild } from "discord.js";
import firestore from "../modules/firestore";
import { Config, State } from "../";
import { state, locales } from "../app";
import Log from "../modules/logger";

export const init = async (guild: Guild) => {
  if (!state.get(guild.id)) {
    const serverDocRef = firestore.collection(guild.id).doc("server");
    const serverDocSnapshot = await serverDocRef.get();

    const configDocRef = firestore.collection(guild.id).doc("config");
    const configDocSnapshot = await configDocRef.get();

    if (!configDocSnapshot.exists || !serverDocSnapshot.exists) {
      Log.d(`Firestore Initialize for guild [ ${guild.name} | ${guild.id} ]`);
      try {
        await configDocRef.set({ autorole: [], locale: "ko", log: "", privateRoom: "", privateRooms: [], voice: [] } as Config);
        await serverDocRef.set(JSON.parse(JSON.stringify(guild)));
      } catch (err) {
        Log.e(`Firestore Initialize > ${err}`);
      }
    }

    state.set(guild.id, {
      locale: locales.get(await configDocSnapshot.data().locale),
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
  }
};

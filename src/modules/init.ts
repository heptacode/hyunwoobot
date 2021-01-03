import { Guild } from "discord.js";
import firestore from "../modules/firestore";
import { State } from "../";
import { state, locales } from "../app";
import Log from "../modules/logger";

export const init = async (guild: Guild) => {
  if (!state.get(guild.id)) {
    Log.d(`LocalDB Initialize for guild [ ${guild.name} | ${guild.id} ]`);
    state.set(guild.id, {
      locale: null,
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
  }

  const serverDocRef = firestore.collection(guild.id).doc("server");
  const serverDocSnapshot = await serverDocRef.get();

  const configDocRef = firestore.collection(guild.id).doc("config");
  let configDocSnapshot = await configDocRef.get();

  if (!configDocSnapshot.exists || !serverDocSnapshot.exists) {
    Log.d(`Firestore Initialize for guild [ ${guild.name} | ${guild.id} ]`);
    try {
      await configDocRef.set({ autorole: [], locale: "ko", log: "", voice: [] });
      await serverDocRef.set(JSON.parse(JSON.stringify(guild)));
      configDocSnapshot = await configDocRef.get();
    } catch (err) {
      Log.e(`Firestore Initialize > ${err}`);
    }
  }

  state.get(guild.id).locale = locales.get(await configDocSnapshot.data().locale);
};

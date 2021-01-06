import { Message } from "discord.js";
import { Args, Locale, State } from "../";
import Log from "../modules/logger";

export default {
  name: "debug",
  execute(locale: Locale, state: State, message: Message, args: Args) {
    try {
      // let docSnapshot = await docRef.get();
      // Log.v("------------------------------------------------------------------------------------");
      // Log.d(`TextChannel : ${JSON.stringify(docSnapshot.data().textChannel)}`);
      // Log.d(`VoiceChannel : ${JSON.stringify(docSnapshot.data().voiceChannel)}`);
      // Log.d(`Playlist : ${JSON.stringify(docSnapshot.data().playlist)}`);
      // Log.d(`IsPlaying : ${docSnapshot.data().isPlaying}`);
      // Log.d(`Volume : ${docSnapshot.data().volume}`);
      // Log.v("------------------------------------------------------------------------------------");
      // Log.d(JSON.stringify(message));
      Log.v("------------------------------------------------------------------------------------");
    } catch (err) {
      Log.e(`Debug > 1 > ${err}`);
    }
  },
};

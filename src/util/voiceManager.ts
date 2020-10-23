import Log from "./logger";

export const voiceConnect = async (locale, dbRef, docRef, message) => {
  try {
    let textChannel = message.channel;
    let voiceChannel = message.member.voice.channel;
    // Not in voice channel
    if (!voiceChannel) return message.channel.send(`${locale.joinToConnect}`);

    let permissions = voiceChannel.permissionsFor(message.client.user);
    // Insufficient perms
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) return message.channel.send(`${locale.insufficientPerms}`);

    let docSnapshot = await docRef.get();
    // Init if doc not exists
    if (!docSnapshot.exists) {
      await docRef.set({
        textChannel: textChannel.id,
        voiceChannel: voiceChannel.id,
        playlist: [],
        isLooped: false,
        isRepeated: false,
        volume: 5,
      });
    }

    try {
      let connection = await voiceChannel.join();
      dbRef.connection = connection;
      dbRef.voiceChannel = voiceChannel;
      Log.i("VoiceConnect");
    } catch (err) {
      Log.e(`VoiceConnect > 2 > ${err}`);
      // return message.channel.send(`${locale.err_task}`);
    }
  } catch (err) {
    Log.e(`VoiceConnect > 1 > ${err}`);
    return message.channel.send(`${locale.err_task}`);
  }
};

export const voiceDisconnect = async (locale, dbRef, docRef, message, timeout?) => {
  let result = await docRef.delete();
  if (result) {
    try {
      dbRef.voiceChannel.leave();
      Log.i(`VoiceDisconnect${timeout ? " : Timeout" : ""}`);
      message.channel.send(`${timeout ? locale.disconnectTimeout : locale.leave}`);
    } catch (err) {
      Log.w(`VoiceDisconnect > Not in Voice Channel`);
      message.channel.send(`${locale.notInVoiceChannel}`);
    }
  } else {
    Log.e(`VoiceDisconnect > 1 > ${result}`);
    message.channel.send(`${locale.err_cmd}`);
  }
};

import { Message } from "discord.js";
import { AlarmDB, Locale, State } from "../";
import Log from "./logger";

export const voiceConnect = async (locale: Locale, state: State, message: Message) => {
  const voiceChannel = message.member.voice.channel;
  const permissions = voiceChannel.permissionsFor(message.client.user);
  try {
    // Not in voice channel
    if (!voiceChannel) return message.channel.send(locale.joinToConnect);
    // Insufficient perms
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) return message.channel.send(locale.insufficientPerms_connect);

    try {
      const connection = await voiceChannel.join();
      state.connection = connection;
      state.voiceChannel = voiceChannel;

      Log.d("VoiceConnect");
    } catch (err) {
      Log.e(`VoiceConnect > 2 > ${err}`);
    }
  } catch (err) {
    Log.e(`VoiceConnect > 1 > ${err}`);
    return message.channel.send(locale.err_task);
  }
};

export const voiceDisconnect = (locale: Locale, state: State, message: Message, timeout?) => {
  try {
    state.isPlaying = false;
    state.voiceChannel.leave();
    state.connection = null;
    state.voiceChannel = null;

    Log.d(`VoiceDisconnect${timeout ? " : Timeout" : ""}`);
    message.channel.send(`${timeout ? locale.disconnectTimeout : locale.leave}`);
  } catch (err) {
    message.channel.send(locale.notInVoiceChannel);
  }
};

export const alarmDB: AlarmDB = { voiceChannel: null, connection: null };

export const activateAlarm = async (message: Message, alarmDB: AlarmDB): Promise<Message | void> => {
  try {
    alarmDB.voiceChannel = message.member.voice.channel;
    // Not in voice channel
    if (!alarmDB.voiceChannel) return Log.e("ActivateAlarm > Not in Voice Channel");

    const permissions = alarmDB.voiceChannel.permissionsFor(message.client.user);
    // Insufficient perms
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) return Log.e("ActivateAlarm > Insufficient Permissions");

    return await message.delete();
  } catch (err) {
    Log.e(`ActivateAlarm > 1 > ${err}`);
  }
};

export const sendAlarm = async (alarmDB: AlarmDB): Promise<void> => {
  try {
    alarmDB.connection = await alarmDB.voiceChannel.join();

    const dispatcher = alarmDB.connection.play("src/alarm.mp3");
    dispatcher.setVolumeLogarithmic(0.25);
    // dispatcher.on("start", () => {});
    dispatcher.on("finish", async () => {
      alarmDB.connection.disconnect();
      alarmDB.connection = null;
      alarmDB.voiceChannel.leave();
    });
    Log.d("SendAlarm");
  } catch (err) {
    Log.d(`SendAlarm > 1 > ${err}`);
  }
};

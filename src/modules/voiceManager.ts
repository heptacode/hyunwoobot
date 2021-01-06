import { Message, TextChannel } from "discord.js";
import { client } from "../app";
import { AlarmDB, Interaction, State } from "../";
import Log from "./logger";

export const voiceConnect = async (state: State, interaction: Interaction) => {
  const guild = client.guilds.cache.get(interaction.guild_id);
  const channel = guild.channels.cache.get(interaction.channel_id) as TextChannel;
  const voiceChannel = guild.members.cache.get(interaction.member.user.id).voice.channel;

  const permissions = voiceChannel.permissionsFor(client.user);
  try {
    // Not in voice channel
    if (!voiceChannel) return channel.send(state.locale.voiceConnect.joinToConnect);

    // Insufficient perms
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return channel.send(state.locale.insufficientPerms.connect);
    }

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
  }
};

export const voiceDisconnect = (state: State, interaction: Interaction, timeout?: boolean) => {
  const channel = client.guilds.cache.get(interaction.guild_id).channels.cache.get(interaction.channel_id) as TextChannel;
  try {
    state.isPlaying = false;
    state.voiceChannel.leave();
    state.connection = null;
    state.voiceChannel = null;

    Log.d(`VoiceDisconnect${timeout ? " : Timeout" : ""}`);
    channel.send(`${timeout ? state.locale.voiceDisconnect.timeout : state.locale.voiceDisconnect.leave}`);
  } catch (err) {
    channel.send(state.locale.voiceDisconnect.notInVoiceChannel);
  }
};

export const alarmDB: AlarmDB = { voiceChannel: null, connection: null };

export const activateAlarm = async (message: Message, alarmDB: AlarmDB): Promise<Message | void> => {
  try {
    alarmDB.voiceChannel = message.member.voice.channel;
    // Not in voice channel
    if (!alarmDB.voiceChannel) return Log.e("ActivateAlarm > Not in Voice Channel");

    const permissions = alarmDB.voiceChannel.permissionsFor(client.user);
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

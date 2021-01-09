import { Guild, Message } from "discord.js";
import { sendEmbed } from "./embedSender";
import Log from "./logger";
import { client } from "../app";
import props from "../props";
import { AlarmDB, Interaction, Locale, State } from "../";

export const voiceStateCheck = async (locale: Locale, interaction: Interaction): Promise<boolean> => {
  if (!client.guilds.cache.get(interaction.guild_id).members.cache.get(interaction.member.user.id).voice.channel) {
    sendEmbed(
      { interaction: interaction },
      {
        color: props.color.red,
        author: {
          name: client.guilds.cache.get(interaction.guild_id).name,
          iconURL: client.guilds.cache.get(interaction.guild_id).iconURL(),
        },
        description: `❌ **${locale.music.joinVoiceChannel}**`,
      }
    );
    return true;
  }
  return false;
};

export const voiceConnect = async (state: State, interaction: Interaction) => {
  const guild: Guild = client.guilds.cache.get(interaction.guild_id);
  state.voiceChannel = guild.members.cache.get(interaction.member.user.id).voice.channel;

  try {
    if (!guild.members.cache.get(interaction.member.user.id).voice.channel.permissionsFor(client.user).has(["CONNECT", "SPEAK"]))
      return await sendEmbed({ interaction: interaction }, { description: `❌ **${state.locale.insufficientPerms.connect}**` }, { guild: true });

    if (state.voiceChannel) {
      state.connection = await state.voiceChannel.join();
      Log.d("VoiceConnect");
    }
  } catch (err) {
    Log.e(`VoiceConnect > ${err}`);
  }
};

export const voiceDisconnect = (state: State, interaction: Interaction) => {
  try {
    if (state.voiceChannel) {
      state.isPlaying = false;
      state.voiceChannel.leave();
      state.connection = null;
      state.voiceChannel = null;
    } else {
      return sendEmbed(
        { interaction: interaction },
        {
          color: props.color.red,
          description: `❌ **${state.locale.voiceDisconnect.notInVoiceChannel}**`,
        },
        { guild: true }
      );
    }
  } catch (err) {
    Log.e(`VoiceDisconnect > ${err}`);
  }
};

export const alarmDB: AlarmDB = { voiceChannel: null, connection: null };

export const activateAlarm = async (message: Message, alarmDB: AlarmDB): Promise<Message | void> => {
  try {
    //     const broadcast = client.voice.createBroadcast();

    // broadcast.on('subscribe', dispatcher => {
    //   console.log('New broadcast subscriber!');
    // });

    // broadcast.on('unsubscribe', dispatcher => {
    //   console.log('Channel unsubscribed from broadcast :(');
    // });

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

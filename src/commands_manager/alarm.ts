import fs from "fs";
import path from "path";
import { VoiceBroadcast, VoiceChannel, VoiceState } from "discord.js";
import { sendEmbed } from "../modules/embedSender";
import firestore from "../modules/firestore";
import Log from "../modules/logger";
import schedule from "node-schedule";
import { checkPermission } from "../modules/permissionChecker";
import { voiceStateCheck } from "../modules/voiceManager";
import { client, states } from "../app";
import { Interaction, Locale, State } from "../";

schedule.scheduleJob({ minute: 59, second: 51 }, () => sendAlarm());

const broadcast: VoiceBroadcast = client.voice.createBroadcast();

const sendAlarm = async () => {
  try {
    const dispatcher = broadcast.play(fs.createReadStream(path.resolve(__dirname, "../assets/alarm.mp3")));
    dispatcher.setVolume(0.2);

    for (const [guildID, state] of states) {
      if (!state.alarmChannel || state.isPlaying) continue;

      state.connection = await (client.channels.cache.get(state.alarmChannel) as VoiceChannel).join();
      state.connection.play(broadcast);

      dispatcher.on("finish", () => {
        (client.channels.cache.get(state.alarmChannel) as VoiceChannel).leave();
      });
    }
  } catch (err) {
    Log.e(`SendAlarm > ${err}`);
  }
};

export default {
  name: "alarm",
  version: 1,
  options(locale: Locale) {
    return [
      {
        type: 1,
        name: "subscribe",
        description: `${locale.manager} ${locale.alarm.options.subscribe}`,
      },
      {
        type: 1,
        name: "unsubscribe",
        description: `${locale.manager} ${locale.alarm.options.unsubscribe}`,
      },
      {
        type: 1,
        name: "test",
        description: `${locale.manager} ${locale.alarm.options.test}`,
      },
    ];
  },
  async execute(state: State, interaction: Interaction) {
    if (await checkPermission(state.locale, { interaction: interaction }, "ADMINISTRATOR")) return;

    const method = interaction.data.options[0].name;
    if (method === "subscribe") {
      try {
        const voiceState: VoiceState = client.guilds.cache.get(interaction.guild_id).members.cache.get(interaction.member.user.id).voice;

        if (!voiceState.channel.permissionsFor(client.user).has(["CONNECT", "SPEAK"]))
          return await sendEmbed({ interaction: interaction }, { description: `❌ **${state.locale.insufficientPerms.connect}**` });
        else if (await voiceStateCheck(state.locale, { interaction: interaction })) return;

        state.alarmChannel = voiceState.channelID;
        await firestore.collection(interaction.guild_id).doc("config").update({ alarmChannel: voiceState.channelID });
      } catch (err) {
        Log.e(`Alarm > Subscribe > ${err}`);
      }
    } else if (method === "unsubscribe") {
      try {
        state.alarmChannel = null;
        await firestore.collection(interaction.guild_id).doc("config").update({ alarmChannel: null });
      } catch (err) {
        Log.e(`Alarm > Unsubscribe > ${err}`);
      }
    } else if (method === "test") sendAlarm();
  },
};

import { VoiceBroadcast, VoiceChannel, VoiceState } from "discord.js";
import { scheduleJob } from "node-schedule";
import { resolve } from "path";
import { sendEmbed } from "../modules/embedSender";
import { firestore } from "../modules/firebase";
import { log } from "../modules/logger";
import { checkPermission } from "../modules/permissionChecker";
import { voiceStateCheck } from "../modules/voiceManager";
import { client, states } from "../app";
import { Interaction, Locale, State } from "../";

scheduleJob({ minute: 59, second: 51 }, () => sendAlarm());

const broadcast: VoiceBroadcast = client.voice.createBroadcast();

const sendAlarm = async () => {
  try {
    const dispatcher = broadcast.play(resolve(__dirname, process.env.NODE_ENV === "production" ? "../../src/assets/alarm.mp3" : "../assets/alarm.mp3"));
    dispatcher.setVolume(0.2);

    for (const [guildID, state] of states) {
      if (!state.alarmChannel || state.isPlaying) continue;

      state.connection = await (client.channels.resolve(state.alarmChannel) as VoiceChannel).join();
      state.connection.play(broadcast);

      dispatcher.on("finish", () => {
        state.connection.channel.leave();
      });
    }
  } catch (err) {
    log.e(`SendAlarm > ${err}`);
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
    if (await checkPermission(state.locale, { interaction: interaction }, "ADMINISTRATOR")) throw new Error();

    const method = interaction.data.options[0].name;
    if (method === "subscribe") {
      try {
        const voiceState: VoiceState = client.guilds.resolve(interaction.guild_id).member(interaction.member.user.id).voice;

        if (!voiceState.channel.permissionsFor(client.user).has(["CONNECT", "SPEAK"]))
          return sendEmbed({ interaction: interaction }, { description: `❌ **${state.locale.insufficientPerms.connect}**` });
        else if (await voiceStateCheck(state.locale, { interaction: interaction })) throw new Error();

        state.alarmChannel = voiceState.channelID;
        await firestore.collection(interaction.guild_id).doc("config").update({ alarmChannel: voiceState.channelID });
      } catch (err) {
        log.e(`Alarm > Subscribe > ${err}`);
      }
    } else if (method === "unsubscribe") {
      try {
        state.alarmChannel = null;
        await firestore.collection(interaction.guild_id).doc("config").update({ alarmChannel: null });
      } catch (err) {
        log.e(`Alarm > Unsubscribe > ${err}`);
      }
    } else if (method === "test") sendAlarm();
  },
};

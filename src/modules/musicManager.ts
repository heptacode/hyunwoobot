import { Message } from "discord.js";
import { Locale, State } from "../";
import ytdl from "ytdl-core";
import lengthConvert from "./lengthConverter";
import { voiceConnect, voiceDisconnect } from "./voiceManager";
import Log from "./logger";

export const stream = async (locale: Locale, state: State, message: Message) => {
  try {
    if (!state.connection) await voiceConnect(locale, state, message);

    try {
      state.dispatcher = state.connection.play(ytdl(state.playlist[0].videoURL), {
        // quality: "highestaudio",
        highWaterMark: 1 << 25,
      });

      state.dispatcher.setVolumeLogarithmic(state.volume / 5);

      state.dispatcher.on("start", () => {
        if (state.timeout) clearTimeout(state.timeout);
        state.isPlaying = true;
        message.channel.send({
          embed: {
            color: "#0099ff",
            author: {
              name: `${state.isLooped ? "🔁 " : ""}${state.isRepeated ? "🔂 " : ""}${locale.nowPlaying}`,
              iconURL: "https://firebasestorage.googleapis.com/v0/b/hyunwoo-bot.appspot.com/o/play.png?alt=media&token=38cc0c28-41b4-44aa-9f2f-0ad9c23859ab",
            },
            title: state.playlist[0].title,
            url: state.playlist[0].videoURL,
            description: state.playlist[0].channelName,
            thumbnail: { url: state.playlist[0].thumbnailURL },
            fields: [
              { name: locale.length, value: lengthConvert(state.playlist[0].length), inline: true },
              { name: locale.remaning, value: state.playlist.length - 1, inline: true },
            ],
            footer: { text: state.playlist[0].requestedBy.tag, iconURL: state.playlist[0].requestedBy.avatarURL },
          },
        });
      });
      state.dispatcher.on("finish", async () => {
        try {
          state.isPlaying = false;
          if (state.playlist.length >= 1) {
            if (state.isRepeated) {
            } else if (state.isLooped) {
              state.playlist.push(state.playlist[0]);
              state.playlist.shift();
            } else {
              state.playlist.shift();
            }
            if (state.playlist.length >= 1) {
              stream(locale, state, message);
            } else state.timeout = setTimeout(() => voiceDisconnect(locale, state, message, true), 10000);
          } else {
            state.timeout = setTimeout(() => voiceDisconnect(locale, state, message, true), 10000);
          }
        } catch (err) {
          Log.e(`Stream > 4 > ${err}`);
        }
      });
      state.dispatcher.on("error", (err) => {
        Log.e(`Stream > 3 > ${err}`);
      });
    } catch (err) {
      Log.e(`Stream > 2 > ${err}`);
    }
  } catch (err) {
    Log.e(`Stream > 1 > ${err}`);
  }
};

export const skip = (locale: Locale, state: State, message: Message) => {
  try {
    if (!message.member.voice.channel) return message.channel.send(locale.joinToSkip);

    if (state.playlist.length == 0) return message.channel.send(locale.noSongToSkip);

    state.playlist.shift();

    state.dispatcher.end();

    Log.d("Skip");
    message.channel.send(locale.skipped);
  } catch (err) {
    Log.e(`Skip > 1 > ${err}`);
    message.channel.send(locale.err_cmd);
  }
};

export const resume = (locale: Locale, state: State, message: Message) => {
  try {
    if (!message.member.voice.channel) return message.channel.send(locale.joinToStop);

    state.dispatcher.resume();
    state.isPlaying = true;
    Log.d("Resume");
  } catch (err) {
    Log.e(`Resume > 1 > ${err}`);
    return message.channel.send(locale.stopNotNow);
  }
};

export const pause = (locale: Locale, state: State, message: Message) => {
  try {
    if (!message.member.voice.channel) return message.channel.send(locale.joinToStop);

    state.dispatcher.pause(true);
    state.isPlaying = false;
    Log.d("Pause");
  } catch (err) {
    Log.e(`Pause > 1 > ${err}`);
    return message.channel.send(locale.stopNotNow);
  }
};

export const stop = (locale: Locale, state: State, message: Message) => {
  try {
    if (!message.member.voice.channel) return message.channel.send(`${locale.joinToStop}`);

    state.dispatcher.pause(true);
    state.isPlaying = false;

    Log.d("Stop");
  } catch (err) {
    Log.e(`Stop > 1 > ${err}`);
    return message.channel.send(`${locale.stopNotNow}`);
  }
};

export const toggleLoop = (locale: Locale, state: State, message: Message) => {
  try {
    if (!message.member.voice.channel) return message.channel.send(locale.joinToToggleLoop);

    state.isLooped = !state.isLooped;

    Log.d(`ToggleLoop : ${state.isLooped ? "ON" : "OFF"}`);
    message.channel.send(`${locale.toggleLoop}${state.isLooped ? `${locale.on}` : `${locale.off}`}`);
  } catch (err) {
    Log.e(`ToggleLoop > 1 > ${err}`);
    message.channel.send(locale.err_cmd);
  }
};

import { Message } from "discord.js";
import { Locale, State } from "../";
import ytdl from "ytdl-core";
import { getLength } from "./converter";
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
              { name: locale.length, value: getLength(state.playlist[0].length), inline: true },
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

export const skip = async (locale: Locale, state: State, message: Message) => {
  try {
    if (!message.member.voice.channel) {
      message.react("❌");
      return message.channel.send(locale.joinToSkip).then((_message: Message) => {
        _message.delete({ timeout: 5000 });
      });
    }

    if (state.playlist.length === 0) return message.channel.send(locale.noSongToSkip);

    state.playlist.shift();

    state.dispatcher.end();

    message.react("⏩");
    return message.channel.send(locale.skipped);
  } catch (err) {
    message.react("❌");
    Log.e(`Skip > 1 > ${err}`);
  }
};

export const resume = async (locale: Locale, state: State, message: Message) => {
  try {
    if (!message.member.voice.channel) {
      message.react("❌");
      return message.channel.send(locale.joinToConnect).then((_message: Message) => {
        _message.delete({ timeout: 5000 });
      });
    }

    state.dispatcher.resume();
    state.isPlaying = true;
  } catch (err) {
    message.react("❌");
    Log.e(`Resume > 1 > ${err}`);
  }
};

export const pause = async (locale: Locale, state: State, message: Message) => {
  try {
    if (!message.member.voice.channel) {
      message.react("❌");
      return message.channel.send(locale.joinToStop).then((_message: Message) => {
        _message.delete({ timeout: 5000 });
      });
    }

    state.dispatcher.pause(true);
    state.isPlaying = false;
  } catch (err) {
    message.react("❌");
    message.channel.send(locale.stopNotNow);
    Log.e(`Pause > 1 > ${err}`);
  }
};

export const stop = (locale: Locale, state: State, message: Message) => {
  try {
    if (!message.member.voice.channel) {
      message.react("❌");
      return message.channel.send(locale.joinToStop).then((_message: Message) => {
        _message.delete({ timeout: 5000 });
      });
    }

    state.dispatcher.pause(true);
    state.isPlaying = false;
  } catch (err) {
    message.react("❌");
    message.channel.send(`${locale.stopNotNow}`);
    Log.e(`Stop > 1 > ${err}`);
  }
};

export const toggleLoop = (locale: Locale, state: State, message: Message) => {
  try {
    if (!message.member.voice.channel) {
      message.react("❌");
      return message.channel.send(locale.joinToToggleLoop).then((_message: Message) => {
        _message.delete({ timeout: 5000 });
      });
    }

    state.isLooped = !state.isLooped;

    message.react("✅");
    return message.channel.send(`${locale.toggleLoop}${state.isLooped ? `${locale.on}` : `${locale.off}`}`);
  } catch (err) {
    message.react("❌");
    Log.e(`ToggleLoop > 1 > ${err}`);
  }
};

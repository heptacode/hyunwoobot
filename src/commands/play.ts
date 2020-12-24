import { EmbedFieldData, Message } from "discord.js";
import { Args, Locale, State } from "../";
import { stream } from "../modules/musicManager";
import youtube from "scrape-youtube";
import lengthConvert from "../modules/lengthConverter";
import config from "../config";
import Log from "../modules/logger";

module.exports = {
  name: "play",
  aliases: ["p", "eq", "enqueue"],
  description: "Play/Enqueue a music",
  async execute(locale: Locale, state: State, message: Message, args: Args) {
    try {
      const query = args[0];
      let payload;
      if (!query && state.playlist.length !== 0) {
        if (!state.isPlaying) return stream(locale, state, message);
        else return message.channel.send(locale.currentlyPlaying);
      } else if (!query && state.playlist.length === 0) return message.channel.send(locale.playlistEmpty);

      const result = (await youtube.search(query, { type: "video" })).videos;
      if (result.length >= 1) {
        if (result.length === 1) {
          payload = {
            title: result[0].title,
            channelName: result[0].channel.name,
            length: result[0].duration,
            thumbnailURL: result[0].thumbnail,
            videoURL: result[0].link,
            requestedBy: { tag: message.author.tag, avatarURL: message.author.avatarURL() },
          };
        } else {
          // Query Search
          payload = {
            title: result[0].title,
            channelName: result[0].channel.name,
            length: result[0].duration,
            thumbnailURL: result[0].thumbnail,
            videoURL: result[0].link,
            requestedBy: { tag: message.author.tag, avatarURL: message.author.avatarURL() },
          };
          // return message.channel.send(locale.urlInvalid);
        }
        try {
          state.playlist.push(payload);
          if (state.playlist.length === 1) {
            return stream(locale, state, message);
          } else {
            Log.d(`Enqueue : ${payload.title}`);
            const fields: EmbedFieldData[] = [
              { name: locale.length, value: lengthConvert(state.playlist[state.playlist.length - 1].length), inline: true },
              { name: locale.position, value: state.playlist.length - 1, inline: true },
              // { name: "\u200B", value: "\u200B" },
            ];
            for (const i in state.playlist) {
              if (Number(i) == 0) fields.push({ name: locale.nowPlaying, value: state.playlist[i].title });
              else fields.push({ name: `#${i}`, value: state.playlist[i].title });
            }
            fields.push({ name: "\u200B", value: `${state.isPlaying ? "▶️" : "⏹"}${state.isLooped ? " 🔁" : ""}${state.isRepeated ? " 🔂" : ""}` });
            message.channel.send({
              embed: {
                color: config.color.primary,
                author: { name: locale.enqueued, iconURL: state.playlist[state.playlist.length - 1].requestedBy.avatarURL, url: config.bot.website },
                title: state.playlist[state.playlist.length - 1].title,
                url: state.playlist[state.playlist.length - 1].videoURL,
                description: state.playlist[state.playlist.length - 1].channelName,
                thumbnail: { url: state.playlist[state.playlist.length - 1].thumbnailURL },
                fields: fields,
              },
            });
          }
        } catch (err) {
          Log.e(`Enqueue > 2 > ${err}`);
          message.channel.send(locale.err_cmd);
        }
      } else {
        Log.e(`Enqueue > No Result`);
        return message.channel.send(locale.urlInvalid);
      }
    } catch (err) {
      Log.e(`Enqueue > 1 > ${err}`);
      message.channel.send(locale.err_cmd);
    }
  },
};

import { EmbedFieldData, Message } from "discord.js";
import { Args, Locale, State } from "../";
import Log from "../modules/logger";

module.exports = {
  name: "playlist",
  aliases: ["ls", "list", "queue"],
  description: "Show playlist",
  execute(locale: Locale, state: State, message: Message, args: Args) {
    try {
      if (state.playlist.length != 0) {
        const fields: EmbedFieldData[] = [];
        for (const i in state.playlist) {
          if (Number(i) === 0) fields.push({ name: locale.nowPlaying, value: state.playlist[i].title });
          else fields.push({ name: `#${i}`, value: state.playlist[i].title });
        }
        fields.push({ name: "\u200B", value: `${state.isPlaying ? "▶️" : "⏹"}${state.isLooped ? " 🔁" : ""}${state.isRepeated ? " 🔂" : ""}` });
        message.channel.send({
          embed: {
            color: "#7788D4",
            author: {
              name: String(state.volume),
              iconURL: "https://firebasestorage.googleapis.com/v0/b/hyunwoo-bot.appspot.com/o/volume.png?alt=media&token=887c1886-e440-48a4-b52e-15b064f5bc2f",
            },
            title: state.playlist[0].title,
            url: state.playlist[0].videoURL,
            description: state.playlist[0].channelName,
            thumbnail: { url: state.playlist[0].thumbnailURL },
            fields: fields,
          },
        });
      } else {
        Log.w(`Playlist > Playlist Empty`);
        message.channel.send(locale.playlistEmpty);
      }
    } catch (err) {
      Log.e(`Playlist > 1 > ${err}`);
      message.channel.send(locale.err_cmd);
    }
  },
};

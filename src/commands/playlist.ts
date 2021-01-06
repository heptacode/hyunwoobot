import { EmbedFieldData, Message } from "discord.js";
import { Args, Locale, State } from "../";
import props from "../props";
import Log from "../modules/logger";

export default {
  name: "playlist",
  aliases: ["ls", "list", "queue"],
  execute(locale: Locale, state: State, message: Message, args: Args) {
    try {
      if (state.playlist.length != 0) {
        const fields: EmbedFieldData[] = [];
        for (const i in state.playlist) {
          if (Number(i) === 0) fields.push({ name: locale.music.nowPlaying, value: state.playlist[i].title });
          else fields.push({ name: `#${i}`, value: state.playlist[i].title });
        }
        fields.push({ name: "\u200B", value: `${state.isPlaying ? "▶️" : "⏹"}${state.isLooped ? " 🔁" : ""}${state.isRepeated ? " 🔂" : ""}` });
        message.channel.send({
          embed: {
            color: props.color.primary,
            author: {
              name: String(state.volume),
              iconURL: props.icon.volume,
            },
            title: state.playlist[0].title,
            url: state.playlist[0].videoURL,
            description: state.playlist[0].channelName,
            thumbnail: { url: state.playlist[0].thumbnailURL },
            fields: fields,
          },
        });
      } else {
        message.channel.send(locale.music.empty);
        Log.w(`Playlist > Playlist Empty`);
      }
    } catch (err) {
      message.react("❌");
      Log.e(`Playlist > 1 > ${err}`);
    }
  },
};

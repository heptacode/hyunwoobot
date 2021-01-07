import { EmbedFieldData, TextChannel } from "discord.js";
import { client } from "../app";
import props from "../props";
import { Interaction, State } from "../";
import Log from "../modules/logger";

export default {
  name: "playlist",
  version: 1,
  execute(state: State, interaction: Interaction) {
    const channel = client.guilds.cache.get(interaction.guild_id).channels.cache.get(interaction.channel_id) as TextChannel;
    try {
      if (state.playlist.length != 0) {
        const fields: EmbedFieldData[] = [];
        for (const i in state.playlist) {
          if (Number(i) === 0) fields.push({ name: state.locale.music.nowPlaying, value: state.playlist[i].title });
          else fields.push({ name: `#${i}`, value: state.playlist[i].title });
        }
        fields.push({ name: "\u200B", value: `${state.isPlaying ? "▶️" : "⏹"}${state.isLooped ? " 🔁" : ""}${state.isRepeated ? " 🔂" : ""}` });
        channel.send({
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
        channel.send(state.locale.music.empty);
        Log.w(`Playlist > Playlist Empty`);
      }
    } catch (err) {
      Log.e(`Playlist > 1 > ${err}`);
    }
  },
};

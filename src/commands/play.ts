import { EmbedFieldData, Message, TextChannel } from "discord.js";
import { client } from "../app";
import { stream } from "../modules/musicManager";
import { getLength } from "../modules/converter";
import youtube from "scrape-youtube";
import props from "../props";
import { Interaction, Locale, State } from "../";
import Log from "../modules/logger";

export default {
  name: "play",
  version: 1,
  options(locale: Locale) {
    return [
      {
        type: 3,
        name: "query",
        description: "Search Query",
        required: true,
      },
    ];
  },
  async execute(state: State, interaction: Interaction) {
    const channel = client.guilds.cache.get(interaction.guild_id).channels.cache.get(interaction.channel_id) as TextChannel;
    try {
      const query = String(interaction.data.options[0].value);
      let payload;
      if (!query && state.playlist.length !== 0) {
        if (!state.isPlaying) return stream(state, interaction);
        else return channel.send(state.locale.music.currentlyPlaying);
      } else if (!query && state.playlist.length === 0) return channel.send(state.locale.music.empty);

      const result = (await youtube.search(query, { type: "video" })).videos;
      if (result.length >= 1) {
        if (result.length === 1) {
          payload = {
            title: result[0].title,
            channelName: result[0].channel.name,
            length: result[0].duration,
            thumbnailURL: result[0].thumbnail,
            videoURL: result[0].link,
            requestedBy: { tag: interaction.member.user.tag, avatarURL: interaction.member.user.avatarURL() },
          };
        } else {
          // Query Search
          payload = {
            title: result[0].title,
            channelName: result[0].channel.name,
            length: result[0].duration,
            thumbnailURL: result[0].thumbnail,
            videoURL: result[0].link,
            requestedBy: { tag: interaction.member.user.tag, avatarURL: interaction.member.user.avatarURL() },
          };
          // return message.channel.send(locale.urlInvalid);
        }
        try {
          state.playlist.push(payload);
          if (state.playlist.length === 1) {
            return stream(state, interaction);
          } else {
            Log.d(`Enqueue : ${payload.title}`);
            const fields: EmbedFieldData[] = [
              { name: state.locale.music.length, value: getLength(state.playlist[state.playlist.length - 1].length), inline: true },
              { name: state.locale.music.position, value: state.playlist.length - 1, inline: true },
              // { name: "\u200B", value: "\u200B" },
            ];
            for (const i in state.playlist) {
              if (Number(i) == 0) fields.push({ name: state.locale.music.nowPlaying, value: state.playlist[i].title });
              else fields.push({ name: `#${i}`, value: state.playlist[i].title });
            }

            fields.push({ name: "\u200B", value: `${state.isPlaying ? "▶️" : "⏹"}${state.isLooped ? " 🔁" : ""}${state.isRepeated ? " 🔂" : ""}` });

            return channel.send({
              embed: {
                color: props.color.primary,
                author: { name: state.locale.music.enqueued, iconURL: state.playlist[state.playlist.length - 1].requestedBy.avatarURL, url: props.bot.website },
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
        }
      } else {
        Log.e(`Enqueue > No Result`);
        return channel.send(`<@${interaction.member.user.id}>, ${state.locale.music.urlInvalid}`).then((_message: Message) => {
          _message.delete({ timeout: 5000 });
        });
      }
    } catch (err) {
      Log.e(`Enqueue > 1 > ${err}`);
    }
  },
};

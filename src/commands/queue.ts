import { EmbedFieldData } from "discord.js";
import { sendEmbed } from "../modules/embedSender";
import { log } from "../modules/logger";
import props from "../props";
import { Interaction, State } from "../";

export default {
  name: "queue",
  version: 1,
  execute(state: State, interaction: Interaction) {
    try {
      if (state.queue.length) {
        const fields: EmbedFieldData[] = [];
        for (const i in state.queue) {
          fields.push({ name: `#${i}`, value: state.queue[i].title });
        }
        fields.push({ name: "\u200B", value: `${state.isPlaying ? "▶️" : "⏹"}${state.isLooped ? " 🔁" : ""}${state.isRepeated ? " 🔂" : ""}` });

        return [
          {
            color: props.color.purple,
            author: {
              name: String(state.volume),
              iconURL: props.icon.volume,
            },
            title: `**${state.queue[0].title}**`,
            url: state.queue[0].videoURL,
            description: state.queue[0].channelName,
            thumbnail: { url: state.queue[0].thumbnailURL },
            fields: fields,
          },
        ];
      } else {
        return [
          {
            color: props.color.purple,
            description: `🗑 **${state.locale.music.queueEmpty}**`,
          },
        ];
      }
    } catch (err) {
      log.e(`Queue > ${err}`);
    }
  },
};

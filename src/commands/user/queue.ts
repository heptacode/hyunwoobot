import { EmbedFieldData, Interaction } from 'discord.js';
import { createError } from '@/modules/createError';
import { props } from '@/props';
import { Command, State } from '@/types';

export const queue: Command = {
  name: 'queue',
  version: 1,
  execute(state: State, interaction: Interaction) {
    try {
      if (state.queue.length) {
        const fields: EmbedFieldData[] = [];
        for (const i in state.queue) {
          fields.push({ name: `#${i}`, value: state.queue[i].title });
        }
        fields.push({
          name: '\u200B',
          value: `${state.isPlaying ? '▶️' : '⏹'}${state.isLooped ? ' 🔁' : ''}${
            state.isRepeated ? ' 🔂' : ''
          }`,
        });

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
      createError('Queue', err, { interaction: interaction });
    }
  },
};

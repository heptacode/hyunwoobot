import { musicPlay } from '@/modules/music';
import { Command, Locale, State } from '@/types';
import { Interaction } from 'discord.js';

export const play: Command = {
  name: 'play',
  version: 2,
  options(locale: Locale) {
    return [
      {
        type: 3,
        name: 'query',
        description: locale.music.options.query,
        required: false,
      },
    ];
  },
  async execute(state: State, interaction: Interaction) {
    musicPlay(state, interaction);
  },
};

import { musicPlay } from '@/modules/music';
import { APIApplicationCommandOption, Command, Interaction, Locale, State } from '@/types';

export const play: Command = {
  name: 'play',
  version: 2,
  options(locale: Locale): APIApplicationCommandOption[] {
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

import { musicPlay } from '@/modules/music';
import { Command, Locale, State } from '@/types';
import { APIApplicationCommandOption } from 'discord-api-types/v10';
import { CommandInteraction } from 'discord.js';

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
  async execute(state: State, interaction: CommandInteraction) {
    musicPlay(state, interaction);
  },
};

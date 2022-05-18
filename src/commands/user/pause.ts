import { musicPause } from '@/modules/music';
import { Command, State } from '@/types';
import { CommandInteraction } from 'discord.js';

export const pause: Command = {
  name: 'pause',
  version: 1,
  execute(state: State, interaction: CommandInteraction) {
    musicPause(state, interaction);
  },
};

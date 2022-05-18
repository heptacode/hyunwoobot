import { Interaction } from 'discord.js';
import { musicPause } from '@/modules/music';
import { Command, State } from '@/types';

export const pause: Command = {
  name: 'pause',
  version: 1,
  execute(state: State, interaction: Interaction) {
    musicPause(state, interaction);
  },
};

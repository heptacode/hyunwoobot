import { Interaction } from 'discord.js';
import { musicStop } from '@/modules/music';
import { Command, State } from '@/types';

export const stop: Command = {
  name: 'stop',
  version: 1,
  execute(state: State, interaction: Interaction) {
    musicStop(state, interaction);
  },
};

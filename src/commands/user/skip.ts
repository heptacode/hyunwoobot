import { Interaction } from 'discord.js';
import { musicSkip } from '@/modules/music';
import { Command, State } from '@/types';

export const skip: Command = {
  name: 'skip',
  version: 1,
  execute(state: State, interaction: Interaction) {
    musicSkip(state, interaction);
  },
};

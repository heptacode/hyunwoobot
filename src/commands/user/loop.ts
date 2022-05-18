import { Interaction } from 'discord.js';
import { toggleLoop } from '@/modules/music';
import { Command, State } from '@/types';

export const loop: Command = {
  name: 'loop',
  version: 1,
  execute(state: State, interaction: Interaction) {
    toggleLoop(state, interaction);
  },
};

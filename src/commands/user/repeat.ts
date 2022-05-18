import { Interaction } from 'discord.js';
import { toggleRepeat } from '@/modules/music';
import { Command, State } from '@/types';

export const repeat: Command = {
  name: 'repeat',
  version: 1,
  async execute(state: State, interaction: Interaction) {
    toggleRepeat(state, interaction);
  },
};

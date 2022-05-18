import { toggleRepeat } from '@/modules/music';
import { Command, State } from '@/types';
import { CommandInteraction } from 'discord.js';

export const repeat: Command = {
  name: 'repeat',
  version: 1,
  async execute(state: State, interaction: CommandInteraction) {
    toggleRepeat(state, interaction);
  },
};

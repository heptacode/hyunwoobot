import { musicSkip } from '@/modules/music';
import { Command, State } from '@/types';
import { CommandInteraction } from 'discord.js';

export const skip: Command = {
  name: 'skip',
  version: 1,
  execute(state: State, interaction: CommandInteraction) {
    musicSkip(state, interaction);
  },
};

import { toggleLoop } from '@/modules/music';
import { Command, State } from '@/types';
import { CommandInteraction } from 'discord.js';

export const loop: Command = {
  name: 'loop',
  version: 1,
  execute(state: State, interaction: CommandInteraction) {
    toggleLoop(state, interaction);
  },
};

import { musicStop } from '@/modules/music';
import { Command, State } from '@/types';
import { CommandInteraction } from 'discord.js';

export const stop: Command = {
  name: 'stop',
  version: 1,
  execute(state: State, interaction: CommandInteraction) {
    musicStop(state, interaction);
  },
};

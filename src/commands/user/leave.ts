import { Interaction } from 'discord.js';
import { voiceDisconnect } from '@/modules/voice';
import { Command, State } from '@/types';

export const leave: Command = {
  name: 'leave',
  version: 1,
  execute(state: State, interaction: Interaction) {
    voiceDisconnect(state, interaction);
  },
};

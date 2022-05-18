import { Interaction } from 'discord.js';
import { voiceConnect } from '@/modules/voice';
import { Command, State } from '@/types';

export const join: Command = {
  name: 'join',
  version: 1,
  execute(state: State, interaction: Interaction) {
    voiceConnect(state, interaction);
  },
};

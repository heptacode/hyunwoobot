import { voiceConnect } from '@/modules/voice';
import { Command, State } from '@/types';
import { CommandInteraction } from 'discord.js';

export const join: Command = {
  name: 'join',
  version: 1,
  execute(state: State, interaction: CommandInteraction) {
    voiceConnect(state, interaction);
  },
};

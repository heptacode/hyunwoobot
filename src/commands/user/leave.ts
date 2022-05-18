import { voiceDisconnect } from '@/modules/voice';
import { Command, State } from '@/types';
import { CommandInteraction } from 'discord.js';

export const leave: Command = {
  name: 'leave',
  version: 1,
  execute(state: State, interaction: CommandInteraction) {
    voiceDisconnect(state, interaction);
  },
};

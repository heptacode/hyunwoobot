import { CommandInteraction } from 'discord.js';
import { createError } from '@/modules/createError';
import { sendEmbed } from '@/modules/embedSender';
import { voiceStateCheck } from '@/modules/voice';
import { props } from '@/props';
import { State } from '@/types';

export async function toggleLoop(state: State, interaction: CommandInteraction) {
  try {
    // if (
    //   (await voiceStateCheck(state.locale, { interaction: interaction })) ||
    //   !state.connection ||
    //   !state.connection.dispatcher
    // )
    //   return;
    // state.isLooped = !state.isLooped;
    // return sendEmbed(
    //   { interaction: interaction },
    //   {
    //     color: props.color.green,
    //     description: `✅ **${state.locale.music.loopToggled}${
    //       state.isLooped ? `${state.locale.on}` : `${state.locale.off}`
    //     }**`,
    //   },
    //   { guild: true }
    // );
  } catch (err) {
    createError('ToggleLoop', err, { interaction: interaction });
  }
}

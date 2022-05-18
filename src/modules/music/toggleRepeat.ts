import { createError } from '@/modules/createError';
import { State } from '@/types';
import { CommandInteraction } from 'discord.js';

export async function toggleRepeat(state: State, interaction: CommandInteraction) {
  try {
    // if (
    //   (await voiceStateCheck(state.locale, { interaction: interaction })) ||
    //   !state.connection ||
    //   !state.connection.dispatcher
    // )
    //   return;
    // state.isRepeated = !state.isRepeated;
    // return sendEmbed(
    //   { interaction: interaction },
    //   {
    //     color: props.color.green,
    //     description: `✅ **${state.locale.music.repeatToggled}${
    //       state.isRepeated ? `${state.locale.on}` : `${state.locale.off}`
    //     }**`,
    //   },
    //   { guild: true }
    // );
  } catch (err) {
    createError('ToggleRepeat', err, { interaction: interaction });
  }
}

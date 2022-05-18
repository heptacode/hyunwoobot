import { createError } from '@/modules/createError';
import { sendEmbed } from '@/modules/sendEmbed';
import { voiceStateCheck } from '@/modules/voice';
import { props } from '@/props';
import { State } from '@/types';
import { CommandInteraction, Message } from 'discord.js';

export async function musicSkip(state: State, interaction: CommandInteraction) {
  try {
    if (
      (await voiceStateCheck(state.locale, { interaction: interaction })) ||
      !state.connection ||
      !state.player
    )
      return;

    if (!state.queue || state.queue.length <= 0) {
      const message: Message = await sendEmbed(
        { interaction: interaction },
        {
          color: props.color.red,
          description: `❌ **${state.locale.music.noSongToSkip}**`,
        },
        { guild: true }
      );

      return setTimeout(() => message.delete(), 10000);
    }

    state.player.stop();
    state.queue.shift();

    return sendEmbed(
      { interaction: interaction },
      {
        color: props.color.blue,
        description: `⏩ **${state.locale.music.skipped}**`,
      },
      { guild: true }
    );
  } catch (err) {
    createError('Skip', err, { interaction: interaction });
  }
}

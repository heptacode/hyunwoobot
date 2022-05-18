import { CommandInteraction, Message } from 'discord.js';
import { createError } from '../createError';
import { sendEmbed } from '../embedSender';
import { voiceStateCheck } from '@/modules/voice';
import { props } from '@/props';
import { State } from '@/types';

export async function musicSkip(state: State, interaction: CommandInteraction) {
  try {
    // if (
    //   (await voiceStateCheck(state.locale, { interaction: interaction })) ||
    //   !state.connection ||
    //   !state.connection.dispatcher
    // )
    //   return;
    // if (!state.queue || state.queue.length <= 0)
    //   return sendEmbed(
    //     { interaction: interaction },
    //     {
    //       color: props.color.red,
    //       description: `❌ **${state.locale.music.noSongToSkip}**`,
    //     },
    //     { guild: true }
    //   ).then((_message: Message) => _message.delete({ timeout: 10000 }));
    // state.connection.dispatcher.end();
    // state.queue.shift();
    // return sendEmbed(
    //   { interaction: interaction },
    //   {
    //     color: props.color.blue,
    //     description: `⏩ **${state.locale.music.skipped}**`,
    //   },
    //   { guild: true }
    // );
  } catch (err) {
    createError('Skip', err, { interaction: interaction });
  }
}

import { createError } from '@/modules/createError';
import { voiceStateCheck } from '@/modules/voice';
import { props } from '@/props';
import { APIApplicationCommandOption, Command, Interaction, Locale, State } from '@/types';

export const volume: Command = {
  name: 'volume',
  version: 1,
  options(locale: Locale): APIApplicationCommandOption[] {
    return [
      {
        type: 4,
        name: 'value',
        description: '1~10',
        required: true,
        choices: [
          { name: '1', value: 1 },
          { name: '2', value: 2 },
          { name: '3', value: 3 },
          { name: '4', value: 4 },
          { name: '5', value: 5 },
          { name: '6', value: 6 },
          { name: '7', value: 7 },
          { name: '8', value: 8 },
          { name: '9', value: 9 },
          { name: '10', value: 10 },
        ],
      },
    ];
  },
  async execute(state: State, interaction: Interaction) {
    // try {
    //   if ((await voiceStateCheck(state.locale, { interaction: interaction })) || !state.connection || !state.connection.dispatcher) return;
    //   const newVolume = Number(interaction.data.options[0].value);
    //   state.connection.dispatcher.setVolume(newVolume / 150);
    //   state.volume = newVolume;
    //   return [
    //     {
    //       color: props.color.purple,
    //       description: `🔈 **${state.locale.music.volumeChanged}${newVolume}**`,
    //     },
    //   ];
    // } catch (err) {
    //   createError("ChangeVolume", err, { interaction: interaction });
    // }
  },
};

import { Interaction } from 'discord.js';
import { createError } from '@/modules/createError';
import { firestore } from '@/services/firebase';
import { checkPermission } from '@/modules/checkPermission';
import { props } from '@/props';
import { Command, Locale, State } from '@/types';

export const setafktimeout: Command = {
  name: 'setafktimeout',
  version: 1,
  options(locale: Locale) {
    return [
      {
        type: 4,
        name: 'minutes',
        description: locale.afkTimeout.options.minutesToDisconnect,
        required: true,
      },
    ];
  },
  async execute(state: State, interaction: Interaction | any) {
    try {
      if (await checkPermission(state.locale, { interaction: interaction }, 'MANAGE_GUILD'))
        throw new Error('Missing Permissions');

      await firestore
        .collection(interaction.guildId)
        .doc('config')
        .update({ afkTimeout: interaction.data.options[0].value });

      return [
        {
          color: props.color.green,
          title: `**${state.locale.afkTimeout.afkTimeout}**`,
          description: `✅ **${state.locale.afkTimeout.set.replace(
            '{min}',
            interaction.data.options[0].value
          )}**`,
        },
      ];
    } catch (err) {
      createError('SetAfkTimeout', err, { interaction: interaction });
    }
  },
};

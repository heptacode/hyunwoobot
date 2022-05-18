import { createError } from '@/modules/createError';
import { firestore } from '@/services/firebase';
import { checkPermission } from '@/modules/checkPermission';
import { props } from '@/props';
import { APIApplicationCommandOption, Command, CommandInteraction, Locale, State } from '@/types';

export const log: Command = {
  name: 'log',
  version: 2,
  options(locale: Locale): APIApplicationCommandOption[] {
    return [
      {
        type: 7,
        name: 'text_channel',
        description: locale.textChannel,
        required: true,
      },
    ];
  },
  async execute(state: State, interaction: CommandInteraction) {
    try {
      if (await checkPermission(state.locale, { interaction: interaction }, 'MANAGE_MESSAGES'))
        throw new Error('Missing Permissions');

      await firestore
        .collection(interaction.guildId)
        .doc('config')
        .update({ logChannel: interaction.options[0].value });

      return [
        {
          color: props.color.green,
          title: `**📦 ${state.locale.log.log}**`,
          description: `✅ **${state.locale.log.set}<#${interaction.options[0].value}>**`,
        },
      ];
    } catch (err) {
      createError('Log', err, { interaction: interaction });
    }
  },
};

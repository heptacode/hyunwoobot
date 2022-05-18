import { EmbedFieldData, Interaction } from 'discord.js';
import { createError } from '@/modules/createError';
import { firestore } from '@/services/firebase';
import { checkPermission } from '@/modules/checkPermission';
import { props } from '@/props';
import { Command, Locale, State } from '@/types';

export const autorole: Command = {
  name: 'autorole',
  version: 1,
  options(locale: Locale) {
    return [
      {
        type: 1,
        name: 'view',
        description: `${locale.manager} ${locale.autoRole.options.view}`,
      },
      {
        type: 1,
        name: 'add',
        description: `${locale.manager} ${locale.autoRole.options.add}`,
        options: [
          {
            type: 3,
            name: 'type',
            description: 'User/Bot',
            required: true,
            choices: [
              { name: 'user', value: 'user' },
              { name: 'bot', value: 'bot' },
            ],
          },
          { type: 8, name: 'role', description: locale.role, required: true },
        ],
      },
      {
        type: 1,
        name: 'purge',
        description: `${locale.manager} ${locale.autoRole.options.purge}`,
      },
    ];
  },
  async execute(state: State, interaction: Interaction | any) {
    try {
      if (await checkPermission(state.locale, { interaction: interaction }, 'MANAGE_ROLES'))
        throw new Error('Missing Permissions');

      const method = interaction.data.options[0].name;

      if (method === 'view') {
      } else if (method === 'add') {
        state.autoRoles.push({
          type: interaction.data.options[0].options[0].value,
          role: interaction.data.options[0].options[1].value,
        });
        await firestore
          .collection(interaction.guildId)
          .doc('config')
          .update({ autoRoles: state.autoRoles });
      } else if (method === 'purge') {
        state.autoRoles = [];
        await firestore.collection(interaction.guildId).doc('config').update({ autoRoles: [] });
      }

      const fields: EmbedFieldData[] = [];
      if (state.autoRoles.length >= 1)
        for (const autoRole of state.autoRoles) {
          fields.push({ name: autoRole.type, value: `<@&${autoRole.role}>` });
        }

      return [
        {
          color: props.color.yellow,
          title: `**⚙️ ${state.locale.autoRole.autoRole}**`,
          fields:
            fields.length >= 1 ? fields : [{ name: '\u200B', value: state.locale.autoRole.empty }],
        },
      ];
    } catch (err) {
      createError('AutoRole', err, { interaction: interaction });
    }
  },
};

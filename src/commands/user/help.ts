import { EmbedFieldData, Interaction } from 'discord.js';
import { createError } from '@/modules/createError';
import { userCommands, managerCommands, prefix } from '@/app';
import { props } from '@/props';
import { Command, Locale, State } from '@/types';

export const help: Command = {
  name: 'help',
  version: 1,
  options(locale: Locale) {
    return [
      {
        type: 3,
        name: 'scope',
        description: locale.scope,
        required: false,
        choices: [{ name: 'manager', value: 'manager' }],
      },
    ];
  },
  async execute(state: State, interaction: Interaction | any) {
    try {
      const isManager: boolean =
        interaction.data.options && interaction.data.options[0].value === 'manager' ? true : false;
      const fields: EmbedFieldData[] = [];

      for (const [name, command] of !isManager ? userCommands : managerCommands) {
        fields.push({
          name: `${command.messageOnly ? prefix : '/'}${name}${
            state.locale.usage[name] ? ` ${state.locale.usage[name]}` : ''
          }`,
          value: state.locale.help[name] ? state.locale.help[name] : '\u200B',
          inline: true,
        });
      }

      return [
        {
          color: props.color.purple,
          title: `${props.bot.name} ${
            !isManager
              ? state.locale.help.help
              : `${state.locale.help.help} ${state.locale.manager}`
          }`,
          url: props.bot.website,
          description: !isManager
            ? state.locale.help.description
            : state.locale.help.description_manager,
          thumbnail: { url: props.bot.icon },
          fields: fields,
        },
      ];
    } catch (err) {
      createError('Help', err, { interaction: interaction });
    }
  },
};

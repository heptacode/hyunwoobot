import { client } from '@/app';
import { checkPermission } from '@/modules/checkPermission';
import { createError } from '@/modules/createError';
import { props } from '@/props';
import { Command, Locale, State } from '@/types';
import { APIApplicationCommandOption } from 'discord-api-types/v10';
import { CommandInteraction, TextChannel } from 'discord.js';

export const deleteMessage: Command = {
  name: 'delete',
  version: 2,
  options(locale: Locale): APIApplicationCommandOption[] {
    return [
      {
        type: 4,
        name: 'amount',
        description: '1~100',
        required: true,
      },
    ];
  },
  async execute(state: State, interaction: CommandInteraction) {
    try {
      if (await checkPermission(state.locale, { interaction: interaction }, 'MANAGE_MESSAGES'))
        throw new Error('Missing Permissions');

      await (client.channels.resolve(interaction.channelId) as TextChannel).bulkDelete(
        Number(interaction.options[0].value)
      );

      return [
        {
          color: props.color.purple,
          description: `🗑 **${interaction.options[0].value}${state.locale.delete.deleted}**`,
        },
      ];
    } catch (err) {
      createError('Delete', err, { interaction: interaction });
    }
  },
};

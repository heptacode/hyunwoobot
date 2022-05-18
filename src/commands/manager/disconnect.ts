import { client } from '@/app';
import { checkPermission } from '@/modules/checkPermission';
import { createError } from '@/modules/createError';
import { props } from '@/props';
import { Command, Locale, State } from '@/types';
import { APIApplicationCommandOption } from 'discord-api-types/v10';
import { CommandInteraction } from 'discord.js';

export const disconnect: Command = {
  name: 'disconnect',
  version: 2,
  options(locale: Locale): APIApplicationCommandOption[] {
    return [{ type: 6, name: 'user', description: locale.user, required: true }];
  },
  async execute(state: State, interaction: CommandInteraction) {
    try {
      if (await checkPermission(state.locale, { interaction: interaction }, 'MOVE_MEMBERS'))
        throw new Error('Missing Permissions');

      const voiceChannel = client.guilds
        .resolve(interaction.guildId)
        .members.resolve(interaction.options[0].value).voice.channel.name;

      await client.guilds
        .resolve(interaction.guildId)
        .members.resolve(interaction.options[0].value)
        .voice.disconnect(
          `[Disconnect] Executed by ${interaction.member.user.username}#${interaction.member.user.discriminator}}`
        );

      return [
        {
          color: props.color.purple,
          title: `**⚙️ ${state.locale.disconnect.disconnect}**`,
          description: `✅ **${state.locale.disconnect.disconnected
            .replace('{voiceChannel}', voiceChannel)
            .replace('{cnt}', '1')}**`,
        },
      ];
    } catch (err) {
      createError('Disconnect', err, { interaction: interaction });
    }
  },
};

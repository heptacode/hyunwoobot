import { client } from '@/app';
import { checkPermission } from '@/modules/checkPermission';
import { createError } from '@/modules/createError';
import { props } from '@/props';
import { Command, Locale, State } from '@/types';
import { APIApplicationCommandOption } from 'discord-api-types/v10';
import { CommandInteraction, GuildChannel } from 'discord.js';

export const disconnectall: Command = {
  name: 'disconnectall',
  version: 1,
  options(locale: Locale): APIApplicationCommandOption[] {
    return [{ type: 7, name: 'voice_channel', description: locale.voiceChannel, required: true }];
  },
  async execute(state: State, interaction: CommandInteraction) {
    try {
      if (await checkPermission(state.locale, { interaction: interaction }, 'MOVE_MEMBERS'))
        throw new Error('Missing Permissions');

      const channel: GuildChannel = client.channels.resolve(
        interaction.options[0].value
      ) as GuildChannel;

      if (channel.type !== 'GUILD_VOICE' && channel.type !== 'GUILD_STAGE_VOICE')
        return [
          {
            color: props.color.red,
            title: `**⚙️ ${state.locale.disconnect.disconnect}**`,
            description: `❌ **${state.locale.notVoiceChannel}**`,
          },
        ];

      const cnt = channel.members.size;
      if (cnt <= 0) return;

      for (const [key, member] of channel.members) {
        try {
          await member.voice.disconnect(
            `[DisconnectAll] Executed by ${interaction.member.user.username}#${interaction.member.user.discriminator}}`
          );
        } catch (err) {}
      }

      return [
        {
          color: props.color.purple,
          title: `**⚙️ ${state.locale.disconnect.disconnect}**`,
          description: `✅ **${state.locale.disconnect.disconnected
            .replace(
              '{voiceChannel}',
              client.guilds
                .resolve(interaction.guildId)
                .channels.resolve(interaction.options[0].value).name
            )
            .replace('{cnt}', String(cnt))}**`,
        },
      ];
    } catch (err) {
      createError('DisconnectAll', err, { interaction: interaction });
    }
  },
};

import { GuildChannel, Interaction } from 'discord.js';
import { createError } from '@/modules/createError';
import { checkPermission } from '@/modules/checkPermission';
import { client } from '@/app';
import { props } from '@/props';
import { Command, Locale, State } from '@/types';

export const disconnectall: Command = {
  name: 'disconnectall',
  version: 1,
  options(locale: Locale) {
    return [{ type: 7, name: 'voice_channel', description: locale.voiceChannel, required: true }];
  },
  async execute(state: State, interaction: Interaction | any) {
    try {
      if (await checkPermission(state.locale, { interaction: interaction }, 'MOVE_MEMBERS'))
        throw new Error('Missing Permissions');

      const channel: GuildChannel = client.channels.resolve(
        interaction.data.options[0].value
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
                .resolve(interaction.guild_id)
                .channels.resolve(interaction.data.options[0].value).name
            )
            .replace('{cnt}', String(cnt))}**`,
        },
      ];
    } catch (err) {
      createError('DisconnectAll', err, { interaction: interaction });
    }
  },
};

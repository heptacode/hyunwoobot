import { createError } from '@/modules/createError';
import { checkPermission } from '@/modules/checkPermission';
import { client } from '@/app';
import { props } from '@/props';
import {
  APIApplicationCommandOption,
  Command,
  CommandInteraction,
  Guild,
  Locale,
  State,
  VoiceChannel,
} from '@/types';

export const moveall: Command = {
  name: 'moveall',
  version: 2,
  options(locale: Locale): APIApplicationCommandOption[] {
    return [
      {
        type: 7,
        name: 'from',
        description: locale.voiceChannel,
        required: true,
      },
      {
        type: 7,
        name: 'to',
        description: locale.voiceChannel,
        required: true,
      },
    ];
  },
  async execute(state: State, interaction: CommandInteraction) {
    try {
      if (await checkPermission(state.locale, { interaction: interaction }, 'MOVE_MEMBERS'))
        throw new Error('Missing Permissions');

      const guild: Guild = client.guilds.resolve(interaction.guildId);
      const fromChannel: VoiceChannel = guild.channels.resolve(
        interaction.options[0].value
      ) as VoiceChannel;
      const targetChannel: VoiceChannel = guild.channels.resolve(
        interaction.options[1].value
      ) as VoiceChannel;

      if (
        (fromChannel.type !== 'GUILD_VOICE' && fromChannel.type !== 'GUILD_STAGE_VOICE') ||
        (targetChannel.type !== 'GUILD_VOICE' && targetChannel.type !== 'GUILD_STAGE_VOICE')
      )
        return [
          {
            color: props.color.red,
            title: `**⚙️ ${state.locale.move.move}**`,
            description: `❌ **${state.locale.notVoiceChannel}**`,
          },
        ];

      const cnt = fromChannel.members.size;
      if (cnt <= 0) return;

      for (const [key, member] of fromChannel.members) {
        try {
          await member.voice.setChannel(
            targetChannel,
            `[MoveAll] Executed by ${interaction.member.user.username}#${interaction.member.user.discriminator}`
          );
        } catch (err) {}
      }

      return [
        {
          color: props.color.green,
          title: `**⚙️ ${state.locale.move.move}**`,
          description: `✅ **${cnt}${state.locale.move.moved}${fromChannel.name} ➡️ ${targetChannel.name}**`,
        },
      ];
    } catch (err) {
      createError('MoveAll', err, { interaction: interaction });
    }
  },
};

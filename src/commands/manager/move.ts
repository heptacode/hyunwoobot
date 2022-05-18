import { client } from '@/app';
import { checkPermission } from '@/modules/checkPermission';
import { createError } from '@/modules/createError';
import { props } from '@/props';
import { Command, Locale, State } from '@/types';
import { APIApplicationCommandOption } from 'discord-api-types/v10';
import { CommandInteraction, Guild, GuildMember, VoiceChannel } from 'discord.js';

export const move: Command = {
  name: 'move',
  version: 4,
  options(locale: Locale): APIApplicationCommandOption[] {
    return [
      {
        type: 6,
        name: 'user',
        description: locale.user,
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
      const member: GuildMember = guild.members.resolve(interaction.options[0].value);
      const targetChannel: VoiceChannel = guild.channels.resolve(
        interaction.options[1].value
      ) as VoiceChannel;
      const prevChannel: string = member.voice.channel.name;

      if (targetChannel.type !== 'GUILD_VOICE' && targetChannel.type !== 'GUILD_STAGE_VOICE')
        return [
          {
            color: props.color.red,
            title: `**⚙️ ${state.locale.move.move}**`,
            description: `❌ **${state.locale.notVoiceChannel}**`,
          },
        ];

      await member.voice.setChannel(
        targetChannel,
        `[Move] Executed by ${interaction.member.user.username}#${interaction.member.user.discriminator}`
      );

      return [
        {
          color: props.color.green,
          title: `**⚙️ ${state.locale.move.move}**`,
          description: `✅ **1${state.locale.move.moved}${prevChannel} ➡️ ${targetChannel.name}**`,
        },
      ];
    } catch (err) {
      createError('Move', err, { interaction: interaction });
    }
  },
};

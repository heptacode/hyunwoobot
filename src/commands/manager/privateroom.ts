import { client } from '@/app';
import { checkPermission } from '@/modules/checkPermission';
import { createError } from '@/modules/createError';
import { props } from '@/props';
import { firestore } from '@/services/firebase.service';
import { Command, Locale, State } from '@/types';
import { APIApplicationCommandOption } from 'discord-api-types/v10';
import { CommandInteraction, Guild } from 'discord.js';

export const privateroom: Command = {
  name: 'privateroom',
  version: 2,
  options(locale: Locale): APIApplicationCommandOption[] {
    return [
      {
        type: 7,
        name: 'fallback_voice_channel',
        description: locale.voiceChannel,
        required: false,
      },
    ];
  },
  async execute(state: State, interaction: CommandInteraction) {
    try {
      if (await checkPermission(state.locale, { interaction: interaction }, 'MANAGE_CHANNELS'))
        throw new Error('Missing Permissions');

      if (
        interaction.options &&
        client.channels.resolve(interaction.options[0].value).type !== 'GUILD_VOICE'
      )
        return [
          {
            color: props.color.red,
            title: `**⚙️ ${state.locale.privateRoom.privateRoom}**`,
            description: `❌ **${state.locale.notVoiceChannel}**`,
          },
        ];

      const guild: Guild = client.guilds.resolve(interaction.guildId);

      const privateRoomID = (
        await guild.channels.create(state.locale.privateRoom.create, {
          type: 'GUILD_VOICE',
          userLimit: 1,
          permissionOverwrites: [
            {
              type: 'member',
              id: client.user.id,
              allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'CONNECT', 'MOVE_MEMBERS'],
            },
            {
              type: 'role',
              id: guild.roles.everyone.id,
              deny: ['CREATE_INSTANT_INVITE', 'SPEAK'],
            },
          ],
        })
      ).id;

      await firestore
        .collection(guild.id)
        .doc('config')
        .update({
          privateRoom: {
            generator: privateRoomID,
            fallback: interaction.options ? interaction.options[0].value : null,
          },
        });

      return [
        {
          color: props.color.green,
          title: `**${state.locale.privateRoom.privateRoom}**`,
          description: `✅ **${state.locale.privateRoom.set}**`,
        },
      ];
    } catch (err) {
      createError('PrivateRoom', err, { interaction: interaction });
    }
  },
};

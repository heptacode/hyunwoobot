import { Interaction, TextChannel } from 'discord.js';
import { getHexFromEmoji } from '@/modules/converter';
import { createError } from '@/modules/createError';
import { firestore } from '@/services/firebase';
import { checkPermission } from '@/modules/checkPermission';
import { client } from '@/app';
import { Command, Locale, ReactionRole, State } from '@/types';

export const reactionrole: Command = {
  name: 'reactionrole',
  version: 1,
  options(locale: Locale) {
    return [
      {
        type: 1,
        name: 'view',
        description: `${locale.manager} ${locale.reactionRole.options.view}`,
      },
      {
        type: 1,
        name: 'add',
        description: `${locale.manager} ${locale.reactionRole.options.add}`,
        options: [
          {
            type: 3,
            name: 'message_id',
            description: locale.messageID,
            required: true,
          },
          {
            type: 3,
            name: 'emoji',
            description: locale.emoji,
            required: true,
          },
          { type: 8, name: 'role', description: locale.role, required: true },
        ],
      },
      {
        type: 1,
        name: 'remove',
        description: `${locale.manager} ${locale.reactionRole.options.remove}`,
        options: [
          {
            type: 3,
            name: 'message_id',
            description: locale.messageID,
            required: true,
          },
          {
            type: 3,
            name: 'emoji',
            description: locale.emoji,
            required: true,
          },
        ],
      },
      {
        type: 1,
        name: 'purge',
        description: `${locale.manager} ${locale.reactionRole.options.purge}`,
      },
    ];
  },
  async execute(state: State, interaction: Interaction | any) {
    try {
      if (await checkPermission(state.locale, { interaction: interaction }, 'MANAGE_MESSAGES'))
        throw new Error('Missing Permissions');

      const guild = client.guilds.resolve(interaction.guildId);
      const channel = guild.channels.resolve(interaction.channelId) as TextChannel;

      const method = interaction.data.options[0].name;
      const messageID = interaction.data.options[0].options[0].value;
      const emoji = interaction.data.options[0].options[1].value;
      const role = interaction.data.options[0].options[2].value;

      const _message = await channel.messages.fetch(messageID);

      if (method === 'add') {
        try {
          await _message.react(emoji);

          state.reactionRoles.push({
            textChannel: channel.id,
            message: _message.id,
            emoji: getHexFromEmoji(emoji),
            role: role,
          });
          return await firestore
            .collection(guild.id)
            .doc(channel.id)
            .update({ reactionRoles: state.reactionRoles });
        } catch (err) {
          createError('ReactionRole > Add', err, { interaction: interaction });
        }
      } else if (method === 'remove') {
        try {
          const idx = state.reactionRoles.findIndex(
            (reactionRole: ReactionRole) => reactionRole.emoji === getHexFromEmoji(emoji)
          );
          if (idx === -1)
            throw createError('ReactionRole > Remove', 'ReactionRole Not Found', {
              interaction: interaction,
            });

          state.reactionRoles.splice(idx, 1);
          await firestore
            .collection(guild.id)
            .doc(channel.id)
            .update({ reactionRoles: state.reactionRoles });
          return await _message.reactions.cache.get(emoji).remove();
        } catch (err) {
          createError('ReactionRole > Remove', err, { interaction: interaction });
        }
      } else if (method === 'purge') {
        try {
          state.reactionRoles = [];
          await firestore.collection(guild.id).doc(channel.id).update({ reactionRoles: [] });
          return await _message.reactions.removeAll();
        } catch (err) {
          createError('ReactionRole > Purge', err, { interaction: interaction });
        }
      }
    } catch (err) {
      createError('ReactionRole', err, { interaction: interaction });
    }
  },
};

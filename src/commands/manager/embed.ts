import { checkPermission } from '@/modules/checkPermission';
import { getChannelId } from '@/modules/converter';
import { createError } from '@/modules/createError';
import { Command, State } from '@/types';
import { Message, MessageEmbed, TextChannel } from 'discord.js';

export const embed: Command = {
  name: 'embed',
  messageOnly: true,
  async execute(state: State, message: Message, args: string[]) {
    try {
      if (await checkPermission(state.locale, { message: message }, 'MANAGE_MESSAGES'))
        throw new Error('Missing Permissions');

      // replace(/\n/g, "\\n")
      const embed: MessageEmbed = JSON.parse(args.slice(1).join(' '));

      await (
        message.guild.channels.resolve(getChannelId(message.guild, args[0])) as TextChannel
      ).send({ embeds: [embed] });
      return message.react('✅');
    } catch (err) {
      message.react('❌');
      createError('Embed', err, { message: message });
    }
  },
};

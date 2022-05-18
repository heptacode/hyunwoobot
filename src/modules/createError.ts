import {
  Guild,
  GuildMember,
  GuildResolvable,
  Interaction,
  Message,
  PartialMessage,
} from 'discord.js';
import { log } from './logger';
import { client } from '@/app';
import { props } from '@/props';

export const createError = async (
  location: string,
  body: string | Error,
  ref?: {
    guild?: GuildResolvable;
    message?: Message | PartialMessage;
    interaction?: Interaction;
    member?: GuildMember;
  }
) => {
  try {
    let guild: Guild;
    if (ref) {
      if (ref.guild) guild = client.guilds.resolve(ref.guild);
      else if (ref.message) guild = ref.message.guild;
      else if (ref.interaction) guild = client.guilds.resolve(ref.interaction.guildId);
      else if (ref.member) guild = ref.member.guild;

      if (ref.message) body += `\n\nOriginal Message: ${ref.message.content}`;
      else if (ref.interaction)
        body += `\n\nOriginal Interaction: ${JSON.stringify(ref.interaction)}`;
    }

    log.e(`${guild ? `${guild.name} > ` : ''}${location} > ${body}`);

    (await client.users.resolve(props.developerID).createDM()).send({
      embeds: [
        {
          author: {
            name: guild ? guild.name : null,
            iconURL: guild ? guild.iconURL() : null,
          },
          color: props.color.red,
          description: String(body),
          footer: { text: location },
          timestamp: new Date(),
        },
      ],
    });
  } catch (err) {
    log.e(`CreateError > ${err}`);
  }
};

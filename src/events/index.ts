import { client } from '@/app';
import { err } from './error';
import { guildCreate } from './guildCreate';
import { guildDelete } from './guildDelete';
import { guildMemberAdd } from './guildMemberAdd';
import { guildMemberRemove } from './guildMemberRemove';
import { interactionCreate } from './interactionCreate';
import { messageCreate } from './messageCreate';
import { messageDelete } from './messageDelete';
import { messageReactionAdd } from './messageReactionAdd';
import { messageReactionRemove } from './messageReactionRemove';
import { messageUpdate } from './messageUpdate';
import { ready } from './ready';
import { roleDelete } from './roleDelete';
import { roleUpdate } from './roleUpdate';
import { voiceStateUpdate } from './voiceStateUpdate';
import {
  Guild,
  GuildMember,
  Interaction,
  Message,
  MessageReaction,
  PartialMessage,
  Role,
  User,
  VoiceState,
} from 'discord.js';

client.on('error', async (error: Error) => err(error));
client.on('guildCreate', async (guild: Guild) => guildCreate(guild));
client.on('guildDelete', async (guild: Guild) => guildDelete(guild));
client.on('guildMemberAdd', async (member: GuildMember) => guildMemberAdd(member));
client.on('guildMemberRemove', async (member: GuildMember) => guildMemberRemove(member));
client.on('interactionCreate', async (interaction: Interaction | any) =>
  interactionCreate(interaction)
);
client.on('messageCreate', async (message: Message) => messageCreate(message));
client.on('messageDelete', async (message: Message | PartialMessage) => messageDelete(message));
client.on('messageReactionAdd', async (reaction: MessageReaction, user: User) =>
  messageReactionAdd(reaction, user)
);
client.on('messageReactionRemove', async (reaction: MessageReaction, user: User) =>
  messageReactionRemove(reaction, user)
);
client.on(
  'messageUpdate',
  async (oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage) =>
    messageUpdate(oldMessage, newMessage)
);
client.on('ready', async () => ready());
client.on('roleDelete', async (role: Role) => roleDelete(role));
client.on('roleUpdate', async (oldRole: Role, newRole: Role) => roleUpdate(oldRole, newRole));
client.on('voiceStateUpdate', async (oldState: VoiceState, newState: VoiceState) =>
  voiceStateUpdate(oldState, newState)
);

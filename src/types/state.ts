import { VoiceConnection } from '@discordjs/voice';
import { Collection } from 'discord.js';
import { AutoRole, Locale, PrivateRoom, ReactionRole, UserRole, VoiceRole } from '.';
import internal from 'stream';

export interface State {
  guildId: string;

  afkTimeout: number;
  afkChannel: Collection<string, NodeJS.Timeout>;
  alarmChannel: string | null;
  autoRoles: AutoRole[];
  locale: Locale;
  logChannel: string | null;
  logMessageEvents: boolean;
  mentionDebounce: NodeJS.Timeout;
  privateRoom: { generator?: string; fallback?: string };
  privateRooms: PrivateRoom[];
  reactionRoles: ReactionRole[];
  stream?: internal.Readable;
  timeout?: NodeJS.Timeout;
  userRoles: UserRole[];
  voiceRoles: VoiceRole[];

  connection: VoiceConnection;
  queue: {
    title: string;
    channelName: string;
    length: number;
    thumbnailURL: string;
    videoURL: string;
    requestedBy: { tag: string; avatarURL: string };
  }[];
  isLooped: boolean;
  isRepeated: boolean;
  isPlaying: boolean;
  volume: number;
}

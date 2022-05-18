import { AutoRole, PrivateRoom, ReactionRole, UserRole, VoiceRole } from '.';

export interface Config {
  afkTimeout: number;
  alarmChannel: string | null;
  autoRoles: AutoRole[];
  locale: string;
  logChannel: string | null;
  logMessageEvents: boolean;
  privateRoom: { generator: string | null; fallback: string | null };
  privateRooms: PrivateRoom[];
  reactionRoles: ReactionRole[];
  userRoles: UserRole[];
  voiceRoles: VoiceRole[];
}

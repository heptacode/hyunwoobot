export * from './api';
export * from './command';
export * from './config';
// export * from './interaction';
export * from './locale';
export * from './state';

export interface UserRole {
  id: string;
  name: string;
  color: string | null;
}

export interface PrivateRoom {
  host: string;
  text: string;
  room: string;
  waiting: string;
}

export type Args = Array<string>;

export interface AutoRole {
  type: string;
  role: string;
}

export interface ReactionRole {
  textChannel: string;
  message: string;
  emoji: string;
  role: string;
}

export interface VoiceRole {
  voiceChannel: string;
  role: string;
  textChannel?: string;
}

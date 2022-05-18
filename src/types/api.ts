import { Activity, PresenceStatus } from 'discord.js';
import { UserRole } from '.';

export interface APIUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: number;
  public_flags: number;
  flags: number;
  locale: string;
  mfa_enabled: boolean;
}

export interface APIGuild {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: number;
  features: string[];
  member: APIGuildMember;
  userRoles: UserRole[];
}

export interface APIGuildMember {
  displayName: string;
  displayHexColor: string;
  presence: APIGuildUserPresence;
  roles: string[];
}

export interface APIGuildUserPresence {
  activities: Array<Activity>;
  status: PresenceStatus;
}

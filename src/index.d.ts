import { Activity, Collection, PresenceStatus, VoiceConnection } from "discord.js";
import internal from "stream";

interface Locale {
  done: string;
  on: string;
  off: string;
  manager: string;
  scope: string;
  user: string;
  member: string;
  role: string;
  text: string;
  textChannel: string;
  voiceChannel: string;
  notTextChannel: string;
  notVoiceChannel: string;
  messageID: string;
  embed: string;
  emoji: string;
  minute: string;

  locale: {
    locale: string;
    code: string;
    name: string;
    noChange: string;
    pending: string;
    changed: string;
  };
  usage: {
    help: string;
    play: string;
    tts: string;
    volume: string;
    //
    alarm: string;
    autorole: string;
    delete: string;
    disconnect: string;
    disconnectall: string;
    edit: string;
    embed: string;
    locale: string;
    log: string;
    move: string;
    moveall: string;
    privateroom: string;
    reactionrole: string;
    setafktimeout: string;
    userrole: string;
    voicerole: string;
  };
  help: {
    help: string;
    description: string;
    description_manager: string;
    join: string;
    leave: string;
    loop: string;
    pause: string;
    play: string;
    queue: string;
    repeat: string;
    skip: string;
    stop: string;
    tts: string;
    volume: string;
    //
    alarm: string;
    autorole: string;
    delete: string;
    disconnect: string;
    disconnectall: string;
    edit: string;
    embed: string;
    locale: string;
    log: string;
    move: string;
    moveall: string;
    privateroom: string;
    reactionrole: string;
    setafktimeout: string;
    userrole: string;
    voicerole: string;
  };
  insufficientPerms: {
    manage_guild: string;
    manage_channels: string;
    manage_roles: string;
    manage_messages: string;
    move_members: string;
    connect: string;
  };

  afkTimeout: {
    afkTimeout: string;
    set: string;
    disconnected: string;
    disconnected_dm: string;
    countdownStarted: string;
    options: {
      minutesToDisconnect: string;
    };
  };
  alarm: {
    options: {
      subscribe: string;
      unsubscribe: string;
      test: string;
    };
  };
  autoRole: {
    autoRole: string;
    empty: string;
    roleAppended: string;
    options: {
      view: string;
      add: string;
      purge: string;
    };
  };
  delete: {
    deleted: string;
  };
  disconnect: {
    disconnect: string;
    disconnected: string;
  };
  log: {
    log: string;
    set: string;
    guildMemberAdd: string;
    guildMemberAdded: string;
    guildMemberRemove: string;
    guildMemberRemoved: string;
    messageEdit: string;
    messageDelete: string;
  };
  music: {
    joinVoiceChannel: string;
    currentlyPlaying: string;
    noResult: string;
    enqueued: string;
    nowPlaying: string;
    length: string;
    remaining: string;
    position: string;
    queue: string;
    queueEmpty: string;
    loopToggled: string;
    repeatToggled: string;
    noSongToSkip: string;
    skipped: string;
    volumeChanged: string;
    options: { query: string };
  };
  move: {
    move: string;
    moved: string;
  };
  privateRoom: {
    privateRoom: string;
    create: string;
    set: string;
    waitingRoom: string;
    waitingForMove: string;
    privateTextCreated: string;
  };
  reactionRole: {
    roleAppended: string;
    roleRemoved: string;
    options: {
      view: string;
      add: string;
      remove: string;
      purge: string;
    };
  };
  userRole: {
    userRole: string;
    empty: string;
    options: {
      view: string;
      add: string;
      remove: string;
      purge: string;
    };
  };
  voiceDisconnect: {
    notInVoiceChannel: string;
  };
  voiceRole: {
    voiceRole: string;
    updated: string;
    noChanges: string;
    empty: string;
    roleAppended: string;
    roleRemoved: string;
    options: {
      view: string;
      add: string;
      remove: string;
      purge: string;
      update: string;
      channelToSendLogs: string;
    };
  };
}

type InteractionType = /* Ping */ 1 | /* ApplicationCommand */ 2 | /* MessageComponent */ 3;

interface Interaction {
  version: number;
  type: InteractionType;
  token: string;
  id: string;
  guild_id: string;
  channel_id: string;
  member: {
    user: {
      username: string;
      public_flags: number;
      id: string;
      discriminator: string;
      avatar: string | null;
    };
    roles: string[];
    premium_since: Date | null;
    permissions: number;
    pending: boolean;
    nick: null;
    mute: boolean;
    joined_at: Date;
    is_pending: boolean;
    deaf: boolean;
  };
  data?: ApplicationCommandInteractionData;
}

interface ApplicationCommandInteractionData {
  id: string;
  name: string;
  resolved?: any;
  options?: ApplicationCommandInteractionDataOption[];
  custom_id: string;
  component_type: number;
}

interface ApplicationCommandInteractionDataOption {
  name: string;
  value?: string;
  options?: ApplicationCommandInteractionDataOption[];
}

interface InteractionResponse {
  type: InteractionResponseType;
  data: InteractionApplicationCommandCallbackData;
}

type InteractionResponseType = 1 | 4 | 5;

interface InteractionApplicationCommandCallbackData {
  tts?: boolean;
  content?: string;
  embeds?: any[];
  allowed_mentions?: any;
  flags?: number;
}

interface Command {
  id?: string;
  name: string;
  version: number;
  messageOnly?: boolean;
  options?: Function;
  execute?: Function;
  private?: boolean;
}

interface CommandOptions {
  type: CommandOptionType;
  name: string;
  description: string;
  required?: boolean;
  choices?: CommandOptionChoice[];
  options?: CommandOptions[];
}

type CommandOptionType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface CommandOptionChoice {
  name: string;
  value: number | string;
}

interface State {
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

interface Config {
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

interface UserRole {
  id: string;
  name: string;
  color: string | null;
}

interface PrivateRoom {
  host: string;
  text: string;
  room: string;
  waiting: string;
}

type Args = Array<string>;

interface AutoRole {
  type: string;
  role: string;
}

interface ReactionRole {
  textChannel: string;
  message: string;
  emoji: string;
  role: string;
}

interface VoiceRole {
  voiceChannel: string;
  role: string;
  textChannel?: string;
}

interface APIUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: number;
  public_flags: number;
  flags: number;
  locale: string;
  mfa_enabled: boolean;
}

interface APIGuild {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: number;
  features: string[];
  member: APIGuildMember;
  userRoles: UserRole[];
}

interface APIGuildMember {
  displayName: string;
  displayHexColor: string;
  presence: APIGuildUserPresence;
  roles: string[];
}

interface APIGuildUserPresence {
  activities: Array<Activity>;
  status: PresenceStatus;
}

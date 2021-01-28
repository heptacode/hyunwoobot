import { Collection, TextChannel, VoiceChannel, VoiceConnection } from "discord.js";

interface Locale {
  on: string;
  off: string;
  manager: string;
  scope: string;
  role: string;
  textChannel: string;
  voiceChannel: string;
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
    volume: string;
    //
    alarm: string;
    autorole: string;
    delete: string;
    disconnect: string;
    edit: string;
    embed: string;
    locale: string;
    log: string;
    move: string;
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
    volume: string;
    //
    alarm: string;
    autorole: string;
    delete: string;
    disconnect: string;
    edit: string;
    embed: string;
    locale: string;
    log: string;
    move: string;
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
    notVoiceChannel: string;
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
    notVoiceChannel: string;
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
  voiceDisconnect: {
    notInVoiceChannel: string;
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

type InteractionType = /* Ping */ 1 | /* ApplicationCommand */ 2;

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
  data?: CommandInteractionData;
}

interface CommandInteractionData {
  id: string;
  name: string;
  options: CommandInteractionDataOption[];
}

interface CommandInteractionDataOption {
  name: string;
  value?: string;
  options?: CommandInteractionDataOption[];
}

interface Command {
  name: string;
  version: number;
  messageOnly?: boolean;
  options?: Function;
  execute: Function;
}

type CommandOptionType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface CommandOptions {
  type: CommandOptionType;
  name: string;
  description: string;
  default?: boolean;
  required?: boolean;
  choices?: CommandOptionChoice[];
  options?: CommandOptions[];
}

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
  privateRoom: string | null;
  privateRooms: PrivateRoom[];
  reactionRoles: ReactionRole[];
  timeout: NodeJS.Timeout | null;
  userRoles: UserRole[];
  voiceRoles: VoiceRole[];

  textChannel: TextChannel;
  voiceChannel: VoiceChannel;
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
  autoroles: AutoRole[];
  locale: string;
  logChannel: string | null;
  logMessageEvents: boolean;
  privateRoom: string | null;
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

interface APIGuild {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: number;
  features: string[];
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

interface APIUserRole {
  id: string;
  name: string;
  color: string | null;
}

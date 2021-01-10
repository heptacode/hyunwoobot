import { Collection, Guild, GuildMember, MessageEmbedOptions, StreamDispatcher, TextChannel, VoiceChannel, VoiceConnection } from "discord.js";

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
    voicerole: string;
  };
  usage: {
    help: string;
    volume: string;
    //
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
    countdownStarted: string;
    options: {
      minutesToDisconnect: string;
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
  voiceRole: {
    voiceRole: string;
    empty: string;
    roleAppended: string;
    roleRemoved: string;
    options: {
      view: string;
      add: string;
      remove: string;
      purge: string;
      channelToSendLogs: string;
    };
  };
}

type InteractionType = 1 | 2;

interface Interaction {
  id: string;
  type: InteractionType;
  data?: CommandInteractionData;
  guild_id: string;
  channel_id: string;
  member: GuildMember;
  token: string;
  version: number;
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
  locale: Locale;
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
  timeout: NodeJS.Timeout;
  afkChannel: Collection<string, NodeJS.Timeout>;
}

interface Config {
  afkTimeout: number;
  autorole?: AutoRole[];
  locale: string;
  log?: string;
  privateRoom?: string;
  privateRooms?: PrivateRoom[];
  voiceRole?: VoiceRole[];
}

interface PrivateRoom {
  host: string;
  text: string;
  room: string;
  waiting: string;
}

type Args = Array<string>;

interface AlarmDB {
  voiceChannel?: VoiceChannel;
  connection?: VoiceConnection;
}

interface AutoRole {
  type: string;
  role: string;
}

interface ReactionRole {
  message: string;
  emoji: string;
  role: string;
}

interface VoiceRole {
  voiceChannel: string;
  role: string;
  textChannel?: string;
}

interface LogPayload {
  guild: Guild;
  embed?: MessageEmbedOptions;
}

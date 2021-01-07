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

  locale: {
    locale: string;
    code: string;
    name: string;
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
    playlist: string;
    repeat: string;
    skip: string;
    stop: string;
    volume: string;
    //
    autorole: string;
    delete: string;
    disconnectall: string;
    edit: string;
    embed: string;
    locale: string;
    log: string;
    moveall: string;
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
    disconnectall: string;
    edit: string;
    embed: string;
    locale: string;
    log: string;
    moveall: string;
    reactionrole: string;
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
    set: string;
    kicked: string;
    options: {
      minutesToKick: string;
    };
  };
  autoRole: {
    autoRole: string;
    empty: string;
    options: {
      view: string;
      add: string;
      purge: string;
    };
  };
  delete: {
    deleted: string;
    invalidAmount: string;
  };
  voiceConnect: {
    joinToConnect: string;
  };
  voiceDisconnect: {
    notInVoiceChannel: string;
    leave: string;
    timeout: string;
  };
  loop: {
    joinToToggle: string;
    toggled: string;
  };
  music: {
    currentlyPlaying: string;
    private: string;
    ageRestricted: string;
    urlInvalid: string;
    enqueued: string;
    nowPlaying: string;
    length: string;
    playlist: string;
    remaining: string;
    position: string;
    empty: string;
    notExists: string;
  };
  reactionRole: {
    options: {
      view: string;
      add: string;
      remove: string;
      purge: string;
    };
  };
  repeat: {
    joinToToggle: string;
    toggled: string;
  };
  skip: {
    joinToSkip: string;
    noSongToSkip: string;
    skipped: string;
  };
  stop: {
    joinToStop: string;
    notNow: string;
  };
  volume: {
    joinToChange: string;
    currentVolume: string;
    invalid: string;
    changed: string;
  };
  log: {
    log: string;
    set: string;
  };
  privateRoom: {
    privateRoom: string;
    create: string;
    waitingRoom: string;
    waitingForMove: string;
  };
  voiceRole: {
    voiceRole: string;
    empty: string;
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
  dispatcher: StreamDispatcher;
  playlist: {
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

interface LogData {
  guild: Guild;
  embed?: MessageEmbedOptions;
}

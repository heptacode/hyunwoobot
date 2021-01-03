import { Guild, MessageEmbedOptions, StreamDispatcher, TextChannel, VoiceChannel, VoiceConnection } from "discord.js";

interface Locale {
  locale: string;
  // Default
  on: string;
  off: string;
  // help
  help: string;
  help_manager: string;
  helpDesc: string;
  helpDesc_manager: string;
  help_join: string;
  help_leave: string;
  help_locale: string;
  help_loop: string;
  help_pause: string;
  help_play: string;
  help_playlist: string;
  help_repeat: string;
  help_skip: string;
  help_stop: string;
  help_volume: string;
  // help_manager
  help_autorole: string;
  help_delete: string;
  help_edit: string;
  help_embed: string;
  help_log: string;
  help_reactionrole: string;
  help_voice: string;
  // Main
  denyDM: string;
  // autorole
  autoRole: string;
  autoRole_empty: string;
  autoRole_usage: string;
  // delete
  delete: string;
  invalidAmount: string;
  // edit
  edit_usage: string;
  // embed
  embed_usage: string;
  // voiceConnect
  joinToConnect: string;
  // voiceDisconnect
  notInVoiceChannel: string;
  leave: string;
  disconnectTimeout: string;
  // locale
  changeLocale: string;
  // loop
  joinToToggleLoop: string;
  toggleLoop: string;
  // play
  currentlyPlaying: string;
  videoPrivate: string;
  videoAgeRestricted: string;
  urlInvalid: string;
  enqueued: string;
  nowPlaying: string;
  length: string;
  remaning: string;
  position: string;
  // playlist
  playlist: string;
  playlistEmpty: string;
  playlistNotExists: string;
  // repeat
  joinToToggleRepeat: string;
  toggleRepeat: string;
  // skip
  joinToSkip: string;
  noSongToSkip: string;
  skipped: string;
  // stop
  joinToStop: string;
  stopNotNow: string;
  // volume
  joinToChangeVolume: string;
  currentVolume: string;
  invalidVolume: string;
  changeVolume: string;
  // log
  log: string;
  log_set: string;
  // reactionRole
  reactionrole_usage: string;
  // voice
  voiceRole: string;
  voiceRole_empty: string;
  voiceRole_usage: string;

  // Permissions
  insufficientPerms_manage_channels: string;
  insufficientPerms_manage_roles: string;
  insufficientPerms_manage_messages: string;
  insufficientPerms_connect: string;

  // Error
  err_cmd: string;
  err_task: string;
}

interface Command {
  name: string;
  aliases?: string[];
  execute: Function;
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
  [message: string]: ReactionRoleItem[];
}

interface ReactionRoleItem {
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

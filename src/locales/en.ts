import { Locale } from "..";

const locale_en: Locale = {
  // Default
  on: "ON",
  off: "OFF",
  // Main
  denyDM: "❌ I can't execute that command inside DMs!",
  // delete
  delete: " Messages have been deleted.",
  invalidAmount: "❌ Please enter a valid amount: 2 ~ 100",
  // help
  help: "Help",
  helpDesc: "List of commands and descriptions you can use.",
  // voiceConnect
  joinToConnect: "💡 To play music, join a voice channel!",
  // voiceDisconnect
  notInVoiceChannel: "🚫 I'm currently not in a voice channel!",
  leave: "🚪 Disconnected from voice channel.",
  disconnectTimeout: "🚪 Disconnected from voice channel due to inactivity.",
  // locale
  changeLocale: "✅ Locale changed to ",
  // loop
  joinToToggleLoop: "💡 To toggle loop, join a voice channel!",
  toggleLoop: "✅ Loop Toggled ",
  // play
  currentlyPlaying: "💿 Currently playing a song.",
  videoPrivate: "🔒 This video is private!",
  videoAgeRestricted: "🔞 This video is age restricted!",
  urlInvalid: "🚫 Your URL is invalid!",
  enqueued: "Enqueued",
  nowPlaying: "Now Playing",
  length: "Length",
  remaning: "Songs Remaning",
  position: "Position in Playlist",
  // playlist
  playlist: "💿 Playlist",
  playlistEmpty: "🗑 Playlist is empty.",
  playlistNotExists: "❌ Playlist not exists.",
  // repeat
  joinToToggleRepeat: "💡 To toggle repeat, join a voice channel!",
  toggleRepeat: "✅ Repeat Toggled ",
  // skip
  joinToSkip: "💡 To skip a music, join a voice channel!",
  noSongToSkip: "❌ There is no song that I could skip!",
  skipped: "⏩ Skipped",
  // stop
  joinToStop: "💡 To stop music, join a voice channel!",
  stopNotNow: "💡 You can't use it right now!",
  // volume
  joinToChangeVolume: "💡 To change the volume, join a voice channel!",
  currentVolume: "🔈 Current Volume is: ",
  invalidVolume: "❌ Please enter a valid value: 0 ~ 10",
  changeVolume: "🔈 Volume changed! Your new volume will be applied for future songs.",
  // log
  log: "📦 Logging",
  log_set: "Log channel set to: ",
  // voice
  voiceRole: "⚙️ Voice Channel Roles",
  voiceRole_empty: "No roles have been set.",

  // Permissions
  insufficientPerms_manage_channels: "🚫 You don't have permission to manage channels!",
  insufficientPerms_manage_messages: "🚫 You don't have permission to manage messages!",
  insufficientPerms_connect: "🚫 Insufficient permissions! (Required permissions : [Connect], [Speak])",

  // Error
  err_cmd: "❌ An error occured while performing the command.",
  err_task: "❌ An error occured while performing the task.",
};

export default locale_en;

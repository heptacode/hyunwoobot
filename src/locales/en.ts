import { Locale } from "../";

export default {
  locale: "en",
  // Default
  on: "ON",
  off: "OFF",
  // help
  help: "Help",
  help_manager: "Help [Manager]",
  helpDesc: "List of commands and descriptions you can use.\n(For manager commands, add [manager] for an argument)\n<Required> [Optional]",
  helpDesc_manager: "List of commands and descriptions which managers can use.\n<Required> [Optional]",
  help_join: "Join a voice channel you are in",
  help_leave: "Unbind from a voice channel you are in",
  help_locale: "Change the default locale for the server",
  help_loop: "Toggle loop for the playlist",
  help_pause: "Pause the song",
  help_play: "Play/Enqueue a music",
  help_playlist: "Show playlist",
  help_repeat: "Toggle repeat",
  help_skip: "Skip current music",
  help_stop: "Stop the music",
  help_volume: "Change the volume",
  // help_manager
  help_autorole: "Give roles when a member/bot joins the server",
  help_delete: "Bulk Delete Messages",
  help_edit: "Edit a previous message that I sent",
  help_embed: "Create an embed",
  help_log: "Set a text channel for logging",
  help_reactionrole: "Add/Remove a reaction role",
  help_voice: "Give a role when someone joins a voice channel",
  // Main
  denyDM: "❌ I can't execute that command inside DMs!",
  // autorole
  autoRole: "⚙️ Auto Roles",
  autoRole_empty: "No roles have been set.",
  autoRole_usage: "💡 Correct arguments: <add|reset> [user|bot] [role]",
  // delete
  delete: " Messages have been deleted.",
  invalidAmount: "❌ Please enter a valid amount: 2 ~ 100",
  // edit
  edit_usage: "💡 Correct arguments: <channelID> <messageID> <messageEmbed>",
  // embed
  embed_usage: "💡 Correct arguments: <channelID> <messageEmbed>",
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
  // privateRoom
  privateRoom: "Private Room",
  privateRoom_create: "Create Private Room",
  privateRoom_waiting: "Waiting Room",
  privateRoom_waitingForMove: " is Waiting for Move",
  // reactionRole
  reactionrole_usage: "💡 Correct Arguments: <add|remove|purge> <textChannelID> <messageID> [emoji] [role]",
  // voice
  voiceRole: "⚙️ Voice Channel Roles",
  voiceRole_empty: "No roles have been set.",
  voiceRole_usage: "💡 Correct Arguments: <add|remove> <voiceChannelID> <role> [textChannelID]",

  // Permissions
  insufficientPerms_manage_channels: "🚫 You don't have permission to manage channels!",
  insufficientPerms_manage_roles: "🚫 You don't have permission to manage roles!",
  insufficientPerms_manage_messages: "🚫 You don't have permission to manage messages!",
  insufficientPerms_connect: "🚫 Insufficient permissions! (Required permissions : [Connect], [Speak])",

  // Error
  err_cmd: "❌ An error occured while performing the command.",
  err_task: "❌ An error occured while performing the task.",
} as Locale;

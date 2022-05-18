export interface Locale {
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
    administrator: string;
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

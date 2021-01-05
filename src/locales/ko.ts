import { Locale } from "../";

export default {
  locale: "ko",
  // Default
  on: "켜졌어요.",
  off: "꺼졌어요.",
  // help
  help: "도움말",
  help_manager: "도움말 [관리자]",
  helpDesc: "사용 가능한 명령어와 도움말 목록이예요!\n(관리자 명령어를 보려면 [manager]를 인자로 붙여주세요)\n<필수 인자> [선택적 인자]",
  helpDesc_manager: "관리자가 사용 가능한 명령어와 도움말 목록이예요!\n<필수 인자> [선택적 인자]",
  help_join: "음성 채널에 접속시키기",
  help_leave: "음성 채널에서 내보내기",
  help_locale: "서버의 기본 언어 설정",
  help_loop: "플레이리스트 반복 재생 활성화/비활성화",
  help_pause: "재생 중인 노래 일시중지",
  help_play: "노래 재생/대기열에 추가",
  help_playlist: "플레이리스트 보여주기",
  help_repeat: "한 곡 반복 활성화/비활성화",
  help_skip: "재생 중인 곡 건너뛰기",
  help_stop: "재생 중인 곡 중지하기",
  help_volume: "음량 변경하기",
  // help_manager
  help_autorole: "서버에 접속하는 멤버/봇에게 자동 역할 부여",
  help_delete: "메시지 일괄 삭제",
  help_edit: "메시지 수정",
  help_embed: "임베드 만들기",
  help_log: "로그 채널 설정하기",
  help_reactionrole: "이모지 반응에 따른 역할 부여",
  help_voice: "음성 채널 접속자에게 역할 부여",
  // Main
  denyDM: "❌ DM에서는 이 기능을 사용할 수 없어요.",
  // autorole
  autoRole: "⚙️ 자동 역할",
  autoRole_empty: "설정된 역할이 없어요.",
  autoRole_usage: "💡 올바른 인자값: <add|reset> [user|bot] [역할]",
  // delete
  delete: "개의 메시지를 삭제했어요!",
  invalidAmount: "❌ 2 ~ 100 사이의 올바른 값을 입력해주세요",
  // edit
  edit_usage: "💡 올바른 인자값: <채팅채널ID> <메시지ID> <임베드>",
  // embed
  embed_usage: "💡 올바른 인자값: <채팅채널ID> <임베드>",
  // voiceConnect
  joinToConnect: "💡 음악을 재생하려면 음성 채널에 접속해주세요!",
  // voiceDisconnect
  notInVoiceChannel: "🚫 저는 지금 음성 채널에 있지 않아요!",
  leave: "🚪 채널에서 나왔어요.",
  disconnectTimeout: "🚪 장시간 대기열이 비어있어 채널에서 나왔어요.",
  // locale
  changeLocale: "✅ 언어가 변경됐어요: ",
  // loop
  joinToToggleLoop: "💡 반복 재생을 켜거나 끄려면 음성 채널에 접속해주세요!",
  toggleLoop: "✅ 반복 재생이 ",
  // play
  currentlyPlaying: "💿 현재 재생중인 곡이 있어요.",
  videoPrivate: "🔒 이 비디오는 비공개예요.",
  videoAgeRestricted: "🔞 이 비디오는 연령제한이 있어요.",
  urlInvalid: "🚫 URL이 올바르지 않아요.",
  enqueued: "추가됨",
  nowPlaying: "현재 재생중",
  length: "길이",
  remaning: "남은 곡",
  position: "재생까지 남은 곡",
  // playlist
  playlist: "💿 플레이리스트",
  playlistEmpty: "🗑 플레이리스트가 비어있어요.",
  playlistNotExists: "❌ 플레이리스트가 존재하지 않아요.",
  // repeat
  joinToToggleRepeat: "💡 1곡 반복 재생을 켜거나 끄려면 음성 채널에 접속해주세요!",
  toggleRepeat: "✅ 1곡 반복 재생이 ",
  // skip
  joinToSkip: "💡 재생중인 곡을 건너뛰려면 음성 채널에 접속해주세요!",
  noSongToSkip: "❌ 건너뛸 곡이 없어요!",
  skipped: "⏩ 건너뛰었어요!",
  // stop
  joinToStop: "💡 재생을 중단하려면 음성 채널에 접속해주세요!",
  stopNotNow: "💡 지금은 사용할 수 없어요!",
  // volume
  joinToChangeVolume: "💡 음량을 변경하려면 음성 채널에 접속해주세요!",
  currentVolume: "🔈 현재 음량 : ",
  invalidVolume: "❌ 0 ~ 10 사이의 올바른 값을 입력해주세요.",
  changeVolume: "🔈 음량이 변경됐어요. 새로운 음량은 다음 곡부터 적용돼요.",
  // log
  log: "📦 로그",
  log_set: "로그 채널이 변경됐어요: ",
  // privateRoom
  privateRoom: "개인방",
  privateRoom_create: "개인방 만들기",
  privateRoom_waiting: "대기실",
  privateRoom_waitingForMove: "님이 개인방 대기실에 입장하여 이동을 기다리고 있습니다.",
  // reactionRole
  reactionrole_usage: "💡 올바른 인자값: <add|remove|purge> <채팅채널ID> <메시지ID> [이모지] [역할]",
  // voice
  voiceRole: "⚙️ 음성 채널 역할",
  voiceRole_empty: "설정된 역할이 없어요.",
  voiceRole_usage: "💡 올바른 인자값: <add|remove> <음성채널ID> <역할> [채팅채널ID]",

  // Permissions
  insufficientPerms_manage_channels: "🚫 채널을 관리할 수 있는 권한이 없습니다.",
  insufficientPerms_manage_roles: "🚫 역할을 관리할 수 있는 권한이 없습니다.",
  insufficientPerms_manage_messages: "🚫 메시지를 관리할 수 있는 권한이 없습니다.",
  insufficientPerms_connect: "🚫 저에게 다음 권한을 부여해주세요: [연결], [말하기]",

  // Error
  err_cmd: "❌ 오류가 발생했어요.",
  err_task: "❌ 오류가 발생했어요.",
} as Locale;

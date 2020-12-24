import { Locale } from "../";

const locale_ko: Locale = {
  // Default
  on: "켜졌어요.",
  off: "꺼졌어요.",
  // Main
  denyDM: "❌ DM에서는 이 기능을 사용할 수 없어요.",
  // delete, edit, embed
  delete: "개의 메시지를 삭제했어요!",
  invalidAmount: "❌ 2 ~ 100 사이의 올바른 값을 입력해주세요",
  // help
  help: "도움말",
  helpDesc: "사용 가능한 명령어와 도움말 목록이예요!",
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
  // voice
  voiceRole: "⚙️ 음성 채널 역할",
  voiceRole_empty: "설정된 역할이 없습니다.",

  // Permissions
  insufficientPerms_manage_channels: "🚫 채널을 관리할 수 있는 권한이 없습니다.",
  insufficientPerms_manage_messages: "🚫 메시지를 관리할 수 있는 권한이 없습니다.",
  insufficientPerms_connect: "🚫 저에게 다음 권한을 부여해주세요: [연결], [말하기]",

  // Error
  err_cmd: "❌ 오류가 발생했어요.",
  err_task: "❌ 오류가 발생했어요.",
};

export default locale_ko;

import { Credentials, Polly } from "aws-sdk";
import { log } from "../modules/logger";
import { voiceConnect, voiceStateCheck } from "../modules/voiceManager";
import { Interaction, Locale, State } from "../";
import { PassThrough } from "stream";
import "dotenv/config";

new Credentials(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);

const polly = new Polly({
  region: "ap-northeast-2",
});

export default {
  name: "tts",
  version: 1,
  options(locale: Locale) {
    return [
      {
        type: 3,
        name: "text",
        description: locale.text,
        required: true,
      },
    ];
  },
  async execute(state: State, interaction: Interaction) {
    try {
      if (state.isPlaying || (await voiceStateCheck(state.locale, { interaction: interaction }))) return;

      if (!state.connection) await voiceConnect(state, interaction);

      polly.synthesizeSpeech(
        {
          OutputFormat: "mp3",
          SampleRate: "16000",
          Text: `${interaction.member.user.username}님의 메시지입니다. ${interaction.data.options[0].value}`,
          TextType: "text",
          VoiceId: "Seoyeon",
        },
        (err, data) => {
          if (err) return log.e(`TTS > ${err.code}`);
          if (data.AudioStream instanceof Buffer) {
            state.connection.play("https://discord.com/assets/dd920c06a01e5bb8b09678581e29d56f.mp3");
            const stream = new PassThrough();
            stream.end(data.AudioStream);
            setTimeout(() => state.connection.play(stream), 400);
            state.connection.dispatcher.setVolume(0.3);
          }
        }
      );
    } catch (err) {
      log.e(`TTS > ${err}`);
    }
  },
};

import { client } from "../app";
import { Credentials, Polly } from "aws-sdk";
import { log } from "../modules/logger";
import { voiceConnect, voiceStateCheck } from "../modules/voiceManager";
import { resolve } from "path";
import { PassThrough } from "stream";
import "dotenv/config";
import { Interaction, Locale, State } from "../";

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
      if (state.isPlaying || interaction.data.options[0].value.length > 100 || (await voiceStateCheck(state.locale, { interaction: interaction }))) return;
      state.isPlaying = true;

      if (!state.connection) await voiceConnect(state, interaction);

      polly.synthesizeSpeech(
        {
          OutputFormat: "mp3",
          SampleRate: "16000",
          Text: `${client.guilds.resolve(interaction.guild_id).member(interaction.member.user.id).displayName}님의 메시지입니다. ${interaction.data.options[0].value}`,
          TextType: "text",
          VoiceId: "Seoyeon",
        },
        (err, data) => {
          if (err) return log.e(`TTS > ${err.code}`);
          if (data.AudioStream instanceof Buffer) {
            state.connection.play(resolve(__dirname, "../assets/message.mp3"));
            const stream = new PassThrough();
            stream.end(data.AudioStream);
            setTimeout(() => {
              state.connection.play(stream);
              state.connection.dispatcher.on("finish", () => (state.isPlaying = false));
            }, 400);
            state.connection.dispatcher.setVolume(0.25);
          }
        }
      );
    } catch (err) {
      log.e(`TTS > ${err}`);
    }
  },
};

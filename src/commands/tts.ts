import { client } from "../app";
import { Credentials, Polly } from "aws-sdk";
import { resolve } from "path";
import { PassThrough } from "stream";
import { sendEmbed } from "../modules/embedSender";
import { log } from "../modules/logger";
import { voiceConnect, voiceDisconnect, voiceStateCheck } from "../modules/voiceManager";
import props from "../props";
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
    const message = interaction.data.options[0].value.replace(/[^a-zA-Z가-힣0-9 \.,]/g, ``);
    if (message.length === 0) throw new Error();

    sendEmbed(
      { interaction: interaction },
      {
        color: props.color.purple,
        description: `💬 **${message}**`,
        timestamp: new Date(),
      },
      { guild: true }
    );

    if (state.isPlaying || interaction.data.options[0].value.length > 50 || (await voiceStateCheck(state.locale, { interaction: interaction }))) throw new Error();
    state.isPlaying = true;
    if (state.timeout) state.timeout = null;

    if (!state.connection) await voiceConnect(state, interaction);

    polly.synthesizeSpeech(
      {
        OutputFormat: "mp3",
        SampleRate: "16000",
        Text: `${client.guilds.resolve(interaction.guild_id).member(interaction.member.user.id).displayName}님의 메시지입니다. ${message}`,
        TextType: "text",
        VoiceId: "Seoyeon",
      },
      (err, data) => {
        if (err) {
          state.isPlaying = false;
          return log.e(`TTS > ${err.code}`);
        }
        if (data.AudioStream instanceof Buffer) {
          state.connection.play(resolve(__dirname, "../assets/message.mp3"));
          state.connection.dispatcher.setVolume(0.1);

          const stream = new PassThrough();
          stream.end(data.AudioStream);
          setTimeout(() => {
            state.connection.play(stream);

            state.connection.dispatcher.on("finish", () => {
              state.isPlaying = false;
              state.timeout = setTimeout(() => voiceDisconnect(state, interaction), 300000);
            });
          }, 400);
        }
      }
    );
  },
};

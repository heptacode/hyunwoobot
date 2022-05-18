import { client } from '@/app';
import { createError } from '@/modules/createError';
import { voiceConnect, voiceStateCheck } from '@/modules/voice';
import { props } from '@/props';
import { Command, Locale, State } from '@/types';
import { Credentials, Polly } from 'aws-sdk';
import { APIApplicationCommandOption } from 'discord-api-types/v10';
import { CommandInteraction } from 'discord.js';
import 'dotenv/config';
import { PassThrough } from 'stream';

new Credentials(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);

const polly = new Polly({
  region: 'ap-northeast-2',
});

export const tts: Command = {
  name: 'tts',
  version: 1,
  options(locale: Locale): APIApplicationCommandOption[] {
    return [
      {
        type: 3,
        name: 'text',
        description: locale.text,
        required: true,
      },
    ];
  },
  async execute(state: State, interaction: CommandInteraction) {
    const message = interaction.options[0].value.replace(/[^a-zA-Zㄱ-힣0-9 \.,]/g, ``);
    if (message.length === 0) throw new Error('Invalid Message');
    if (
      state.isPlaying ||
      interaction.options[0].value.length > 50 ||
      (await voiceStateCheck(state.locale, { interaction: interaction }))
    )
      throw new Error('Missing Permissions');
    state.isPlaying = true;
    if (state.timeout) {
      clearTimeout(state.timeout);
      state.timeout = null;
    }
    if (!state.connection) await voiceConnect(state, interaction);
    polly.synthesizeSpeech(
      {
        OutputFormat: 'mp3',
        SampleRate: '16000',
        Text: `${
          client.guilds.resolve(interaction.guildId).members.resolve(interaction.member.user.id)
            .displayName
        }님의 메시지, ${message}`,
        TextType: 'text',
        VoiceId: 'Seoyeon',
      },
      (err, data) => {
        if (err) {
          state.isPlaying = false;
          createError('TTS', err, { interaction: interaction });
        }
        if (data.AudioStream instanceof Buffer) {
          // state.connection.play(resolve(__dirname, process.env.NODE_ENV === "production" ? "../../src/assets/message.mp3" : "../assets/message.mp3"));
          // state.connection.dispatcher.setVolume(0.1);
          const stream = new PassThrough();
          stream.end(data.AudioStream);
          setTimeout(() => {
            // state.connection.play(stream);
            // state.connection.dispatcher.on("finish", () => {
            //   state.isPlaying = false;
            //   if (state.timeout) clearTimeout(state.timeout);
            //   state.timeout = setTimeout(() => voiceDisconnect(state), props.disconnectTimeout);
            // });
          }, 400);
        }
      }
    );
    return [
      {
        color: props.color.purple,
        description: `💬 **${message}**`,
      },
    ];
  },
};

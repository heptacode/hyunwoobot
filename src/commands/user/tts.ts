import { client } from '@/app';
import { createError } from '@/modules/createError';
import { playResource, voiceConnect, voiceDisconnect, voiceStateCheck } from '@/modules/voice';
import { props } from '@/props';
import { Command, Locale, State } from '@/types';
import { AudioPlayerState, AudioPlayerStatus } from '@discordjs/voice';
import { Credentials, Polly } from 'aws-sdk';
import { APIApplicationCommandOption } from 'discord-api-types/v10';
import { CommandInteraction } from 'discord.js';
import 'dotenv/config';
import { resolve } from 'path';

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
    if (!state.connection) {
      await voiceConnect(state, interaction);
    }

    const pollyResult = await polly
      .synthesizeSpeech({
        OutputFormat: 'mp3',
        SampleRate: '16000',
        Text: `${
          client.guilds.resolve(interaction.guildId).members.resolve(interaction.member.user.id)
            .displayName
        }님의 메시지, ${message}`,
        TextType: 'text',
        VoiceId: 'Seoyeon',
      })
      .promise();

    if (pollyResult.$response.error) {
      state.isPlaying = false;
      return createError('TTS', pollyResult.$response.error, { interaction: interaction });
    }

    if (pollyResult.AudioStream instanceof Buffer) {
      await playResource(
        state,
        resolve(
          __dirname,
          process.env.NODE_ENV === 'production'
            ? '../../src/assets/message.mp3'
            : '../assets/message.mp3'
        ),
        0.1
      );

      await new Promise<void>((resolve, reject) => setTimeout(() => resolve(), 400));

      const resource = await playResource(state, pollyResult.AudioStream);
      // state.connection.playOpusPacket(pollyResult.AudioStream);

      // import { PassThrough } from 'stream';
      // const stream = new PassThrough();
      //       stream.end(pollyResult.AudioStream);

      resource.audioPlayer.on(
        'stateChange',
        async (oldState: AudioPlayerState, newState: AudioPlayerState) => {
          if (newState.status === AudioPlayerStatus.Idle) {
            state.isPlaying = false;
            if (state.timeout) clearTimeout(state.timeout);
            state.timeout = setTimeout(() => voiceDisconnect(state), props.disconnectTimeout);
          }
        }
      );
    }
    return [
      {
        color: props.color.purple,
        description: `💬 **${message}**`,
      },
    ];
  },
};

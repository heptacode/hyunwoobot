import { client } from '@/app';
import { createError } from '@/modules/createError';
import { sendEmbed } from '@/modules/sendEmbed';
import { voiceDisconnect } from '@/modules/voice';
import { props } from '@/props';
import { State } from '@/types';
import { joinVoiceChannel } from '@discordjs/voice';
import { CommandInteraction, StageChannel, VoiceChannel } from 'discord.js';

export async function voiceConnect(state: State, interaction: CommandInteraction) {
  try {
    const voiceChannel: VoiceChannel | StageChannel = client.guilds
      .resolve(interaction.guildId)
      .members.resolve(interaction.member.user.id).voice.channel;

    if (!voiceChannel) {
      return;
    } else if (!voiceChannel.permissionsFor(client.user).has(['CONNECT', 'SPEAK'])) {
      sendEmbed(
        { interaction: interaction },
        {
          color: props.color.red,
          description: `❌ **${state.locale.insufficientPerms.connect}**`,
        },
        { guild: true }
      );
      throw new Error('Missing Permissions');
    }

    state.connection = await joinVoiceChannel({
      guildId: interaction.guildId,
      channelId: voiceChannel.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    if (state.timeout) {
      clearTimeout(state.timeout);
    }
    state.timeout = setTimeout(() => voiceDisconnect(state), props.disconnectTimeout);
  } catch (err) {
    createError('VoiceConnect', err, { interaction: interaction });
  }
}

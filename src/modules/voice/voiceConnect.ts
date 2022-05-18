import { joinVoiceChannel, DiscordGatewayAdapterCreator } from '@discordjs/voice';
import { createError } from '@/modules/createError';
import { sendEmbed } from '@/modules/embedSender';
import { client } from '@/app';
import { props } from '@/props';
import { CommandInteraction, State, StageChannel, VoiceChannel } from '@/types';
import { voiceDisconnect } from '@/modules/voice';

export async function voiceConnect(state: State, interaction: CommandInteraction) {
  try {
    const voiceChannel: VoiceChannel | StageChannel = client.guilds
      .resolve(interaction.guildId)
      .members.resolve(interaction.member.user.id).voice.channel;

    if (!voiceChannel) return;
    else if (!voiceChannel.permissionsFor(client.user).has(['CONNECT', 'SPEAK'])) {
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

    // state.connection = await voiceChannel.join();
    state.connection = await joinVoiceChannel({
      guildId: interaction.guildId,
      channelId: voiceChannel.id,
      adapterCreator: voiceChannel.guild
        .voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator,
    });
    // state.connection.voice.setSelfDeaf(false);

    if (state.timeout) clearTimeout(state.timeout);
    state.timeout = setTimeout(() => voiceDisconnect(state), props.disconnectTimeout);
  } catch (err) {
    createError('VoiceConnect', err, { interaction: interaction });
  }
}

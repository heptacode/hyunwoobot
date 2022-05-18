import { client } from '@/app';
import { sendEmbed } from '@/modules/sendEmbed';
import { props } from '@/props';
import { Locale } from '@/types';
import { CommandInteraction, Guild, Message } from 'discord.js';

export async function voiceStateCheck(
  locale: Locale,
  payload: { interaction?: CommandInteraction; message?: Message }
): Promise<boolean> {
  if (
    !client.guilds
      .resolve(payload.interaction ? payload.interaction.guildId : payload.message.guild.id)
      .members.resolve(
        payload.interaction ? payload.interaction.member.user.id : payload.message.member.id
      ).voice.channelId
  ) {
    const guild: Guild = client.guilds.resolve(
      payload.interaction ? payload.interaction.guildId : payload.message.guild.id
    );
    sendEmbed(payload, {
      color: props.color.red,
      author: {
        name: guild.name,
        iconURL: guild.iconURL(),
      },
      description: `❌ **${locale.music.joinVoiceChannel}**`,
    });
    return true;
  }
  return false;
}

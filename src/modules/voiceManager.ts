import { Guild, Message } from "discord.js";
import { sendEmbed } from "./embedSender";
import Log from "./logger";
import { client } from "../app";
import props from "../props";
import { Interaction, Locale, State } from "../";

export const voiceStateCheck = async (locale: Locale, payload: { interaction?: Interaction; message?: Message }): Promise<boolean> => {
  if (
    !client.guilds.cache
      .get(payload.interaction ? payload.interaction.guild_id : payload.message.guild.id)
      .members.cache.get(payload.interaction ? payload.interaction.member.user.id : payload.message.member.id).voice.channelID
  ) {
    sendEmbed(payload, {
      color: props.color.red,
      author: {
        name: client.guilds.cache.get(payload.interaction ? payload.interaction.guild_id : payload.message.guild.id).name,
        iconURL: client.guilds.cache.get(payload.interaction ? payload.interaction.guild_id : payload.message.guild.id).iconURL(),
      },
      description: `❌ **${locale.music.joinVoiceChannel}**`,
    });
    return true;
  }
  return false;
};

export const voiceConnect = async (state: State, interaction: Interaction) => {
  const guild: Guild = client.guilds.cache.get(interaction.guild_id);
  state.voiceChannel = guild.members.cache.get(interaction.member.user.id).voice.channel;

  try {
    if (!guild.members.cache.get(interaction.member.user.id).voice.channel.permissionsFor(client.user).has(["CONNECT", "SPEAK"]))
      return await sendEmbed({ interaction: interaction }, { description: `❌ **${state.locale.insufficientPerms.connect}**` }, { guild: true });

    if (state.voiceChannel) {
      state.connection = await state.voiceChannel.join();
      Log.d("VoiceConnect");
    }
  } catch (err) {
    Log.e(`VoiceConnect > ${err}`);
  }
};

export const voiceDisconnect = (state: State, interaction: Interaction) => {
  try {
    if (state.voiceChannel) {
      state.isPlaying = false;
      state.voiceChannel.leave();
      state.connection = null;
      state.voiceChannel = null;
    } else {
      return sendEmbed(
        { interaction: interaction },
        {
          color: props.color.red,
          description: `❌ **${state.locale.voiceDisconnect.notInVoiceChannel}**`,
        },
        { guild: true }
      );
    }
  } catch (err) {
    Log.e(`VoiceDisconnect > ${err}`);
  }
};

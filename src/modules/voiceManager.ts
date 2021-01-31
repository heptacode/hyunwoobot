import { Guild, Message } from "discord.js";
import { sendEmbed } from "./embedSender";
import { log } from "./logger";
import { client } from "../app";
import props from "../props";
import { Interaction, Locale, State } from "../";

export const voiceStateCheck = async (locale: Locale, payload: { interaction?: Interaction; message?: Message }): Promise<boolean> => {
  if (
    !client.guilds.resolve(payload.interaction ? payload.interaction.guild_id : payload.message.guild.id).member(payload.interaction ? payload.interaction.member.user.id : payload.message.member.id)
      .voice.channelID
  ) {
    const guild: Guild = client.guilds.resolve(payload.interaction ? payload.interaction.guild_id : payload.message.guild.id);
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
};

export const voiceConnect = async (state: State, interaction: Interaction) => {
  const guild: Guild = client.guilds.resolve(interaction.guild_id);
  state.voiceChannel = guild.member(interaction.member.user.id).voice.channel;

  try {
    if (!guild.member(interaction.member.user.id).voice.channel.permissionsFor(client.user).has(["CONNECT", "SPEAK"]))
      return sendEmbed({ interaction: interaction }, { description: `❌ **${state.locale.insufficientPerms.connect}**` }, { guild: true });

    if (state.voiceChannel) {
      state.connection = await state.voiceChannel.join();
      log.d("VoiceConnect");
    }
  } catch (err) {
    log.e(`VoiceConnect > ${err}`);
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
    log.e(`VoiceDisconnect > ${err}`);
  }
};

import { Guild, Message, VoiceChannel } from "discord.js";
import { createError } from "./createError";
import { sendEmbed } from "./embedSender";
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
  try {
    const voiceChannel: VoiceChannel = client.guilds.resolve(interaction.guild_id).member(interaction.member.user.id).voice.channel;

    if (!voiceChannel) return;
    else if (!voiceChannel.permissionsFor(client.user).has(["CONNECT", "SPEAK"])) {
      sendEmbed(
        { interaction: interaction },
        {
          color: props.color.red,
          description: `❌ **${state.locale.insufficientPerms.connect}**`,
        },
        { guild: true }
      );
      throw new Error("Missing Permissions");
    }

    state.connection = await voiceChannel.join();
    state.connection.voice.setSelfDeaf(false);

    if (state.timeout) clearTimeout(state.timeout);
    state.timeout = setTimeout(() => voiceDisconnect(state), props.disconnectTimeout);
  } catch (err) {
    createError("VoiceConnect", err, { interaction: interaction });
  }
};

export const voiceDisconnect = (state: State, interaction?: Interaction) => {
  try {
    if (!state.connection || !state.connection.voice) return;

    state.isPlaying = false;
    state.connection.voice.channel.leave();
    state.connection = null;
  } catch (err) {
    createError("VoiceDisconnect", err, { interaction: interaction });
  }
};

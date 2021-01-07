import { client } from "../app";
import { Interaction, State } from "../";
import ytdl from "ytdl-core";
import { getLength } from "./converter";
import { voiceConnect, voiceDisconnect } from "./voiceManager";
import Log from "./logger";
import { Message, TextChannel } from "discord.js";

export const stream = async (state: State, interaction: Interaction) => {
  try {
    const channel = client.guilds.cache.get(interaction.guild_id).channels.cache.get(interaction.channel_id) as TextChannel;

    if (!state.connection) await voiceConnect(state, interaction);

    try {
      state.dispatcher = state.connection.play(ytdl(state.playlist[0].videoURL), {
        // quality: "highestaudio",
        highWaterMark: 1 << 25,
      });

      state.dispatcher.setVolumeLogarithmic(state.volume / 5);

      state.dispatcher.on("start", () => {
        if (state.timeout) clearTimeout(state.timeout);
        state.isPlaying = true;
        channel.send({
          embed: {
            color: "#0099ff",
            author: {
              name: `${state.isLooped ? "🔁 " : ""}${state.isRepeated ? "🔂 " : ""}${state.locale.music.nowPlaying}`,
              iconURL: "https://firebasestorage.googleapis.com/v0/b/hyunwoo-bot.appspot.com/o/play.png?alt=media&token=38cc0c28-41b4-44aa-9f2f-0ad9c23859ab",
            },
            title: state.playlist[0].title,
            url: state.playlist[0].videoURL,
            description: state.playlist[0].channelName,
            thumbnail: { url: state.playlist[0].thumbnailURL },
            fields: [
              { name: state.locale.music.length, value: getLength(state.playlist[0].length), inline: true },
              { name: state.locale.music.remaining, value: state.playlist.length - 1, inline: true },
            ],
            footer: { text: state.playlist[0].requestedBy.tag, iconURL: state.playlist[0].requestedBy.avatarURL },
          },
        });
      });
      state.dispatcher.on("finish", async () => {
        try {
          state.isPlaying = false;
          if (state.playlist.length >= 1) {
            if (state.isRepeated) {
            } else if (state.isLooped) {
              state.playlist.push(state.playlist[0]);
              state.playlist.shift();
            } else {
              state.playlist.shift();
            }
            if (state.playlist.length >= 1) {
              stream(state, interaction);
            } else state.timeout = setTimeout(() => voiceDisconnect(state, interaction, true), 10000);
          } else {
            state.timeout = setTimeout(() => voiceDisconnect(state, interaction, true), 10000);
          }
        } catch (err) {
          Log.e(`Stream > 4 > ${err}`);
        }
      });
      state.dispatcher.on("error", (err) => {
        Log.e(`Stream > 3 > ${err}`);
      });
    } catch (err) {
      Log.e(`Stream > 2 > ${err}`);
    }
  } catch (err) {
    Log.e(`Stream > 1 > ${err}`);
  }
};

export const skip = async (state: State, interaction: Interaction) => {
  try {
    const guild = client.guilds.cache.get(interaction.guild_id);
    const channel = guild.channels.cache.get(interaction.channel_id) as TextChannel;
    const voiceChannel = guild.members.cache.get(interaction.member.user.id).voice.channel;
    if (!voiceChannel) {
      return channel.send(state.locale.skip.joinToSkip).then((_message: Message) => {
        _message.delete({ timeout: 5000 });
      });
    }

    if (state.playlist.length === 0) return channel.send(state.locale.skip.noSongToSkip);

    state.playlist.shift();

    state.dispatcher.end();

    return channel.send(state.locale.skip.skipped);
  } catch (err) {
    Log.e(`Skip > 1 > ${err}`);
  }
};

export const resume = async (state: State, interaction: Interaction) => {
  try {
    const guild = client.guilds.cache.get(interaction.guild_id);
    const channel = guild.channels.cache.get(interaction.channel_id) as TextChannel;
    const voiceChannel = guild.members.cache.get(interaction.member.user.id).voice.channel;

    if (!voiceChannel)
      return channel.send(state.locale.voiceConnect.joinToConnect).then((_message: Message) => {
        _message.delete({ timeout: 5000 });
      });

    state.dispatcher.resume();
    state.isPlaying = true;
  } catch (err) {
    Log.e(`Resume > 1 > ${err}`);
  }
};

export const pause = async (state: State, interaction: Interaction) => {
  const guild = client.guilds.cache.get(interaction.guild_id);
  const channel = guild.channels.cache.get(interaction.channel_id) as TextChannel;
  const voiceChannel = guild.members.cache.get(interaction.member.user.id).voice.channel;
  try {
    if (!voiceChannel) {
      return channel.send(state.locale.stop.joinToStop).then((_message: Message) => {
        _message.delete({ timeout: 5000 });
      });
    }

    state.dispatcher.pause(true);
    state.isPlaying = false;
  } catch (err) {
    channel.send(state.locale.stop.notNow);
    Log.e(`Pause > 1 > ${err}`);
  }
};

export const stop = (state: State, interaction: Interaction) => {
  const guild = client.guilds.cache.get(interaction.guild_id);
  const channel = guild.channels.cache.get(interaction.channel_id) as TextChannel;
  const voiceChannel = guild.members.cache.get(interaction.member.user.id).voice.channel;
  try {
    if (!voiceChannel) {
      return channel.send(state.locale.stop.joinToStop).then((_message: Message) => {
        _message.delete({ timeout: 5000 });
      });
    }

    state.dispatcher.pause(true);
    state.isPlaying = false;
  } catch (err) {
    channel.send(`${state.locale.stop.notNow}`);
    Log.e(`Stop > 1 > ${err}`);
  }
};

export const toggleLoop = (state: State, interaction: Interaction) => {
  const guild = client.guilds.cache.get(interaction.guild_id);
  const channel = guild.channels.cache.get(interaction.channel_id) as TextChannel;
  const voiceChannel = guild.members.cache.get(interaction.member.user.id).voice.channel;
  try {
    if (!voiceChannel) {
      return channel.send(state.locale.loop.joinToToggle).then((_message: Message) => {
        _message.delete({ timeout: 5000 });
      });
    }

    state.isLooped = !state.isLooped;

    return channel.send(`${state.locale.loop.toggled}${state.isLooped ? `${state.locale.on}` : `${state.locale.off}`}`);
  } catch (err) {
    Log.e(`ToggleLoop > 1 > ${err}`);
  }
};

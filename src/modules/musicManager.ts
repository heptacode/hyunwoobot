import { EmbedFieldData, Message, TextChannel } from "discord.js";
import { client } from "../app";
import ytdl from "ytdl-core";
import youtube from "scrape-youtube";
import { getLength } from "./converter";
import { sendEmbed } from "./embedSender";
import { voiceConnect, voiceDisconnect } from "./voiceManager";
import props from "../props";
import { Interaction, State } from "../";
import Log from "./logger";

export const play = async (state: State, interaction: Interaction) => {
  try {
    if (!interaction.data.options && state.queue.length !== 0) {
      if (!state.isPlaying) return stream(state, interaction);
      else
        return sendEmbed(
          { interaction: interaction },
          {
            color: props.color.cyan,
            description: `**${state.locale.music.currentlyPlaying}**`,
          },
          { guild: true }
        );
    } else if (!interaction.data.options && state.queue.length <= 0)
      return sendEmbed(
        { interaction: interaction },
        {
          color: props.color.red,
          description: `**${state.locale.music.empty}**`,
        },
        { guild: true }
      );

    const result = (await youtube.search(interaction.data.options[0].value, { type: "video" })).videos;
    if (result.length >= 1) {
      if (result.length === 1) {
        state.queue.push({
          title: result[0].title,
          channelName: result[0].channel.name,
          length: result[0].duration,
          thumbnailURL: result[0].thumbnail,
          videoURL: result[0].link,
          requestedBy: { tag: `${interaction.member.user.username}#${interaction.member.user.discriminator}`, avatarURL: client.users.cache.get(interaction.member.user.id).avatarURL() },
        });
      } else {
        // Query Search
        state.queue.push({
          title: result[0].title,
          channelName: result[0].channel.name,
          length: result[0].duration,
          thumbnailURL: result[0].thumbnail,
          videoURL: result[0].link,
          requestedBy: { tag: `${interaction.member.user.username}#${interaction.member.user.discriminator}`, avatarURL: client.users.cache.get(interaction.member.user.id).avatarURL() },
        });
        // return message.channel.send(locale.urlInvalid);
      }
      try {
        if (state.queue.length === 1) {
          return stream(state, interaction);
        } else {
          const fields: EmbedFieldData[] = [
            { name: state.locale.music.length, value: getLength(state.queue[state.queue.length - 1].length), inline: true },
            { name: state.locale.music.position, value: state.queue.length - 1, inline: true },
            { name: "\u200B", value: "─────────────────────" },
          ];
          for (const i in state.queue) {
            fields.push({ name: `#${i}`, value: state.queue[i].title });
          }
          fields.push({ name: "\u200B", value: `${state.isPlaying ? "▶️" : "⏹"}${state.isLooped ? " 🔁" : ""}${state.isRepeated ? " 🔂" : ""}` });

          return sendEmbed(
            { interaction: interaction },
            {
              color: props.color.cyan,
              author: { name: state.locale.music.enqueued, iconURL: props.icon.enqueue, url: props.bot.website },
              title: state.queue[state.queue.length - 1].title,
              url: state.queue[state.queue.length - 1].videoURL,
              description: state.queue[state.queue.length - 1].channelName,
              thumbnail: { url: state.queue[state.queue.length - 1].thumbnailURL },
              fields: fields,
            },
            { guild: true }
          );
        }
      } catch (err) {
        Log.e(`Play > 2 > ${err}`);
      }
    } else {
      return sendEmbed(
        { interaction: interaction },
        {
          color: props.color.red,
          description: `**${state.locale.music.noResult}**`,
        }
      );
    }
  } catch (err) {
    Log.e(`Play > 1 > ${err}`);
  }
};

const stream = async (state: State, interaction: Interaction) => {
  try {
    const channel = client.guilds.cache.get(interaction.guild_id).channels.cache.get(interaction.channel_id) as TextChannel;
    if (!state.connection) await voiceConnect(state, interaction);
    try {
      state.dispatcher = state.connection.play(ytdl(state.queue[0].videoURL), {
        // quality: "highestaudio",
        highWaterMark: 1 << 25,
      });

      state.dispatcher.setVolume(state.volume / 5);

      state.dispatcher.on("start", () => {
        if (state.timeout) clearTimeout(state.timeout);
        state.isPlaying = true;
        sendEmbed(
          { interaction: interaction },
          {
            color: props.color.red,
            description: `**${state.locale.music.noResult}**`,
          }
        );

        channel.send({
          embed: {
            color: "#0099ff",
            author: {
              name: `${state.isLooped ? "🔁 " : ""}${state.isRepeated ? "🔂 " : ""}${state.locale.music.nowPlaying}`,
              iconURL: props.icon.play,
            },
            title: state.queue[0].title,
            url: state.queue[0].videoURL,
            description: state.queue[0].channelName,
            thumbnail: { url: state.queue[0].thumbnailURL },
            fields: [
              { name: state.locale.music.length, value: getLength(state.queue[0].length), inline: true },
              { name: state.locale.music.remaining, value: state.queue.length - 1, inline: true },
            ],
            footer: { text: state.queue[0].requestedBy.tag, iconURL: state.queue[0].requestedBy.avatarURL },
          },
        });
      });
      state.dispatcher.on("finish", async () => {
        try {
          state.isPlaying = false;
          if (state.queue.length >= 1) {
            if (state.isRepeated) {
            } else if (state.isLooped) {
              state.queue.push(state.queue[0]);
              state.queue.shift();
            } else {
              state.queue.shift();
            }
            if (state.queue.length >= 1) {
              return stream(state, interaction);
            } else state.timeout = setTimeout(() => voiceDisconnect(state, interaction), 30000);
          } else {
            state.timeout = setTimeout(() => voiceDisconnect(state, interaction), 30000);
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

    if (!voiceChannel) return channel.send(state.locale.music.joinVoiceChannel).then((_message: Message) => _message.delete({ timeout: 5000 }));
    else if (state.queue.length === 0) return channel.send(state.locale.skip.noSongToSkip).then((_message: Message) => _message.delete({ timeout: 5000 }));

    state.queue.shift();

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

    if (!voiceChannel) return channel.send(state.locale.music.joinVoiceChannel).then((_message: Message) => _message.delete({ timeout: 5000 }));

    state.dispatcher.resume();
    state.isPlaying = true;
  } catch (err) {
    Log.e(`Resume > 1 > ${err}`);
  }
};

export const pause = async (state: State, interaction: Interaction) => {
  try {
    const guild = client.guilds.cache.get(interaction.guild_id);
    const channel = guild.channels.cache.get(interaction.channel_id) as TextChannel;
    const voiceChannel = guild.members.cache.get(interaction.member.user.id).voice.channel;

    if (!voiceChannel) return channel.send(state.locale.music.joinVoiceChannel).then((_message: Message) => _message.delete({ timeout: 5000 }));

    state.dispatcher.pause(true);
    state.isPlaying = false;
  } catch (err) {
    Log.e(`Pause > 1 > ${err}`);
  }
};

export const stop = (state: State, interaction: Interaction) => {
  try {
    const guild = client.guilds.cache.get(interaction.guild_id);
    const channel = guild.channels.cache.get(interaction.channel_id) as TextChannel;
    const voiceChannel = guild.members.cache.get(interaction.member.user.id).voice.channel;

    if (!voiceChannel) return channel.send(state.locale.music.joinVoiceChannel).then((_message: Message) => _message.delete({ timeout: 5000 }));

    state.dispatcher.pause(true);
    state.isPlaying = false;
  } catch (err) {
    Log.e(`Stop > 1 > ${err}`);
  }
};

export const toggleLoop = async (state: State, interaction: Interaction) => {
  try {
    const guild = client.guilds.cache.get(interaction.guild_id);
    const channel = guild.channels.cache.get(interaction.channel_id) as TextChannel;
    const voiceChannel = guild.members.cache.get(interaction.member.user.id).voice.channel;

    if (!voiceChannel) return channel.send(state.locale.music.joinVoiceChannel).then((_message: Message) => _message.delete({ timeout: 5000 }));

    state.isLooped = !state.isLooped;

    return channel.send(`${state.locale.loop.toggled}${state.isLooped ? `${state.locale.on}` : `${state.locale.off}`}`);
  } catch (err) {
    Log.e(`ToggleLoop > 1 > ${err}`);
  }
};

export const toggleRepeat = async (state: State, interaction: Interaction) => {
  try {
    const guild = client.guilds.cache.get(interaction.guild_id);
    const channel = guild.channels.cache.get(interaction.channel_id) as TextChannel;
    const voiceChannel = guild.members.cache.get(interaction.member.user.id).voice.channel;

    if (!voiceChannel) return channel.send(state.locale.music.joinVoiceChannel).then((_message: Message) => _message.delete({ timeout: 5000 }));

    state.isRepeated = !state.isRepeated;

    return channel.send(`${state.locale.repeat.toggled}${state.isRepeated ? `${state.locale.on}` : `${state.locale.off}`}`);
  } catch (err) {
    Log.e(`ToggleRepeat > ${err}`);
  }
};

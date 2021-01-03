import { TextChannel, VoiceState } from "discord.js";
import firestore from "../modules/firestore";
import { VoiceRole } from "../";
import config from "../config";
import { init } from "../modules/init";
import { client } from "../app";
import Log from "../modules/logger";

export default () => {
  client.on("voiceStateUpdate", async (oldState: VoiceState, newState: VoiceState) => {
    await init(newState ? newState.guild : oldState.guild);

    const isChannelChange = (oldState: VoiceState, newState: VoiceState) => {
      return (
        oldState.mute === newState.mute &&
        oldState.selfMute === newState.selfMute &&
        oldState.serverMute === newState.serverMute &&
        oldState.deaf === newState.deaf &&
        oldState.selfDeaf === newState.selfDeaf &&
        oldState.serverDeaf === newState.serverDeaf &&
        oldState.selfVideo === newState.selfVideo &&
        oldState.streaming === newState.streaming
      );
    };

    try {
      if (!oldState.channelID && newState.channelID && isChannelChange(oldState, newState)) {
        // Join Channel
        ((await firestore.collection(newState.guild.id).doc("config").get()).data().voice as VoiceRole[]).forEach(async (voiceRole: VoiceRole) => {
          if (voiceRole.voiceChannel === newState.channelID) {
            // if (newState.member.roles.cache.has(voiceRole.role)) return;

            try {
              await newState.member.roles.add(voiceRole.role);

              if (voiceRole.textChannel) {
                (newState.guild.channels.cache.get(voiceRole.textChannel) as TextChannel).send({
                  embed: {
                    color: config.color.info,
                    author: { name: newState.member.user.username, iconURL: newState.member.user.avatarURL() },
                  },
                });
              }

              Log.p({
                guild: newState.guild,
                embed: {
                  color: config.color.info,
                  author: { name: "Role Append [Voice]", iconURL: newState.member.user.avatarURL() },
                  description: `<@${newState.member.user.id}> += <@&${voiceRole.role}>`,
                  timestamp: new Date(),
                },
              });
            } catch (err) {
              Log.e(`VoiceStateUpdate > Join > ${err}`);
            }
          }
        });
      } else if (oldState.channelID && newState.channelID && isChannelChange(oldState, newState)) {
        // Switch Channel
        ((await firestore.collection(oldState.guild.id).doc("config").get()).data().voice as VoiceRole[]).forEach(async (voiceRole: VoiceRole) => {
          if (voiceRole.voiceChannel === oldState.channelID) {
            // if (!oldState.member.roles.cache.has(voiceRole.role)) return;

            try {
              if (voiceRole.textChannel) {
                (oldState.guild.channels.cache.get(voiceRole.textChannel) as TextChannel).send({
                  embed: {
                    color: config.color.error,
                    author: { name: oldState.member.user.username, iconURL: oldState.member.user.avatarURL() },
                  },
                });
              }

              await oldState.member.roles.remove(voiceRole.role);

              Log.p({
                guild: oldState.guild,
                embed: {
                  color: config.color.info,
                  author: { name: "Role Remove [Voice]", iconURL: oldState.member.user.avatarURL() },
                  description: `<@${oldState.member.user.id}> -= <@&${voiceRole.role}>`,
                  timestamp: new Date(),
                },
              });
            } catch (err) {
              Log.e(`VoiceStateUpdate > Switch > ${err}`);
            }
          }
        });

        ((await firestore.collection(newState.guild.id).doc("config").get()).data().voice as VoiceRole[]).forEach(async (voiceRole: VoiceRole) => {
          if (voiceRole.voiceChannel === newState.channelID) {
            // if (newState.member.roles.cache.has(voiceRole.role)) return;

            try {
              await newState.member.roles.add(voiceRole.role);

              if (voiceRole.textChannel) {
                (newState.guild.channels.cache.get(voiceRole.textChannel) as TextChannel).send({
                  embed: {
                    color: config.color.info,
                    author: { name: newState.member.user.username, iconURL: newState.member.user.avatarURL() },
                  },
                });
              }

              Log.p({
                guild: newState.guild,
                embed: {
                  color: config.color.info,
                  author: { name: "Role Append [Voice]", iconURL: newState.member.user.avatarURL() },
                  description: `<@${newState.member.user.id}> += <@&${voiceRole.role}>`,
                  timestamp: new Date(),
                },
              });
            } catch (err) {
              Log.e(`VoiceStateUpdate > Switch > ${err}`);
            }
          }
        });
      } else if (isChannelChange(oldState, newState)) {
        // Leave Channel
        ((await firestore.collection(oldState.guild.id).doc("config").get()).data().voice as VoiceRole[]).forEach(async (voiceRole: VoiceRole) => {
          if (voiceRole.voiceChannel === oldState.channelID) {
            // if (!oldState.member.roles.cache.has(voiceRole.role)) return;

            try {
              if (voiceRole.textChannel) {
                (oldState.guild.channels.cache.get(voiceRole.textChannel) as TextChannel).send({
                  embed: {
                    color: config.color.error,
                    author: { name: oldState.member.user.username, iconURL: oldState.member.user.avatarURL() },
                  },
                });
              }

              await oldState.member.roles.remove(voiceRole.role);

              Log.p({
                guild: oldState.guild,
                embed: {
                  color: config.color.info,
                  author: { name: "Role Remove [Voice]", iconURL: oldState.member.user.avatarURL() },
                  description: `<@${oldState.member.user.id}> -= <@&${voiceRole.role}>`,
                  timestamp: new Date(),
                },
              });
            } catch (err) {
              Log.e(`VoiceStateUpdate > Leave > ${err}`);
            }
          }
        });
      }
    } catch (err) {
      Log.e(`VoiceStateUpdate > ${err}`);
    }
  });
};

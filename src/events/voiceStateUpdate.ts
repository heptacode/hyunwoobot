import { TextChannel, VoiceState } from "discord.js";
import firestore from "../modules/firestore";
import { client, state } from "../app";
import props from "../props";
import { Config, PrivateRoom, VoiceRole } from "../";
import Log from "../modules/logger";

export default () => {
  client.on("voiceStateUpdate", async (oldState: VoiceState, newState: VoiceState) => {
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

    if (oldState && newState && !isChannelChange(oldState, newState)) return;

    if (oldState.channelID) {
      // User Leave
      try {
        const configDocRef = firestore.collection(newState.guild.id).doc("config");
        const config = (await configDocRef.get()).data() as Config;
        // Check If Member Is Host
        if (config.privateRoom && config.privateRooms.find((privateRoomItem: PrivateRoom) => privateRoomItem.host === oldState.member.id)) {
          const privateRoom: PrivateRoom = config.privateRooms.find((privateRoom: PrivateRoom) => privateRoom.host === oldState.member.id);
          if (privateRoom && oldState.guild.channels.cache.get(privateRoom.room)) {
            await oldState.guild.channels.cache.get(privateRoom.room).delete();
            await oldState.guild.channels.cache.get(privateRoom.waiting).delete();

            const idx = config.privateRooms.findIndex((privateRoom: PrivateRoom) => privateRoom.host === oldState.member.id);
            config.privateRooms.splice(idx, 1);
            await configDocRef.update({ privateRooms: config.privateRooms });
          }
        }

        const voiceRole: VoiceRole = config.voiceRole.find((voiceRole: VoiceRole) => voiceRole.voiceChannel === oldState.channelID);
        if (voiceRole && oldState.member.roles.cache.has(voiceRole.role)) {
          if (voiceRole.textChannel) {
            (oldState.guild.channels.cache.get(voiceRole.textChannel) as TextChannel).send({
              embed: {
                color: props.color.error,
                author: { name: oldState.member.user.username, iconURL: oldState.member.user.avatarURL() },
              },
            });
          }

          await oldState.member.roles.remove(voiceRole.role);

          Log.p({
            guild: oldState.guild,
            embed: {
              color: props.color.info,
              author: { name: "Role Remove [Voice]", iconURL: oldState.member.user.avatarURL() },
              description: `<@${oldState.member.user.id}> -= <@&${voiceRole.role}>`,
              timestamp: new Date(),
            },
          });
        }
      } catch (err) {
        Log.e(`VoiceStateUpdate > Switch/Leave > ${err}`);
      }
    }

    if (newState.channelID) {
      // User Join
      try {
        const configDocRef = firestore.collection(newState.guild.id).doc("config");
        const config = (await configDocRef.get()).data() as Config;

        if (config.privateRoom === newState.channelID) {
          const _privateRoom = await newState.guild.channels.create(`🔒 ${newState.member.displayName}`, {
            type: "voice",
            permissionOverwrites: [
              {
                type: "member",
                id: newState.member.id,
                allow: ["PRIORITY_SPEAKER", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS"],
              },
              {
                type: "member",
                id: client.user.id,
                allow: ["VIEW_CHANNEL", "MANAGE_CHANNELS", "CONNECT", "MOVE_MEMBERS"],
              },
              { type: "role", id: newState.guild.roles.everyone.id, deny: ["CREATE_INSTANT_INVITE", "CONNECT"] },
            ],
            parent: newState.guild.channels.cache.get(config.privateRoom).parent,
          });

          // Move Host to Created Room
          await newState.member.voice.setChannel(_privateRoom);

          const _waitingRoomID = await (
            await newState.guild.channels.create(`🚪 ${newState.member.displayName} ${state.get(newState.guild.id).locale.privateRoom.waitingRoom}`, {
              type: "voice",
              permissionOverwrites: [
                {
                  type: "member",
                  id: newState.member.id,
                  allow: ["MOVE_MEMBERS"],
                  deny: ["CONNECT"],
                },
                {
                  type: "member",
                  id: client.user.id,
                  allow: ["VIEW_CHANNEL", "MANAGE_CHANNELS", "CONNECT", "MOVE_MEMBERS"],
                },
                { type: "role", id: newState.guild.roles.everyone.id, deny: ["CREATE_INSTANT_INVITE", "SPEAK"] },
              ],
              parent: newState.guild.channels.cache.get(config.privateRoom).parent,
            })
          ).id;

          config.privateRooms.push({ host: newState.member.id, room: _privateRoom.id, waiting: _waitingRoomID });
          return await configDocRef.update({ privateRooms: config.privateRooms });
        } else if (config.privateRooms.find((privateRoom: PrivateRoom) => privateRoom.waiting === newState.channelID)) {
          // Waiting Room
          try {
            return await newState.member.send({
              embed: { color: props.color.info, title: state.get(newState.guild.id).locale.privateRoom.privateRoom, description: state.get(newState.guild.id).locale.privateRoom.waitingForMove },
            });
          } catch (err) {}
        }

        const voiceRole: VoiceRole = config.voiceRole.find((voiceRole: VoiceRole) => voiceRole.voiceChannel === newState.channelID);
        if (voiceRole && !newState.member.roles.cache.has(voiceRole.role)) {
          await newState.member.roles.add(voiceRole.role);

          if (voiceRole.textChannel) {
            (newState.guild.channels.cache.get(voiceRole.textChannel) as TextChannel).send({
              embed: {
                color: props.color.info,
                author: { name: newState.member.user.username, iconURL: newState.member.user.avatarURL() },
              },
            });
          }

          Log.p({
            guild: newState.guild,
            embed: {
              color: props.color.info,
              author: { name: "Role Append [Voice]", iconURL: newState.member.user.avatarURL() },
              description: `<@${newState.member.user.id}> += <@&${voiceRole.role}>`,
              timestamp: new Date(),
            },
          });
        }
      } catch (err) {
        Log.e(`VoiceStateUpdate > Join/Switch > ${err}`);
      }
    }
  });
};

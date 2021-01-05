import { TextChannel, VoiceState } from "discord.js";
import firestore from "../modules/firestore";
import { Config, PrivateRoom, VoiceRole } from "../";
import props from "../props";
import { init } from "../modules/init";
import { client, state } from "../app";
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

    if (oldState && newState && !isChannelChange(oldState, newState)) return;

    if (oldState.channelID) {
      // User Leave
      try {
        const configDocRef = firestore.collection(newState.guild.id).doc("config");
        const config = (await configDocRef.get()).data() as Config;
        // Check If Member Is Host
        if (config.privateRoom && config.privateRooms.find((privateRoomItem: PrivateRoom) => privateRoomItem.host === oldState.member.id)) {
          const privateRoomItem: PrivateRoom = config.privateRooms.find((privateRoomItem: PrivateRoom) => privateRoomItem.host === oldState.member.id);
          if (privateRoomItem && oldState.guild.channels.cache.get(privateRoomItem.room)) {
            await oldState.guild.channels.cache.get(privateRoomItem.room).delete();
            await oldState.guild.channels.cache.get(privateRoomItem.waiting).delete();

            const idx = config.privateRooms.findIndex((privateRoomItem: PrivateRoom) => privateRoomItem.host === oldState.member.id);
            config.privateRooms.splice(idx, 1);
            await configDocRef.update({ privateRooms: config.privateRooms });
          }
        }

        const voiceRoleItem: VoiceRole = config.voice.find((voiceRole: VoiceRole) => voiceRole.voiceChannel === oldState.channelID);
        if (voiceRoleItem && oldState.member.roles.cache.has(voiceRoleItem.role)) {
          if (voiceRoleItem.textChannel) {
            (oldState.guild.channels.cache.get(voiceRoleItem.textChannel) as TextChannel).send({
              embed: {
                color: props.color.error,
                author: { name: oldState.member.user.username, iconURL: oldState.member.user.avatarURL() },
              },
            });
          }

          await oldState.member.roles.remove(voiceRoleItem.role);

          Log.p({
            guild: oldState.guild,
            embed: {
              color: props.color.info,
              author: { name: "Role Remove [Voice]", iconURL: oldState.member.user.avatarURL() },
              description: `<@${oldState.member.user.id}> -= <@&${voiceRoleItem.role}>`,
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
            await newState.guild.channels.create(`🚪 ${newState.member.displayName} ${state.get(newState.guild.id).locale.privateRoom_waiting}`, {
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
          await configDocRef.update({ privateRooms: config.privateRooms });
        }

        const voiceRoleItem: VoiceRole = config.voice.find((voiceRole: VoiceRole) => voiceRole.voiceChannel === newState.channelID);
        if (voiceRoleItem && !newState.member.roles.cache.has(voiceRoleItem.role)) {
          await newState.member.roles.add(voiceRoleItem.role);

          if (voiceRoleItem.textChannel) {
            (newState.guild.channels.cache.get(voiceRoleItem.textChannel) as TextChannel).send({
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
              description: `<@${newState.member.user.id}> += <@&${voiceRoleItem.role}>`,
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

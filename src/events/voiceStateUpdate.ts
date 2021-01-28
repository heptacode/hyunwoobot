import { TextChannel, VoiceState } from "discord.js";
import { sendEmbed } from "../modules/embedSender";
import { firestore } from "../modules/firebase";
import { log } from "../modules/logger";
import { client, states } from "../app";
import props from "../props";
import { PrivateRoom, State, VoiceRole } from "../";

client.on("voiceStateUpdate", async (oldState: VoiceState, newState: VoiceState) => {
  if ((oldState && newState && oldState.channelID === newState.channelID) || oldState.member.user.bot || newState.member.user.bot) return;

  const state: State = states.get(newState.guild.id || oldState.guild.id);
  const configDocRef = firestore.collection(newState.guild.id || oldState.guild.id).doc("config");

  if (oldState.channelID) {
    // User Leave
    try {
      if (state.privateRoom && state.privateRooms.find((privateRoomItem: PrivateRoom) => privateRoomItem.host === oldState.member.id)) {
        const _privateRoom: PrivateRoom = state.privateRooms.find((privateRoom: PrivateRoom) => privateRoom.host === oldState.member.id);
        if (_privateRoom && oldState.guild.channels.cache.has(_privateRoom.room) && oldState.channelID !== newState.channelID) {
          for (const [memberID, member] of oldState.guild.channels.cache.get(_privateRoom.room).members) {
            await oldState.guild.channels.cache.get(state.privateRoom).permissionOverwrites.get(memberID).delete("[PrivateRoom] Deletion");
          }

          await oldState.guild.channels.cache.get(_privateRoom.room).delete("[PrivateRoom] Deletion");
          await oldState.guild.channels.cache.get(_privateRoom.waiting).delete("[PrivateRoom] Deletion");
          await oldState.guild.channels.cache.get(_privateRoom.text).delete("[PrivateRoom] Deletion");

          const idx = state.privateRooms.findIndex((privateRoom: PrivateRoom) => privateRoom.host === oldState.member.id);
          state.privateRooms.splice(idx, 1);
          await configDocRef.update({ privateRooms: state.privateRooms });

          await oldState.guild.channels.cache.get(state.privateRoom).permissionOverwrites.get(oldState.member.id).delete("[PrivateRoom] Deletion");
        }
      } else if (state.privateRoom && state.privateRooms.find((privateRoom: PrivateRoom) => privateRoom.room === oldState.channelID)) {
        const _privateText: TextChannel = oldState.guild.channels.cache.get(state.privateRooms.find((privateRoom: PrivateRoom) => privateRoom.room === oldState.channelID).text) as TextChannel;
        if (_privateText) {
          await _privateText.send({
            embed: {
              color: props.color.red,
              author: { name: oldState.member.user.username, iconURL: oldState.member.user.avatarURL() },
            },
          });

          await _privateText.updateOverwrite(oldState.member, { VIEW_CHANNEL: false }, "[PrivateRoom] Switch/Leave");
        }

        await oldState.guild.channels.cache.get(state.privateRoom).permissionOverwrites.get(oldState.member.id).delete("[PrivateRoom] Switch/Leave");
      }

      if (state.afkChannel.has(oldState.member.id)) {
        clearTimeout(state.afkChannel.get(oldState.member.id));
        state.afkChannel.delete(oldState.member.id);
      }

      const voiceRole: VoiceRole = state.voiceRoles.find((voiceRole: VoiceRole) => voiceRole.voiceChannel === oldState.channelID);
      if (voiceRole && oldState.member.roles.cache.has(voiceRole.role)) {
        if (voiceRole.textChannel) {
          (oldState.guild.channels.cache.get(voiceRole.textChannel) as TextChannel).send({
            embed: {
              color: props.color.red,
              author: { name: oldState.member.user.username, iconURL: oldState.member.user.avatarURL() },
            },
          });
        }

        await oldState.member.roles.remove(voiceRole.role, "[VoiceRole] Switch/Leave Voice");

        await sendEmbed(
          { member: oldState.member },
          {
            color: props.color.cyan,
            author: { name: state.locale.voiceRole.roleRemoved, iconURL: props.icon.role_remove },
            description: `<@${oldState.member.user.id}> -= <@&${voiceRole.role}>`,
            timestamp: new Date(),
          },
          { guild: true, log: true }
        );
      }
    } catch (err) {
      log.e(`VoiceStateUpdate > Switch/Leave > ${err}`);
    }
  }

  if (newState.channelID) {
    // User Join
    try {
      if (state.privateRoom === newState.channelID) {
        const _privateRoom = await newState.guild.channels.create(`🔒 ${newState.member.user.username}`, {
          type: "voice",
          permissionOverwrites: [
            {
              type: "member",
              id: newState.member.id,
              allow: ["CONNECT", "PRIORITY_SPEAKER", "MOVE_MEMBERS"],
            },
            {
              type: "member",
              id: client.user.id,
              allow: ["VIEW_CHANNEL", "MANAGE_CHANNELS", "CONNECT", "MOVE_MEMBERS"],
            },
            { type: "role", id: newState.guild.roles.everyone.id, deny: ["CREATE_INSTANT_INVITE", "CONNECT"] },
          ],
          parent: newState.guild.channels.cache.get(state.privateRoom).parent,
        });

        // Move Host to Created Room
        await newState.member.voice.setChannel(_privateRoom, `[PrivateRoom] Creation`);

        await newState.guild.channels.cache.get(state.privateRoom).updateOverwrite(newState.member, { VIEW_CHANNEL: false }, "[PrivateRoom] Creation");

        const _waitingRoomID = await (
          await newState.guild.channels.create(`🚪 ${newState.member.user.username} ${state.locale.privateRoom.waitingRoom}`, {
            type: "voice",
            permissionOverwrites: [
              {
                type: "member",
                id: newState.member.id,
                allow: "MOVE_MEMBERS",
              },
              {
                type: "member",
                id: client.user.id,
                allow: ["VIEW_CHANNEL", "MANAGE_CHANNELS", "CONNECT", "MOVE_MEMBERS"],
              },
              { type: "role", id: newState.guild.roles.everyone.id, deny: ["CREATE_INSTANT_INVITE", "SPEAK"] },
            ],
            parent: newState.guild.channels.cache.get(state.privateRoom).parent,
          })
        ).id;

        const _privateText = await newState.guild.channels.create(`🔒 ${newState.member.user.username}`, {
          type: "text",
          permissionOverwrites: [
            {
              type: "member",
              id: newState.member.id,
              allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
            },
            {
              type: "member",
              id: client.user.id,
              allow: ["VIEW_CHANNEL", "MANAGE_CHANNELS", "READ_MESSAGE_HISTORY"],
            },
            { type: "role", id: newState.guild.roles.everyone.id, deny: ["VIEW_CHANNEL", "CREATE_INSTANT_INVITE", "READ_MESSAGE_HISTORY"] },
          ],
          parent: newState.guild.channels.cache.get(state.privateRoom).parent,
        });

        await _privateText.send({
          embed: {
            color: props.color.green,
            title: `**🚪 ${state.locale.privateRoom.privateRoom}**`,
            description: `✅ **${state.locale.privateRoom.privateTextCreated}**`,
            timestamp: new Date(),
          },
        });

        state.privateRooms.push({ host: newState.member.id, text: _privateText.id, room: _privateRoom.id, waiting: _waitingRoomID });
        return await configDocRef.update({ privateRooms: state.privateRooms });
      } else if (state.privateRoom && state.privateRooms.find((privateRoom: PrivateRoom) => privateRoom.waiting === newState.channelID || privateRoom.room === newState.channelID)) {
        const _privateRoom: PrivateRoom = state.privateRooms.find((privateRoom: PrivateRoom) => privateRoom.waiting === newState.channelID || privateRoom.room === newState.channelID);
        const _privateText: TextChannel = newState.guild.channels.cache.get(_privateRoom.text) as TextChannel;

        if (_privateRoom.waiting === newState.channelID) {
          return await _privateText.send({
            embed: {
              color: props.color.yellow,
              title: `**🚪 ${state.locale.privateRoom.privateRoom}**`,
              description: `**<@${newState.member.user.id}>${state.locale.privateRoom.waitingForMove}**`,
              timestamp: new Date(),
            },
          });
        } else if (_privateRoom.room === newState.channelID && _privateRoom.host !== newState.member.id) {
          await newState.guild.channels.cache.get(state.privateRoom).updateOverwrite(newState.member, { VIEW_CHANNEL: false }, "[PrivateRoom] Accepted");
          await _privateText.updateOverwrite(newState.member, { VIEW_CHANNEL: true }, "[PrivateRoom] Accepted");

          return await _privateText.send({
            embed: {
              color: props.color.cyan,
              author: { name: newState.member.user.username, iconURL: newState.member.user.avatarURL() },
            },
          });
        }
      }

      if (state.afkChannel.has(newState.member.id)) {
        clearTimeout(state.afkChannel.get(newState.member.id));
        state.afkChannel.delete(newState.member.id);
      }

      if (state.afkTimeout > 0 && newState.channelID === newState.guild.afkChannelID) {
        state.afkChannel.set(
          newState.member.id,
          setTimeout(async () => {
            try {
              if (!newState.guild.afkChannel.members.has(newState.member.id)) return;

              await newState.kick("[AFKTimeout] Disconnected due to inactivity");

              await sendEmbed(
                { member: newState.member },
                {
                  color: props.color.purple,
                  description: `**${state.locale.afkTimeout.disconnected_dm}**`,
                },
                { dm: true }
              );

              return await sendEmbed(
                { member: newState.member },
                {
                  color: props.color.cyan,
                  author: {
                    name: state.locale.afkTimeout.afkTimeout,
                    iconURL: props.icon.call_end,
                  },
                  description: `**<@${newState.member.user.id}>${state.locale.afkTimeout.disconnected}**`,
                  timestamp: new Date(),
                },
                { guild: true, log: true }
              );
            } catch (err) {}
          }, state.afkTimeout * 60000)
        );

        return await sendEmbed(
          { member: newState.member },
          {
            color: props.color.cyan,
            author: {
              name: `${state.locale.afkTimeout.countdownStarted}(${state.afkTimeout}${state.locale.minute})`,
              iconURL: props.icon.timer,
            },
            description: `<@${newState.member.user.id}>`,
            timestamp: new Date(),
          },
          { guild: true, log: true }
        );
      }

      const voiceRole: VoiceRole = state.voiceRoles.find((voiceRole: VoiceRole) => voiceRole.voiceChannel === newState.channelID);
      if (voiceRole && !newState.member.roles.cache.has(voiceRole.role)) {
        await newState.member.roles.add(voiceRole.role, "[VoiceRole] Join Voice");

        if (voiceRole.textChannel) {
          (newState.guild.channels.cache.get(voiceRole.textChannel) as TextChannel).send({
            embed: {
              color: props.color.cyan,
              author: { name: newState.member.user.username, iconURL: newState.member.user.avatarURL() },
            },
          });
        }

        return await sendEmbed(
          { member: newState.member },
          {
            color: props.color.cyan,
            author: {
              name: state.locale.voiceRole.roleAppended,
              iconURL: props.icon.role_append,
            },
            description: `<@${newState.member.user.id}> += <@&${voiceRole.role}>`,
            timestamp: new Date(),
          },
          { guild: true, log: true }
        );
      }
    } catch (err) {
      log.e(`VoiceStateUpdate > Join/Switch > ${err}`);
    }
  }
});

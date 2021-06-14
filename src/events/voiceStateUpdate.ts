import { Collection, TextChannel, VoiceState } from "discord.js";
import { createError } from "../modules/createError";
import { sendEmbed } from "../modules/embedSender";
import { firestore } from "../modules/firebase";
import { client, states } from "../app";
import props from "../props";
import { PrivateRoom, State, VoiceRole } from "../";

client.on("voiceStateUpdate", async (oldState: VoiceState, newState: VoiceState) => {
  if (oldState && newState && oldState.channelID === newState.channelID) return;

  const state: State = states.get(newState.guild.id || oldState.guild.id);

  if (oldState.member.user.id === client.user.id) return (state.connection = null);
  if (newState.member.user.id === client.user.id) return (state.connection = newState.connection);

  if (oldState.member.user.bot || newState.member.user.bot) return;

  const configDocRef = firestore.collection(newState.guild.id || oldState.guild.id).doc("config");

  if (oldState.channelID) {
    // User Leave
    try {
      const privateRoom: PrivateRoom = state.privateRooms.find((privateRoom: PrivateRoom) => privateRoom.room === oldState.channelID || privateRoom.waiting === oldState.channelID);
      if (state.privateRoom.generator && privateRoom) {
        if (privateRoom.room === oldState.channelID && privateRoom.host !== oldState.member.id) {
          const privateText: TextChannel = oldState.guild.channels.resolve(privateRoom.text) as TextChannel;
          if (privateText) {
            await privateText.send({
              embed: {
                color: props.color.red,
                author: { name: oldState.member.displayName, iconURL: oldState.member.user.avatarURL() },
              },
            });

            await privateText.updateOverwrite(oldState.member, { VIEW_CHANNEL: false }, "[PrivateRoom] Switch/Leave");
          }
          try {
            await oldState.guild.channels.resolve(state.privateRoom.generator).permissionOverwrites.get(oldState.member.id).delete("[PrivateRoom] Switch/Leave");
          } catch (err) {
            createError("VoiceStateUpdate > ChannelResolve", err, { guild: oldState.guild });
          }
        } else if (
          privateRoom.room !== newState.channelID &&
          privateRoom.waiting !== newState.channelID &&
          privateRoom.host === oldState.member.id &&
          oldState.guild.channels.cache.has(privateRoom.room)
        ) {
          for (const [memberID, member] of new Collection([...oldState.guild.channels.resolve(privateRoom.room).members, ...oldState.guild.channels.resolve(privateRoom.waiting).members])) {
            if (state.privateRoom.fallback) await member.voice.setChannel(state.privateRoom.fallback, "[PrivateRoom] Deletion");
            else if (privateRoom.room === member.voice.channelID)
              await oldState.guild.channels.resolve(state.privateRoom.generator).permissionOverwrites.get(memberID).delete("[PrivateRoom] Deletion");
          }

          await oldState.guild.channels.resolve(privateRoom.room).delete("[PrivateRoom] Deletion");
          await oldState.guild.channels.resolve(privateRoom.waiting).delete("[PrivateRoom] Deletion");
          await oldState.guild.channels.resolve(privateRoom.text).delete("[PrivateRoom] Deletion");

          const idx = state.privateRooms.findIndex((privateRoom: PrivateRoom) => privateRoom.host === oldState.member.id);
          state.privateRooms.splice(idx, 1);
          await configDocRef.update({ privateRooms: state.privateRooms });

          await oldState.guild.channels.resolve(state.privateRoom.generator).permissionOverwrites.get(oldState.member.id).delete("[PrivateRoom] Deletion");
        }
      }

      if (state.afkChannel.has(oldState.member.id)) {
        clearTimeout(state.afkChannel.get(oldState.member.id));
        state.afkChannel.delete(oldState.member.id);
      }

      const voiceRole: VoiceRole = state.voiceRoles.find((voiceRole: VoiceRole) => voiceRole.voiceChannel === oldState.channelID);
      if (voiceRole && oldState.member.roles.cache.has(voiceRole.role)) {
        if (voiceRole.textChannel) {
          (oldState.guild.channels.resolve(voiceRole.textChannel) as TextChannel).send({
            embed: {
              color: props.color.red,
              author: { name: oldState.member.displayName, iconURL: oldState.member.user.avatarURL() },
            },
          });
        }

        await oldState.member.roles.remove(voiceRole.role, "[VoiceRole] Switch/Leave Voice");

        return sendEmbed(
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
      createError("VoiceStateUpdate > Switch/Leave", err, { guild: oldState.guild });
    }
  }

  if (newState.channelID) {
    // User Join
    try {
      const privateRoom: PrivateRoom = state.privateRooms.find((privateRoom: PrivateRoom) => privateRoom.room === newState.channelID || privateRoom.waiting === newState.channelID);

      if (state.privateRoom.generator === newState.channelID) {
        const _privateRoom = await newState.guild.channels.create(`🔒 ${newState.member.displayName}`, {
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
          parent: newState.guild.channels.resolve(state.privateRoom.generator).parent,
        });

        // Move Host to Created Room
        await newState.member.voice.setChannel(_privateRoom, `[PrivateRoom] Creation`);

        await newState.guild.channels.resolve(state.privateRoom.generator).updateOverwrite(newState.member, { VIEW_CHANNEL: false }, "[PrivateRoom] Creation");

        const _waitingRoomID = await (
          await newState.guild.channels.create(`🚪 ${newState.member.displayName} ${state.locale.privateRoom.waitingRoom}`, {
            type: "voice",
            permissionOverwrites: [
              {
                type: "member",
                id: newState.member.id,
                allow: ["SPEAK", "PRIORITY_SPEAKER", "MOVE_MEMBERS"],
              },
              {
                type: "member",
                id: client.user.id,
                allow: ["VIEW_CHANNEL", "MANAGE_CHANNELS", "CONNECT", "MOVE_MEMBERS"],
              },
              { type: "role", id: newState.guild.roles.everyone.id, deny: ["CREATE_INSTANT_INVITE", "SPEAK"] },
            ],
            parent: newState.guild.channels.resolve(state.privateRoom.generator).parent,
          })
        ).id;

        const _privateText = await newState.guild.channels.create(`🔒 ${newState.member.displayName}`, {
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
          parent: newState.guild.channels.resolve(state.privateRoom.generator).parent,
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
      } else if (state.privateRoom && privateRoom) {
        const privateText: TextChannel = newState.guild.channels.resolve(privateRoom.text) as TextChannel;
        if (privateRoom.room === newState.channelID) {
          if (privateRoom.host !== newState.member.id) {
            await newState.guild.channels.resolve(state.privateRoom.generator).updateOverwrite(newState.member, { VIEW_CHANNEL: false }, "[PrivateRoom] Accepted");

            if (privateText) {
              await privateText.updateOverwrite(newState.member, { VIEW_CHANNEL: true }, "[PrivateRoom] Accepted");

              return await privateText.send({
                embed: {
                  color: props.color.cyan,
                  author: { name: newState.member.displayName, iconURL: newState.member.user.avatarURL() },
                },
              });
            }
          }
        } else if (privateRoom.host !== newState.member.id && privateText)
          return await privateText.send({
            embed: {
              color: props.color.yellow,
              title: `**🚪 ${state.locale.privateRoom.privateRoom}**`,
              description: `**<@${newState.member.user.id}>${state.locale.privateRoom.waitingForMove}**`,
              timestamp: new Date(),
            },
          });
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

              sendEmbed(
                { member: newState.member },
                {
                  color: props.color.purple,
                  description: `**${state.locale.afkTimeout.disconnected_dm.replace("{min}", String(state.afkTimeout))}**`,
                },
                { dm: true }
              );

              return sendEmbed(
                { member: newState.member },
                {
                  color: props.color.cyan,
                  author: {
                    name: state.locale.afkTimeout.afkTimeout,
                    iconURL: props.icon.call_end,
                  },
                  description: `**<@${newState.member.user.id}>${state.locale.afkTimeout.disconnected.replace("{min}", String(state.afkTimeout))}**`,
                  timestamp: new Date(),
                },
                { guild: true, log: true }
              );
            } catch (err) {
              createError("VoiceStateUpdate > AFK", err, { guild: newState.guild });
            }
          }, state.afkTimeout * 60000)
        );

        return sendEmbed(
          { member: newState.member },
          {
            color: props.color.cyan,
            author: {
              name: `${state.locale.afkTimeout.countdownStarted.replace("{min}", String(state.afkTimeout))}`,
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
          (newState.guild.channels.resolve(voiceRole.textChannel) as TextChannel).send({
            embed: {
              color: props.color.cyan,
              author: { name: newState.member.displayName, iconURL: newState.member.user.avatarURL() },
            },
          });
        }

        return sendEmbed(
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
      createError("VoiceStateUpdate > Join/Switch", err, { guild: oldState.guild });
    }
  }
});

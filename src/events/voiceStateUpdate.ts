import { client, states } from '@/app';
import { createError } from '@/modules/createError';
import { sendEmbed } from '@/modules/embedSender';
import { props } from '@/props';
import { firestore } from '@/services/firebase.service';
import { PrivateRoom, State, VoiceRole } from '@/types';
import { CategoryChannel, GuildChannel, TextChannel, VoiceState } from 'discord.js';

export async function voiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
  if (oldState && newState && oldState.channelId === newState.channelId) return;

  const state: State = states.get(newState.guild.id || oldState.guild.id);

  if (oldState.member.user.id === client.user.id) {
    if (state.timeout) clearTimeout(state.timeout);
    state.connection = null;
    return;
  }
  // if (newState.member.user.id === client.user.id) return (state.connection = newState.connection);

  if (oldState.member.user.bot || newState.member.user.bot) return;

  const configDocRef = firestore.collection(newState.guild.id || oldState.guild.id).doc('config');

  if (oldState.channelId) {
    // User Leave
    try {
      if (state.privateRooms && state.privateRooms.length >= 1) {
        const privateRoom: PrivateRoom = state.privateRooms.find(
          (privateRoom: PrivateRoom) =>
            privateRoom.room === oldState.channelId || privateRoom.waiting === oldState.channelId
        );
        if (state.privateRoom.generator && privateRoom) {
          if (privateRoom.room === oldState.channelId && privateRoom.host !== oldState.member.id) {
            const privateText: TextChannel = oldState.guild.channels.resolve(
              privateRoom.text
            ) as TextChannel;
            if (privateText) {
              await privateText.send({
                embeds: [
                  {
                    color: props.color.red,
                    author: {
                      name: oldState.member.displayName,
                      iconURL: oldState.member.user.avatarURL(),
                    },
                  },
                ],
              });

              await privateText.permissionOverwrites.edit(
                oldState.member,
                { VIEW_CHANNEL: false },
                { reason: '[PrivateRoom] Switch/Leave' }
              );
            }
            try {
              await (
                oldState.guild.channels.resolve(state.privateRoom.generator) as GuildChannel
              ).permissionOverwrites
                .resolve(oldState.member.id)
                .delete('[PrivateRoom] Switch/Leave');
            } catch (err) {
              createError('VoiceStateUpdate > ChannelResolve', err, { guild: oldState.guild });
            }
          } else if (
            privateRoom.room !== newState.channelId &&
            privateRoom.waiting !== newState.channelId &&
            privateRoom.host === oldState.member.id &&
            oldState.guild.channels.cache.has(privateRoom.room)
          ) {
            for (const [memberID, member] of Object.assign([
              oldState.guild.channels.resolve(privateRoom.room).members,
              oldState.guild.channels.resolve(privateRoom.waiting).members,
            ])) {
              if (state.privateRoom.fallback)
                await member.voice.setChannel(state.privateRoom.fallback, '[PrivateRoom] Deletion');
              else if (privateRoom.room === member.voice.channelID)
                await (
                  oldState.guild.channels.resolve(state.privateRoom.generator) as GuildChannel
                ).permissionOverwrites
                  .resolve(memberID)
                  .delete('[PrivateRoom] Deletion');
            }

            await oldState.guild.channels
              .resolve(privateRoom.room)
              .delete('[PrivateRoom] Deletion');
            await oldState.guild.channels
              .resolve(privateRoom.waiting)
              .delete('[PrivateRoom] Deletion');
            await oldState.guild.channels
              .resolve(privateRoom.text)
              .delete('[PrivateRoom] Deletion');

            const idx = state.privateRooms.findIndex(
              (privateRoom: PrivateRoom) => privateRoom.host === oldState.member.id
            );
            if (idx === -1)
              throw createError('VoiceStateUpdate > PrivateRoom', 'PrivateRoom Host Not Found', {
                guild: newState.guild,
              });

            state.privateRooms.splice(idx, 1);
            await configDocRef.update({ privateRooms: state.privateRooms });

            await (
              oldState.guild.channels.resolve(state.privateRoom.generator) as GuildChannel
            ).permissionOverwrites
              .resolve(oldState.member.id)
              .delete('[PrivateRoom] Deletion');
          }
        }
      }

      if (state.afkChannel && state.afkChannel.has(oldState.member.id)) {
        clearTimeout(state.afkChannel.get(oldState.member.id));
        state.afkChannel.delete(oldState.member.id);
      }

      if (state.voiceRoles && state.voiceRoles.length >= 1) {
        const voiceRole: VoiceRole = state.voiceRoles.find(
          (voiceRole: VoiceRole) => voiceRole.voiceChannel === oldState.channelId
        );
        if (voiceRole && oldState.member.roles.cache.has(voiceRole.role)) {
          if (voiceRole.textChannel) {
            (oldState.guild.channels.resolve(voiceRole.textChannel) as TextChannel).send({
              embeds: [
                {
                  color: props.color.red,
                  author: {
                    name: oldState.member.displayName,
                    iconURL: oldState.member.user.avatarURL(),
                  },
                },
              ],
            });
          }

          await oldState.member.roles.remove(voiceRole.role, '[VoiceRole] Switch/Leave Voice');

          sendEmbed(
            { member: oldState.member },
            {
              color: props.color.cyan,
              author: { name: state.locale.voiceRole.roleRemoved, iconURL: props.icon.role_remove },
              description: `<@${oldState.member.user.id}> -= <@&${voiceRole.role}>`,
              timestamp: new Date(),
            },
            { guild: true, log: true }
          );
          return;
        }
      }
    } catch (err) {
      createError('VoiceStateUpdate > Switch/Leave', err, { guild: oldState.guild });
    }
  }

  if (newState.channelId) {
    // User Join
    try {
      if (state.privateRooms && state.privateRooms.length >= 1) {
        const privateRoom: PrivateRoom = state.privateRooms.find(
          (privateRoom: PrivateRoom) =>
            privateRoom.room === newState.channelId || privateRoom.waiting === newState.channelId
        );

        if (state.privateRoom.generator === newState.channelId) {
          const _privateRoom = await newState.guild.channels.create(
            `🔒 ${newState.member.displayName}`,
            {
              type: 'GUILD_VOICE',
              permissionOverwrites: [
                {
                  type: 'member',
                  id: newState.member.id,
                  allow: ['CONNECT', 'PRIORITY_SPEAKER', 'MOVE_MEMBERS'],
                },
                {
                  type: 'member',
                  id: client.user.id,
                  allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'CONNECT', 'MOVE_MEMBERS'],
                },
                {
                  type: 'role',
                  id: newState.guild.roles.everyone.id,
                  deny: ['CREATE_INSTANT_INVITE', 'CONNECT'],
                },
              ],
              parent: newState.guild.channels.resolve(state.privateRoom.generator)
                .parent as CategoryChannel,
            }
          );

          // Move Host to Created Room
          await newState.member.voice.setChannel(_privateRoom, `[PrivateRoom] Creation`);

          await (
            newState.guild.channels.resolve(state.privateRoom.generator) as GuildChannel
          ).permissionOverwrites.edit(
            newState.member,
            { VIEW_CHANNEL: false },
            { reason: '[PrivateRoom] Creation' }
          );

          const _waitingRoomID = await (
            await newState.guild.channels.create(
              `🚪 ${newState.member.displayName} ${state.locale.privateRoom.waitingRoom}`,
              {
                type: 'GUILD_VOICE',
                permissionOverwrites: [
                  {
                    type: 'member',
                    id: newState.member.id,
                    allow: ['SPEAK', 'PRIORITY_SPEAKER', 'MOVE_MEMBERS'],
                  },
                  {
                    type: 'member',
                    id: client.user.id,
                    allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'CONNECT', 'MOVE_MEMBERS'],
                  },
                  {
                    type: 'role',
                    id: newState.guild.roles.everyone.id,
                    deny: ['CREATE_INSTANT_INVITE', 'SPEAK'],
                  },
                ],
                parent: newState.guild.channels.resolve(state.privateRoom.generator)
                  .parent as CategoryChannel,
              }
            )
          ).id;

          const _privateText: TextChannel = await newState.guild.channels.create(
            `🔒 ${newState.member.displayName}`,
            {
              type: 'GUILD_TEXT',
              permissionOverwrites: [
                {
                  type: 'member',
                  id: newState.member.id,
                  allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
                },
                {
                  type: 'member',
                  id: client.user.id,
                  allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'READ_MESSAGE_HISTORY'],
                },
                {
                  type: 'role',
                  id: newState.guild.roles.everyone.id,
                  deny: ['VIEW_CHANNEL', 'CREATE_INSTANT_INVITE', 'READ_MESSAGE_HISTORY'],
                },
              ],
              parent: newState.guild.channels.resolve(state.privateRoom.generator)
                .parent as CategoryChannel,
            }
          );

          await _privateText.send({
            embeds: [
              {
                color: props.color.green,
                title: `**🚪 ${state.locale.privateRoom.privateRoom}**`,
                description: `✅ **${state.locale.privateRoom.privateTextCreated}**`,
                timestamp: new Date(),
              },
            ],
          });

          state.privateRooms.push({
            host: newState.member.id,
            text: _privateText.id,
            room: _privateRoom.id,
            waiting: _waitingRoomID,
          });
          await configDocRef.update({ privateRooms: state.privateRooms });
          return;
        } else if (state.privateRoom && privateRoom) {
          const privateText: TextChannel = newState.guild.channels.resolve(
            privateRoom.text
          ) as TextChannel;
          if (privateRoom.room === newState.channelId) {
            if (privateRoom.host !== newState.member.id) {
              await (
                newState.guild.channels.resolve(state.privateRoom.generator) as GuildChannel
              ).permissionOverwrites.edit(
                newState.member,
                { VIEW_CHANNEL: false },
                { reason: '[PrivateRoom] Accepted' }
              );

              if (privateText) {
                await privateText.permissionOverwrites.edit(
                  newState.member,
                  { VIEW_CHANNEL: true },
                  { reason: '[PrivateRoom] Accepted' }
                );

                await privateText.send({
                  embeds: [
                    {
                      color: props.color.cyan,
                      author: {
                        name: newState.member.displayName,
                        iconURL: newState.member.user.avatarURL(),
                      },
                    },
                  ],
                });
                return;
              }
            }
          } else if (privateRoom.host !== newState.member.id && privateText)
            await privateText.send({
              embeds: [
                {
                  color: props.color.yellow,
                  title: `**🚪 ${state.locale.privateRoom.privateRoom}**`,
                  description: `**<@${newState.member.user.id}>${state.locale.privateRoom.waitingForMove}**`,
                  timestamp: new Date(),
                },
              ],
            });
          return;
        }
      }

      if (state.afkChannel && state.afkChannel.has(newState.member.id)) {
        clearTimeout(state.afkChannel.get(newState.member.id));
        state.afkChannel.delete(newState.member.id);
      }

      if (state.afkTimeout > 0 && newState.channelId === newState.guild.afkChannelId) {
        state.afkChannel.set(
          newState.member.id,
          setTimeout(async () => {
            try {
              if (!newState.guild.afkChannel.members.has(newState.member.id)) return;

              await newState.disconnect('[AFKTimeout] Disconnected due to inactivity');

              sendEmbed(
                { member: newState.member },
                {
                  color: props.color.purple,
                  description: `**${state.locale.afkTimeout.disconnected_dm.replace(
                    '{min}',
                    String(state.afkTimeout)
                  )}**`,
                },
                { dm: true }
              );

              sendEmbed(
                { member: newState.member },
                {
                  color: props.color.cyan,
                  author: {
                    name: state.locale.afkTimeout.afkTimeout,
                    iconURL: props.icon.call_end,
                  },
                  description: `**<@${
                    newState.member.user.id
                  }>${state.locale.afkTimeout.disconnected.replace(
                    '{min}',
                    String(state.afkTimeout)
                  )}**`,
                  timestamp: new Date(),
                },
                { guild: true, log: true }
              );
              return;
            } catch (err) {
              createError('VoiceStateUpdate > AFK', err, { guild: newState.guild });
            }
          }, state.afkTimeout * 60000)
        );

        sendEmbed(
          { member: newState.member },
          {
            color: props.color.cyan,
            author: {
              name: `${state.locale.afkTimeout.countdownStarted.replace(
                '{min}',
                String(state.afkTimeout)
              )}`,
              iconURL: props.icon.timer,
            },
            description: `<@${newState.member.user.id}>`,
            timestamp: new Date(),
          },
          { guild: true, log: true }
        );
        return;
      }

      if (state.voiceRoles && state.voiceRoles.length >= 1) {
        const voiceRole: VoiceRole = state.voiceRoles.find(
          (voiceRole: VoiceRole) => voiceRole.voiceChannel === newState.channelId
        );
        if (voiceRole && !newState.member.roles.cache.has(voiceRole.role)) {
          await newState.member.roles.add(voiceRole.role, '[VoiceRole] Join Voice');

          if (voiceRole.textChannel) {
            (newState.guild.channels.resolve(voiceRole.textChannel) as TextChannel).send({
              embeds: [
                {
                  color: props.color.cyan,
                  author: {
                    name: newState.member.displayName,
                    iconURL: newState.member.user.avatarURL(),
                  },
                },
              ],
            });
          }

          sendEmbed(
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
          return;
        }
      }
    } catch (err) {
      createError('VoiceStateUpdate > Join/Switch', err, { guild: oldState.guild });
    }
  }
}

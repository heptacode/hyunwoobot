import { client } from '@/app';
import { props } from '@/props';
import { PrivateRoom, State } from '@/types';
import { CategoryChannel, GuildChannel, TextChannel, VoiceState } from 'discord.js';

export async function newPrivateRoom(
  state: State,
  newState: VoiceState,
  configDocRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
) {
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
}

import { createError } from '@/modules/createError';
import { props } from '@/props';
import { PrivateRoom, State } from '@/types';
import { GuildChannel, TextChannel, VoiceState } from 'discord.js';

export async function oldPrivateRoom(
  state: State,
  oldState: VoiceState,
  newState: VoiceState,
  configDocRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
) {
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
        for (const [memberId, member] of Object.assign([
          oldState.guild.channels.resolve(privateRoom.room).members,
          oldState.guild.channels.resolve(privateRoom.waiting).members,
        ])) {
          if (state.privateRoom.fallback)
            await member.voice.setChannel(state.privateRoom.fallback, '[PrivateRoom] Deletion');
          else if (privateRoom.room === member.voice.channelID)
            await (
              oldState.guild.channels.resolve(state.privateRoom.generator) as GuildChannel
            ).permissionOverwrites
              .resolve(memberId)
              .delete('[PrivateRoom] Deletion');
        }

        await oldState.guild.channels.resolve(privateRoom.room).delete('[PrivateRoom] Deletion');
        await oldState.guild.channels.resolve(privateRoom.waiting).delete('[PrivateRoom] Deletion');
        await oldState.guild.channels.resolve(privateRoom.text).delete('[PrivateRoom] Deletion');

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
}

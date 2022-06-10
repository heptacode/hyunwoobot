import { locales, states } from '@/app';
import { Config, State } from '@/types';
import { createAudioPlayer } from '@discordjs/voice';
import { Collection } from 'discord.js';

export function setState(guildId: string, config?: Config) {
  states.set(guildId, {
    guildId: guildId,

    afkChannel: new Collection(),
    afkTimeout: config ? config.afkTimeout : -1,
    alarmChannel: config ? config.alarmChannel : null,
    autoRoles: config ? config.autoRoles : [],
    locale: config ? locales.get(config.locale) : locales.get('ko'),
    logChannel: config ? config.logChannel : null,
    logMessageEvents: config ? config.logMessageEvents : false,
    mentionDebounce: null,
    privateRoom: config ? config.privateRoom : undefined,
    privateRooms: config ? config.privateRooms : [],
    reactionRoles: config ? config.reactionRoles : [],
    userRoles: config ? config.userRoles : [],
    voiceRoles: config ? config.voiceRoles : [],

    connection: null,
    player: createAudioPlayer(),
    queue: [],
    isLooped: false,
    isRepeated: false,
    isPlaying: false,
    volume: 3,
  } as State);
  return states.get(guildId);
}
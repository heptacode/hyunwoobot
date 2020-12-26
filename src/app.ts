import path from "path";
import fs from "fs";
import { Client, Collection, Guild, GuildMember, Message, MessageReaction, TextChannel, User, VoiceState } from "discord.js";
import firestore from "./modules/firestore";
import Log from "./modules/logger";
import "dotenv/config";

import { AutoRole, Command, Locale, ReactionRole, ReactionRoleItem, State, VoiceRole } from "./";
import config from "./config";

const prefix: string = process.env.PREFIX || config.bot.prefix;
const token: string = process.env.TOKEN;
const client: Client = new Client();
const locales: Collection<string, Locale> = new Collection();
const state: Collection<string, State> = new Collection();
const commands: Collection<string, Command> = new Collection();
const commands_manager: Collection<string, Command> = new Collection();
const commands_hidden: Collection<string, Command> = new Collection();

for (const file of fs.readdirSync(path.resolve(__dirname, "../src/locales")).filter((file) => file.match(/(.js|.ts)$/))) {
  const locale: Locale = require(path.resolve(__dirname, `../src/locales/${file}`)).default;
  locales.set(locale.locale, locale);
}

for (const file of fs.readdirSync(path.resolve(__dirname, "../src/commands")).filter((file) => file.match(/(.js|.ts)$/))) {
  const command: Command = require(path.resolve(__dirname, `../src/commands/${file}`)).default;
  commands.set(command.name, command);
}

for (const file of fs.readdirSync(path.resolve(__dirname, "../src/commands_manager")).filter((file) => file.match(/(.js|.ts)$/))) {
  const command: Command = require(path.resolve(__dirname, `../src/commands_manager/${file}`)).default;
  commands_manager.set(command.name, command);
}

for (const file of fs.readdirSync(path.resolve(__dirname, "../src/commands_hidden")).filter((file) => file.match(/(.js|.ts)$/))) {
  const command: Command = require(path.resolve(__dirname, `../src/commands_hidden/${file}`)).default;
  commands_hidden.set(command.name, command);
}

client.once("ready", async () => {
  await client.user.setStatus("online");

  await client.user.setActivity({
    type: "WATCHING",
    name: `${prefix}help`,
  });

  try {
    for (const collection of await firestore.listCollections()) {
      const guild: Guild = client.guilds.cache.find((guild) => guild.id == collection.id);

      (await firestore.collection(collection.id).get()).docs.map(async (doc) => {
        if (!["server", "config"].includes(doc.id)) {
          const channel: TextChannel = (await guild.channels.cache.find((channel) => channel.id == doc.id)) as TextChannel;
          await channel.messages.fetch({ limit: 100 });
        }
      });
    }
  } catch (err) {
    Log.e(`Fetch > ${err}`);
  }

  Log.i(`Ready! ${client.user.tag}`);
});

client.on("message", async (message: Message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args: string[] = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName: string = args.shift().toLowerCase();
  const command: Command =
    commands.get(commandName) ||
    commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName)) ||
    commands_manager.get(commandName) ||
    commands_manager.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName)) ||
    commands_hidden.get(commandName) ||
    commands_hidden.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
  if (!command) return;

  if (!state.get(message.guild.id)) {
    Log.d(`LocalDB Initialize for guild [ ${message.guild.name} | ${message.guild.id} ]`);
    state.set(message.guild.id, {
      textChannel: null,
      voiceChannel: null,
      connection: null,
      playlist: [],
      isLooped: false,
      isRepeated: false,
      isPlaying: false,
      volume: 2,
      timeout: null,
    } as State);
  }

  const serverDocRef = firestore.collection(message.guild.id).doc("server");
  const serverDocSnapshot = await serverDocRef.get();

  const configDocRef = firestore.collection(message.guild.id).doc("config");
  let configDocSnapshot = await configDocRef.get();

  if (!configDocSnapshot.exists || !serverDocSnapshot.exists) {
    Log.d(`Firestore Initialize for guild [ ${message.guild.name} | ${message.guild.id} ]`);
    try {
      await configDocRef.set({ autorole: [], locale: "ko", log: "", voice: [] });
      await serverDocRef.set(JSON.parse(JSON.stringify(message.guild)));
      configDocSnapshot = await configDocRef.get();
    } catch (err) {
      Log.e(`Firestore Initialize > ${err}`);
      return message.channel.send(`An error occured while initializing.`);
    }
  }

  const locale = locales.get(await configDocSnapshot.data().locale);

  // if (command.onlyAtServers && message.channel.type === "dm") return message.reply(locale.denyDM);

  try {
    if (commandName === "help") command.execute(locale, message, args, commands, commands_manager);
    else command.execute(locale, state.get(message.guild.id), message, args);
  } catch (err) {
    Log.e(`Main > ${JSON.stringify(message.content)} > ${err}`);
    message.channel.send(locale.err_cmd);
  }
});

client.on("messageReactionAdd", async (reaction: MessageReaction, user: User) => {
  if (reaction.me) return;
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (err) {
      Log.e(`MessageReactionAdd > Fetch > ${err}`);
      return;
    }
  }

  try {
    const guildRolesRef: ReactionRole[] = (await firestore.collection(reaction.message.guild.id).doc(reaction.message.channel.id).get()).data() as ReactionRole[];
    if (!guildRolesRef[reaction.message.id]) return;
    guildRolesRef[reaction.message.id].forEach(async (reactionRoleItem: ReactionRoleItem) => {
      if (reactionRoleItem.emoji === reaction.emoji.name) {
        // Check If Role Exists
        console.log(reaction.message.guild.roles.cache.has(reactionRoleItem.role));
        if (!reaction.message.guild.roles.cache.has(reactionRoleItem.role)) return;
        // Check If User Has Role
        if (reaction.message.guild.member(user).roles.cache.has(reactionRoleItem.role)) return;

        reaction.message.guild.member(user).roles.add(reactionRoleItem.role);
      }
    });
  } catch (err) {
    Log.e(`MessageReactionAdd > ${err}`);
  }
});

client.on("messageReactionRemove", async (reaction: MessageReaction, user: User) => {
  if (reaction.me) return;
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (err) {
      Log.e(`MessageReactionRemove > Fetch > ${err}`);
      return;
    }
  }

  try {
    const guildRolesRef: ReactionRole[] = (await firestore.collection(reaction.message.guild.id).doc(reaction.message.channel.id).get()).data() as ReactionRole[];
    if (!guildRolesRef[reaction.message.id]) return;
    guildRolesRef[reaction.message.id].forEach(async (reactionRoleItem: ReactionRoleItem) => {
      if (reactionRoleItem.emoji === reaction.emoji.name) {
        // Check If Role Exists
        if (!(await reaction.message.guild.roles.fetch()).cache.has(reactionRoleItem.role)) return;
        // Check If User Has Role
        if (!reaction.message.guild.member(user).roles.cache.has(reactionRoleItem.role)) return;

        reaction.message.guild.member(user).roles.remove(reactionRoleItem.role);
      }
    });
  } catch (err) {
    Log.e(`MessageReactionRemove > ${err}`);
  }
});

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
  try {
    if (!oldState.channelID && newState.channelID && isChannelChange(oldState, newState)) {
      // Join Channel
      ((await firestore.collection(newState.guild.id).doc("config").get()).data().voice as VoiceRole[]).forEach(async (voiceRole: VoiceRole) => {
        if (voiceRole.voiceChannel === newState.channelID) {
          if (newState.member.roles.cache.has(voiceRole.role)) return;

          try {
            await newState.member.roles.add(voiceRole.role);

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
          if (!oldState.member.roles.cache.has(voiceRole.role)) return;

          try {
            await oldState.member.roles.remove(voiceRole.role);

            Log.p({
              guild: newState.guild,
              embed: {
                color: config.color.info,
                author: { name: "Role Remove [Voice]", iconURL: newState.member.user.avatarURL() },
                description: `<@${newState.member.user.id}> -= <@&${voiceRole.role}>`,
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
          if (newState.member.roles.cache.has(voiceRole.role)) return;

          try {
            await newState.member.roles.add(voiceRole.role);

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
          if (!oldState.member.roles.cache.has(voiceRole.role)) return;

          try {
            await oldState.member.roles.remove(voiceRole.role);

            Log.p({
              guild: newState.guild,
              embed: {
                color: config.color.info,
                author: { name: "Role Remove [Voice]", iconURL: newState.member.user.avatarURL() },
                description: `<@${newState.member.user.id}> -= <@&${voiceRole.role}>`,
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

client.on("guildMemberAdd", async (member: GuildMember) => {
  try {
    await Log.p({
      guild: member.guild,
      embed: {
        color: config.color.info,
        author: { name: "User Join", iconURL: config.icon.in },
        description: `<@${member.user.id}> joined the server.`,
        timestamp: new Date(),
      },
    });
    ((await firestore.collection(member.guild.id).doc("config").get()).data().autoRole as AutoRole[]).forEach(async (autoRoleconfig: AutoRole) => {
      if ((autoRoleconfig.type === "user" && !member.user.bot) || (autoRoleconfig.type === "bot" && member.user.bot)) {
        try {
          await member.roles.add(autoRoleconfig.role);

          await Log.p({
            guild: member.guild,
            embed: {
              color: config.color.info,
              author: { name: "Role Append [AutoRole]", iconURL: config.icon.autorole },
              description: `<@${member.user.id}> += <@&${autoRoleconfig.role}>`,
              timestamp: new Date(),
            },
          });
        } catch (err) {
          Log.e(`GuildMemberAdd > AutoRole > ${err}`);
        }
      }
    });
  } catch (err) {
    Log.e(`GuildMemberAdd > ${err}`);
  }
});

client.on("guildMemberRemove", (member: GuildMember) => {
  Log.p({
    guild: member.guild,
    embed: {
      color: config.color.info,
      author: { name: "User Leave", iconURL: config.icon.out },
      description: `<@${member.user.id}> left the server.`,
      timestamp: new Date(),
    },
  });
});

client.login(token);

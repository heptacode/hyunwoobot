import fs from "fs";
import { Client, Collection, Guild, Message, MessageReaction, Role, TextChannel, User, VoiceState } from "discord.js";
import firestore from "./firestore";
import Log from "./modules/logger";
import "dotenv/config";

import locale_en from "./locales/en";
import locale_ko from "./locales/ko";
import { Command, CommandList, ReactionRole, ReactionRoleItem, State, VoiceRole } from "./";

const prefix: string = process.env.PREFIX || "=";
const token: string = process.env.TOKEN;
const client: Client = new Client();
const state: Collection<string, State> = new Collection();
const commands: Collection<string, Command> = new Collection();
const privateCommands: Collection<string, Command> = new Collection();

const commandList: CommandList[] = [];
for (const file of fs.readdirSync("./src/commands").filter((file) => file.endsWith(".ts"))) {
  const command: Command = require(`./commands/${file}`);
  commands.set(command.name, command);
  commandList.push({ name: command.name, aliases: command.aliases, description: command.description });
}

for (const file of fs.readdirSync("./src/commands_private").filter((file) => file.endsWith(".ts"))) {
  const command: Command = require(`./commands_private/${file}`);
  privateCommands.set(command.name, command);
}

client.once("ready", async () => {
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

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = commands.get(commandName) || commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName)) || privateCommands.get(commandName);
  if (!command) return;

  if (!state.get(message.guild.id)) {
    Log.d("LocalDB Initialize");
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
    Log.d("Firestore Initialize");
    try {
      await configDocRef.set({ locale: "ko", log: "", voice: [] });
      await serverDocRef.set(JSON.parse(JSON.stringify(message.guild)));
      configDocSnapshot = await configDocRef.get();
    } catch (err) {
      Log.e(`Firestore Initialize > ${err}`);
      return message.channel.send(`An error occured while initializing.`);
    }
  }

  let locale = await configDocSnapshot.data().locale;
  if (locale == "en") locale = locale_en;
  else if (locale == "ko") locale = locale_ko;

  // if (command.onlyAtServers && message.channel.type === "dm") return message.reply(locale.denyDM);

  try {
    if (commandName === "help") command.execute(locale, message, commandList);
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
        if (!(await reaction.message.guild.roles.fetch()).cache.has(reactionRoleItem.role)) return;
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

client.on("voiceStateUpdate", async (oldMember: VoiceState, newMember: VoiceState) => {
  try {
    if (!oldMember.channelID && newMember.channelID) {
      // Join Channel
      ((await firestore.collection(newMember.guild.id).doc("config").get()).data().voice as VoiceRole[]).forEach(async (voiceRole: VoiceRole) => {
        if (voiceRole.voiceChannel === newMember.channelID) {
          if (newMember.member.roles.cache.has(voiceRole.role)) return;

          try {
            await newMember.member.roles.add(voiceRole.role);
          } catch (err) {
            Log.e(`VoiceStateUpdate > Join > ${err}`);
          }
        }
      });
    } else if (oldMember.channelID && newMember.channelID) {
      // Switch Channel
      ((await firestore.collection(oldMember.guild.id).doc("config").get()).data().voice as VoiceRole[]).forEach(async (voiceRole: VoiceRole) => {
        if (voiceRole.voiceChannel === oldMember.channelID) {
          if (!oldMember.member.roles.cache.has(voiceRole.role)) return;

          try {
            await oldMember.member.roles.remove(voiceRole.role);
          } catch (err) {
            Log.e(`VoiceStateUpdate > Switch > ${err}`);
          }
        }
      });

      ((await firestore.collection(newMember.guild.id).doc("config").get()).data().voice as VoiceRole[]).forEach(async (voiceRole: VoiceRole) => {
        if (voiceRole.voiceChannel === newMember.channelID) {
          if (newMember.member.roles.cache.has(voiceRole.role)) return;

          try {
            await newMember.member.roles.add(voiceRole.role);
          } catch (err) {
            Log.e(`VoiceStateUpdate > Switch > ${err}`);
          }
        }
      });
    } else {
      // Leave Channel
      ((await firestore.collection(oldMember.guild.id).doc("config").get()).data().voice as VoiceRole[]).forEach(async (voiceRole: VoiceRole) => {
        if (voiceRole.voiceChannel === oldMember.channelID) {
          if (!oldMember.member.roles.cache.has(voiceRole.role)) return;

          try {
            await oldMember.member.roles.remove(voiceRole.role);
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

client.login(token);

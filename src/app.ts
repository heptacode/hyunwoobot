import * as fs from "fs";
import * as Discord from "discord.js";
import FS from "./FS";
import Log from "./util/logger";
import "dotenv/config";

import lang_en from "./lang/lang_en";
import lang_ko from "./lang/lang_ko";

import sendError from "./util/errorSender";

var DB = new Map();
const prefix = ">";
const token = process.env.TOKEN;
const client: any = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./src/commands").filter(file => file.endsWith(".ts"));
let commands = [];

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
  commands.push({ name: command.name, aliases: command.aliases, description: command.description });
}

client.once("ready", async () => {
  await client.user.setActivity({
    type: "PLAYING",
    name: `${prefix}help`,
  });
  Log.i(`Ready! ${client.user.tag}`);
});

client.on("message", async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  let server = message.guild;
  let serverDocRef = FS.collection(server.id).doc("server");
  // let serverDocSnapshot = await serverDocRef.get();

  let configDocRef = FS.collection(server.id).doc("config");
  let configDocSnapshot = await configDocRef.get();

  let docRef = FS.collection(server.id).doc("data");
  // let docSnapshot = await docRef.get();

  let dbRef = DB.get(server.id);

  let locale;

  if (!configDocSnapshot.exists) {
    Log.i("FS Initialize");
    try {
      await configDocRef.set({ locale: "en" });
      await serverDocRef.set(JSON.parse(JSON.stringify(server)));

      message.reply(`Initialize Complete`);
    } catch (err) {
      Log.e(`Init > ${err}`);
      return message.reply(`An error occured while initializing.`);
    }
  } else {
    locale = await configDocSnapshot.data().locale;
    if (locale == "en") locale = lang_en;
    else if (locale == "ko") locale = lang_ko;
  }

  if (!dbRef) {
    // LocalDB Initialize
    Log.i("LocalDB Initialize");
    DB.set(server.id, {
      voiceChannel: message.member.voice.channel,
      connection: null,
      isPlaying: false,
    });
  }

  if (!command) return sendError(message, `${locale.cmdInvalid}`);

  if (command.guildOnly && message.channel.type === "dm") return message.reply(`${locale.denyDM}`);

  try {
    if (commandName === "help") command.execute(locale, message, commands);
    else command.execute(locale, dbRef, docRef, message, args);
  } catch (err) {
    Log.e(`Main > ${JSON.stringify(message.content)} > ${err}`);
    message.reply(`${locale.err_cmd}`);
  }
});

client.login(token);

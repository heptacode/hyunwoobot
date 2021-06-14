import axios from "axios";
import { Message } from "discord.js";
import { createError } from "../modules/createError";
import { client, states, prefix, commands_manager } from "../app";
// import { client, states, commands_hidden, prefix, commands_manager } from "../app";
import props from "../props";
import { Command } from "../";
import "dotenv/config";

client.on("message", async (message: Message) => {
  try {
    if (message.author.bot) return;
    else if (message.channel.type === "dm") {
      await message.react("❌");
      return await message.reply({
        embed: {
          color: props.color.red,
          title: "**❌ Error**",
          description: "**This channel is read-only.\n이 채널은 읽기 전용이예요.**",
        },
      });
    } else if (
      !states.get(message.guild.id).mentionDebounce &&
      (/현우|hyunwoo/i.test(message.content) || message.mentions.has(client.user)) &&
      !message.mentions.everyone &&
      !message.content.startsWith(prefix)
    ) {
      states.get(message.guild.id).mentionDebounce = setTimeout(() => (states.get(message.guild.id).mentionDebounce = null), 30000);
      await axios.post(
        `https://discord.com/api/v8/channels/${message.channel.id}/messages`,
        {
          content: `<@${props.developerID}>`,
          message_reference: { message_id: message.id },
        },
        { headers: { Authorization: `Bot ${process.env.TOKEN}` } }
      );
    } else if (!message.content.startsWith(prefix)) return;

    const args: string[] = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName: string = args.shift().toLowerCase();
    const command: Command = commands_manager.find((cmd) => cmd.name === commandName && cmd.messageOnly);
    // const command: Command = commands_manager.find((cmd) => cmd.name === commandName && cmd.messageOnly) || commands_hidden.get(commandName);
    if (!command) return;

    await command.execute(states.get(message.guild.id), message, args);
  } catch (err) {
    message.react("❌");
    createError("Message", err, { message: message });
  }
});

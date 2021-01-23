import { Message } from "discord.js";
import Log from "../modules/logger";
import { client, state, commands_hidden, prefix, commands_manager } from "../app";
import props from "../props";
import { Command } from "../";

client.on("message", async (message: Message) => {
  try {
    if (message.author.bot) return;
    else if (message.channel.type === "dm") {
      await message.react("❌");
      return await message.reply({
        embed: {
          color: props.color.red,
          title: "❌ Error",
          description: "**This channel is read-only.\n이 채널은 읽기 전용이에요.**",
        },
      });
    } else if (!message.content.startsWith(prefix)) return;

    const args: string[] = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName: string = args.shift().toLowerCase();
    const command: Command = commands_manager.find((cmd) => cmd.name === commandName && cmd.messageOnly) || commands_hidden.get(commandName);
    if (!command) return;

    await command.execute(state.get(message.guild.id), message, args);
  } catch (err) {
    await message.react("❌");
    Log.e(`Main > ${JSON.stringify(message.content)} > ${err}`);
  }
});

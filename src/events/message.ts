import { Message } from "discord.js";
import Log from "../modules/logger";
import { client, state, commands_hidden, prefix, commands_manager } from "../app";
import { Command } from "../";

export default () => {
  client.on("message", async (message: Message) => {
    if (!message.content.startsWith(prefix) || message.author.bot || message.channel.type == "dm") return;

    const args: string[] = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName: string = args[0].toLowerCase();
    const command: Command = commands_manager.find((cmd) => cmd.name === commandName && cmd.messageOnly) || commands_hidden.get(commandName);
    if (!command) return;

    args.shift();

    try {
      await command.execute(state.get(message.guild.id), message, args);
    } catch (err) {
      await message.react("❌");
      Log.e(`Main > ${JSON.stringify(message.content)} > ${err}`);
    }
  });
};

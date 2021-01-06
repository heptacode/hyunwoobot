import { Message } from "discord.js";
import { Command } from "../";
import { prefix } from "../app";
import { client, state, commands, commands_manager, commands_hidden } from "../app";
import Log from "../modules/logger";

export default () => {
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

    try {
      if (commandName === "help") command.execute(state.get(message.guild.id).locale, message, args, commands, commands_manager);
      else command.execute(state.get(message.guild.id).locale, state.get(message.guild.id), message, args);
    } catch (err) {
      await message.react("❌");
      Log.e(`Main > ${JSON.stringify(message.content)} > ${err}`);
    }
  });
};

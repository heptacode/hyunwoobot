import { Message } from "discord.js";
import { client, state, commands_hidden, prefix } from "../app";
import { Command } from "../";
import Log from "../modules/logger";

export default () => {
  client.on("message", async (message: Message) => {
    if (!message.content.startsWith(prefix) || message.author.bot || message.channel.type == "dm") return;

    const args: string[] = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName: string = args[0].toLowerCase();
    const command: Command = commands_hidden.get(commandName) || commands_hidden.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
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

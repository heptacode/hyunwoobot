import { Collection, EmbedFieldData, Message } from "discord.js";
import { Args, Command, Locale } from "../";
import config from "../config";

export default {
  name: "help",
  execute(locale: Locale, message: Message, args: Args, commands: Collection<string, Command>, commands_manager: Collection<string, Command>) {
    let isUser: boolean = true;
    const fields: EmbedFieldData[] = [];

    if (args[0] !== "manager") {
      commands.forEach((command: Command, key: string) => {
        fields.push({ name: command.name, value: `${command.aliases ? `(${command.aliases.join(", ")})\n` : ""}${locale[`help_${command.name}`]}`, inline: true });
      });
    } else {
      isUser = false;
      commands_manager.forEach((command: Command, key: string) => {
        fields.push({ name: command.name, value: `${command.aliases ? `(${command.aliases.join(", ")})\n` : ""}${locale[`help_${command.name}`]}`, inline: true });
      });
    }

    return message.channel.send({
      embed: {
        color: config.color.primary,
        title: `${config.bot.name} ${isUser ? locale.help : locale.help_manager}`,
        url: config.bot.website,
        description: isUser ? locale.helpDesc : locale.helpDesc_manager,
        thumbnail: { url: config.bot.icon },
        fields: fields,
      },
    });
  },
};

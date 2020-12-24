import { EmbedFieldData, Message } from "discord.js";
import { Command, Locale } from "../";
import config from "../config";

module.exports = {
  name: "help",
  execute(locale: Locale, message: Message, commands: Command) {
    const fields: EmbedFieldData[] = [];
    for (const i in commands) {
      fields.push({ name: commands[i].name, value: `${commands[i].aliases.length ? `(${commands[i].aliases.join(", ")})\n` : ""}${commands[i].description}`, inline: true });
    }

    message.channel.send({
      embed: {
        color: config.color.primary,
        title: `${config.bot.name} ${locale.help}`,
        url: config.bot.website,
        description: locale.helpDesc,
        thumbnail: { url: config.bot.icon },
        fields: fields,
      },
    });
  },
};

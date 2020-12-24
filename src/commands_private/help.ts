import { EmbedFieldData, Message } from "discord.js";
import { Command, Locale } from "../";

module.exports = {
  name: "help",
  execute(locale: Locale, message: Message, commands: Command) {
    const fields: EmbedFieldData[] = [];
    for (const i in commands) {
      fields.push({ name: commands[i].name, value: `${commands[i].aliases.length ? `(${commands[i].aliases.join(", ")})\n` : ""}${commands[i].description}`, inline: true });
    }

    message.channel.send({
      embed: {
        color: "#7788D4",
        title: `HyunwooBot ${locale.help}`,
        url: "https://hyunwoo.kim",
        description: locale.helpDesc,
        thumbnail: { url: "https://cdn.discordapp.com/avatars/303202584007671812/9fe36da1c721e959a991d38dcffdbe67.png?size=256" },
        fields: fields,
      },
    });
  },
};

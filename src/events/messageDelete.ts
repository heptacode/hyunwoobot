import { Message, MessageEmbed, PartialMessage, TextChannel } from "discord.js";
import { log } from "../modules/logger";
import { client, states } from "../app";
import props from "../props";

client.on("messageDelete", async (message: Message | PartialMessage) => {
  try {
    if (message.author.bot || message.channel.type === "dm") return;

    const messageEmbed: MessageEmbed = new MessageEmbed()
      .setColor(props.color.red)
      .setAuthor(states.get(message.guild.id).locale.log.messageDelete, props.icon.delete)
      .setThumbnail(message.attachments.size ? message.attachments.array()[0].proxyURL : null)
      .setTitle(`**${(message.channel as TextChannel).name}**`)
      .setDescription(message.content ? `**${message.content}**` : `**${message.attachments.array()[0].name}**`)
      .setFooter(message.author.tag, message.author.avatarURL())
      .setTimestamp(new Date());

    if (states.get(message.guild.id).logMessageEvents)
      return await (client.channels.cache.get(states.get(message.guild.id).logChannel) as TextChannel).send(
        message.attachments.size && message.attachments.array()[0].width ? messageEmbed : messageEmbed.attachFiles(message.attachments.array())
      );
  } catch (err) {
    log.e(`MessageDelete > ${err}`);
  }
});

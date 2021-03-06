import { Message, MessageEmbed, PartialMessage, TextChannel } from "discord.js";
import { createError } from "../modules/createError";
import { client, states } from "../app";
import props from "../props";

client.on("messageUpdate", async (oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage) => {
  try {
    if (oldMessage.author.bot || oldMessage.channel.type === "dm" || !states.get(newMessage.guild.id).logMessageEvents) return;

    const messageEmbed: MessageEmbed = new MessageEmbed()
      .setColor(props.color.yellow)
      .setAuthor(states.get(newMessage.guild.id).locale.log.messageEdit, props.icon.edit)
      .setThumbnail(oldMessage.attachments.size ? oldMessage.attachments.array()[0].proxyURL : null)
      .setTitle(`**${(oldMessage.channel as TextChannel).name}**`)
      .setDescription(
        oldMessage.content ? `**${oldMessage.content}**\n🔽\n**${newMessage.content}**` : `**${oldMessage.attachments.array()[0].name}**\n🔽\n**${newMessage.attachments.array()[0].name}**`
      )
      .setFooter(oldMessage.author.tag, oldMessage.author.avatarURL())
      .setTimestamp(new Date());

    return await (client.channels.resolve(states.get(newMessage.guild.id).logChannel) as TextChannel).send(
      oldMessage.attachments.size && oldMessage.attachments.array()[0].width ? messageEmbed : messageEmbed.attachFiles(oldMessage.attachments.array())
    );
  } catch (err) {
    createError("MessageUpdate", err, { message: oldMessage });
  }
});

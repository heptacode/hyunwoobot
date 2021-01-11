import { Message, MessageEmbed, PartialMessage, TextChannel } from "discord.js";
import firestore from "../modules/firestore";
import Log from "../modules/logger";
import { client, state } from "../app";
import props from "../props";

export default () => {
  client.on("messageDelete", async (message: Message | PartialMessage) => {
    try {
      if (message.author.bot) return;

      console.dir(message.attachments.array()[0].proxyURL);

      const config = (await firestore.collection(message.guild.id).doc("config").get()).data();

      const messageEmbed: MessageEmbed = new MessageEmbed()
        .setColor(props.color.red)
        .setAuthor(state.get(message.guild.id).locale.log.messageDelete, props.icon.delete)
        .setThumbnail(message.attachments.size ? message.attachments.array()[0].proxyURL : null)
        .setTitle(`**${(message.channel as TextChannel).name}**`)
        .setDescription(message.content ? `**${message.content}**` : `**${message.attachments.array()[0].name}**`)
        .setFooter(message.author.tag, message.author.avatarURL())
        .setTimestamp(new Date());

      if (config.logMessageEvents)
        return await (client.channels.cache.get(config.log) as TextChannel).send(
          message.attachments.size && message.attachments.array()[0].width ? messageEmbed : messageEmbed.attachFiles(message.attachments.array())
        );
    } catch (err) {
      Log.e(`MessageDelete > ${err}`);
    }
  });
};

import { Message, MessageEmbed, PartialMessage, TextChannel } from "discord.js";
import { sendEmbed } from "../modules/embedSender";
import firestore from "../modules/firestore";
import Log from "../modules/logger";
import { client, state } from "../app";
import props from "../props";

export default () => {
  client.on("messageDelete", async (message: Message | PartialMessage) => {
    try {
      if (message.author.bot) return;

      const config = (await firestore.collection(message.guild.id).doc("config").get()).data();

      if (config.logMessageEvents)
        return await (client.channels.cache.get(config.log) as TextChannel).send(
          new MessageEmbed()
            .setColor(props.color.yellow)
            .setAuthor(state.get(message.guild.id).locale.log.messageDelete, props.icon.delete)
            .setThumbnail(message.attachments ? message.attachments.array()[0].proxyURL : null)
            .setDescription(message.content ? `**${message.content}**` : message.attachments.array()[0].name)
            .setFooter(message.author.tag, message.author.avatarURL())
            .setTimestamp(new Date())
            .attachFiles(message.attachments.array())
        );
    } catch (err) {
      Log.e(`MessageDelete > ${err}`);
    }
  });
};

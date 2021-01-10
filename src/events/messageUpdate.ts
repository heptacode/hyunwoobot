import { Message, PartialMessage } from "discord.js";
import { sendEmbed } from "../modules/embedSender";
import firestore from "../modules/firestore";
import { client, state } from "../app";
import props from "../props";

export default () => {
  client.on("messageUpdate", async (oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage) => {
    if (oldMessage.author.bot) return;

    if ((await firestore.collection(newMessage.guild.id).doc("config").get()).data().logMessageEvents)
      return await sendEmbed(
        { member: newMessage.member },
        {
          color: props.color.yellow,
          author: { name: state.get(newMessage.guild.id).locale.log.messageEdit, iconURL: props.icon.edit },
          description: `**${oldMessage.content}**\n🔽\n**${newMessage.content}**`,
          timestamp: new Date(),
        },
        { guild: true, log: true }
      );
  });
};

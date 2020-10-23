import * as Discord from "discord.js";

export default async (message, body) => {
  message.channel.send(new Discord.MessageEmbed().setColor("#E80000").setAuthor(`❌ ${body}`));
};

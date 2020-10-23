import * as Discord from "discord.js";

export default async (message, body) => {
  message.reply(new Discord.MessageEmbed().setColor("#E80000").setAuthor(`❌ ${body}`));
};

import * as Discord from "discord.js";

module.exports = {
  name: "help",
  aliases: ["h"],
  description: "",
  execute(locale, message, commands) {
    let field = [];
    for (let i in commands) {
      field.push({ name: commands[i].name, value: `${JSON.stringify(commands[i].aliases)}\n${commands[i].description}` });
    }

    message.channel.send(
      new Discord.MessageEmbed()
        .setColor("#7788D4")
        .setTitle(`SunrinMeow ${locale.help}`)
        .setURL("https://hyunwoo.kim")
        .setDescription(`${locale.helpDesc}`)
        .setThumbnail("https://cdn.discordapp.com/avatars/768780642539274260/a89dbedfa2785ed9a5afcc642efb336b.png?size=256")
        .addFields(field)
    );
  },
};

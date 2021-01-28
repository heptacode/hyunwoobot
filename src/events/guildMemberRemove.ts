import { GuildMember } from "discord.js";
import { sendEmbed } from "../modules/embedSender";
import { log } from "../modules/logger";
import { client, states } from "../app";
import props from "../props";

client.on("guildMemberRemove", async (member: GuildMember) => {
  try {
    await sendEmbed(
      { member: member },
      {
        color: props.color.cyan,
        author: { name: states.get(member.guild.id).locale.log.guildMemberRemove, iconURL: props.icon.out },
        description: `**<@${member.user.id}>${states.get(member.guild.id).locale.log.guildMemberRemoved}**`,
        timestamp: new Date(),
      },
      { guild: true, log: true }
    );
  } catch (err) {
    log.e(`GuildMemberRemove > ${err}`);
  }
});

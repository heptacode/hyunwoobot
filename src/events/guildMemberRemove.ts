import { GuildMember } from "discord.js";
import { sendEmbed } from "../modules/embedSender";
import { log } from "../modules/logger";
import { client, states } from "../app";
import props from "../props";
import { Locale } from "../";

client.on("guildMemberRemove", async (member: GuildMember) => {
  try {
    const locale: Locale = states.get(member.guild.id).locale;
    await sendEmbed(
      { member: member },
      {
        color: props.color.cyan,
        author: { name: locale.log.guildMemberRemove, iconURL: props.icon.out },
        description: `**<@${member.user.id}>${locale.log.guildMemberRemoved}**`,
        timestamp: new Date(),
      },
      { guild: true, log: true }
    );
  } catch (err) {
    log.e(`GuildMemberRemove > ${err}`);
  }
});

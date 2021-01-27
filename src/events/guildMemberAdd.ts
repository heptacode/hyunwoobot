import { GuildMember } from "discord.js";
import { sendEmbed } from "../modules/embedSender";
import { firestore } from "../modules/firebase";
import { log } from "../modules/logger";
import { client, states } from "../app";
import props from "../props";
import { Locale } from "../";

client.on("guildMemberAdd", async (member: GuildMember) => {
  try {
    const locale: Locale = states.get(member.guild.id).locale;

    await sendEmbed(
      { member: member },
      {
        color: props.color.cyan,
        author: { name: locale.log.guildMemberAdd, iconURL: props.icon.in },
        description: `**<@${member.user.id}>${locale.log.guildMemberAdded}**`,
        timestamp: new Date(),
      },
      { guild: true, log: true }
    );

    for (const autoRole of (await firestore.collection(member.guild.id).doc("config").get()).data().autoRole) {
      if (!((autoRole.type === "user" && !member.user.bot) || (autoRole.type === "bot" && member.user.bot))) continue;

      await member.roles.add(autoRole.role, "[AutoRole] GuildMemberAdd");

      await sendEmbed(
        { member: member },
        {
          color: props.color.cyan,
          author: { name: locale.autoRole.roleAppended, iconURL: props.icon.role_append },
          description: `**<@${member.user.id}> += <@&${autoRole.role}>**`,
          timestamp: new Date(),
        },
        { guild: true, log: true }
      );
    }
  } catch (err) {
    log.e(`GuildMemberAdd > ${err}`);
  }
});

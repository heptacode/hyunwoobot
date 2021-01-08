import { GuildMember } from "discord.js";
import firestore from "../modules/firestore";
import { client } from "../app";
import props from "../props";
import { AutoRole } from "../";
import Log from "../modules/logger";

export default () => {
  client.on("guildMemberAdd", async (member: GuildMember) => {
    try {
      await Log.p({
        guild: member.guild,
        embed: {
          color: props.color.info,
          author: { name: "User Join", iconURL: props.icon.in },
          description: `<@${member.user.id}> joined the server.`,
          timestamp: new Date(),
        },
      });

      for (const autoRole of (await firestore.collection(member.guild.id).doc("config").get()).data().autoRole) {
        if (!(autoRole.type === "user" && !member.user.bot) || !(autoRole.type === "bot" && member.user.bot)) continue;

        await member.roles.add(autoRole.role);

        await Log.p({
          guild: member.guild,
          embed: {
            color: props.color.info,
            author: { name: "Role Append [AutoRole]", iconURL: props.icon.role_append },
            description: `<@${member.user.id}> += <@&${autoRole.role}>`,
            timestamp: new Date(),
          },
        });
      }
    } catch (err) {
      Log.e(`GuildMemberAdd > ${err}`);
    }
  });
};

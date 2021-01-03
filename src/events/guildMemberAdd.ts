import { Client, GuildMember } from "discord.js";
import firestore from "../modules/firestore";
import { AutoRole } from "../";
import config from "../config";
import { init } from "../modules/init";
import { client } from "../app";
import Log from "../modules/logger";

export default () => {
  client.on("guildMemberAdd", async (member: GuildMember) => {
    try {
      await init(member.guild);

      await Log.p({
        guild: member.guild,
        embed: {
          color: config.color.info,
          author: { name: "User Join", iconURL: config.icon.in },
          description: `<@${member.user.id}> joined the server.`,
          timestamp: new Date(),
        },
      });
      ((await firestore.collection(member.guild.id).doc("config").get()).data().autoRole as AutoRole[]).forEach(async (autoRoleconfig: AutoRole) => {
        if ((autoRoleconfig.type === "user" && !member.user.bot) || (autoRoleconfig.type === "bot" && member.user.bot)) {
          try {
            await member.roles.add(autoRoleconfig.role);

            await Log.p({
              guild: member.guild,
              embed: {
                color: config.color.info,
                author: { name: "Role Append [AutoRole]", iconURL: config.icon.role_append },
                description: `<@${member.user.id}> += <@&${autoRoleconfig.role}>`,
                timestamp: new Date(),
              },
            });
          } catch (err) {
            Log.e(`GuildMemberAdd > AutoRole > ${err}`);
          }
        }
      });
    } catch (err) {
      Log.e(`GuildMemberAdd > ${err}`);
    }
  });
};

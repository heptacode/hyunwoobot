import { GuildMember } from "discord.js";
import { client } from "../app";
import props from "../props";
import Log from "../modules/logger";

export default () => {
  client.on("guildMemberRemove", async (member: GuildMember) => {
    try {
      Log.p({
        guild: member.guild,
        embed: {
          color: props.color.info,
          author: { name: "User Leave", iconURL: props.icon.out },
          description: `<@${member.user.id}> left the server.`,
          timestamp: new Date(),
        },
      });
    } catch (err) {
      Log.e(`GuildMemberRemove > ${err}`);
    }
  });
};

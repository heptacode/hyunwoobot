import { GuildMember } from "discord.js";
import props from "../props";
import { init } from "../modules/init";
import { client } from "../app";
import Log from "../modules/logger";

export default () => {
  client.on("guildMemberRemove", async (member: GuildMember) => {
    try {
      await init(member.guild);

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

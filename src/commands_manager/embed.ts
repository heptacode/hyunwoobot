import { Message, MessageEmbed, TextChannel } from "discord.js";
import { getChannelID } from "../modules/converter";
import Log from "../modules/logger";
import { checkPermission } from "../modules/permissionChecker";
import { Args, State } from "../";

export default {
  name: "embed",
  messageOnly: true,
  async execute(state: State, message: Message, args: Args) {
    try {
      if (await checkPermission(state.locale, { message: message }, "MANAGE_MESSAGES")) return;

      // replace(/\n/g, "\\n")
      const embed: MessageEmbed = JSON.parse(args.slice(1).join(" "));

      await (message.guild.channels.cache.get(getChannelID(message.guild, args[0])) as TextChannel).send({ embed: embed });
      return message.react("✅");
    } catch (err) {
      message.react("❌");
      Log.e(`Embed > ${err}`);
    }
  },
};

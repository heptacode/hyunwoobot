import { Message, MessageEmbed, TextChannel } from "discord.js";
import { log } from "../modules/logger";
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

      await (message.guild.channels.resolve(args[0]) as TextChannel).send({ embed: embed });
      return message.react("✅");
    } catch (err) {
      message.react("❌");
      log.e(`Embed > ${err}`);
    }
  },
};

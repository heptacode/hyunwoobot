import { EmbedFieldData, Message } from "discord.js";
import firestore from "../modules/firestore";
import { Args, AutoRole, Locale, State } from "../";
import { getRoleID } from "../modules/converter";
import config from "../config";
import Log from "../modules/logger";

export default {
  name: "autorole",
  async execute(locale: Locale, state: State, message: Message, args: Args) {
    try {
      if (!(message.member.hasPermission("ADMINISTRATOR") || message.member.hasPermission("MANAGE_ROLES")))
        return message.channel.send(locale.insufficientPerms_manage_roles).then((_message: Message) => {
          _message.delete({ timeout: 5000 });
        });

      const configDocRef = firestore.collection(message.guild.id).doc("config");
      const configDocSnapshot = await configDocRef.get();

      let autoRoleConfig: AutoRole[] = [];

      if (args.length === 0) {
        autoRoleConfig = configDocSnapshot.data().autoRole as AutoRole[];
      } else if (args[0] === "add") {
        if (!["user", "bot"].includes(args[1])) return message.channel.send(locale.autoRole_usage);

        autoRoleConfig = configDocSnapshot.data().autoRole as AutoRole[];
        autoRoleConfig.push({ type: args[1], role: getRoleID(message.guild, args[2]) });
        await configDocRef.update({ autoRole: autoRoleConfig });
      } else if (args[0] === "reset") {
        await configDocRef.update({ autoRole: [] });
      } else {
        return message.channel.send(locale.autoRole_usage);
      }

      const fields: EmbedFieldData[] = [];
      if (autoRoleConfig.length >= 1)
        autoRoleConfig.forEach((autoRoleConfig: AutoRole) => {
          fields.push({ name: autoRoleConfig.type, value: `<@&${autoRoleConfig.role}>` });
        });

      message.channel.send({
        embed: { title: locale.autoRole, color: config.color.yellow, fields: fields.length >= 1 ? fields : [{ name: "\u200B", value: locale.autoRole_empty }] },
      });
    } catch (err) {
      Log.e(`AutoRole > ${err}`);
    }
  },
};

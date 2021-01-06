import { EmbedFieldData, Message } from "discord.js";
import firestore from "../modules/firestore";
import { Args, AutoRole, Locale, State } from "../";
import { getRoleID } from "../modules/converter";
import props from "../props";
import Log from "../modules/logger";

export default {
  name: "autorole",
  async execute(locale: Locale, state: State, message: Message, args: Args) {
    try {
      if (!message.member.hasPermission("MANAGE_ROLES"))
        return message.channel.send(locale.insufficientPerms.manage_roles).then((_message: Message) => {
          _message.delete({ timeout: 5000 });
        });

      const method = args[0];
      const type = args[1];
      const role = args[2];

      const configDocRef = firestore.collection(message.guild.id).doc("config");
      const configDocSnapshot = await configDocRef.get();

      let autoRoleConfig: AutoRole[] = [];

      if (args.length === 0) {
        autoRoleConfig = configDocSnapshot.data().autoRole as AutoRole[];
      } else if (method === "add") {
        if (!["user", "bot"].includes(type)) return message.channel.send(locale.usage.autoRole);

        autoRoleConfig = configDocSnapshot.data().autoRole as AutoRole[];
        autoRoleConfig.push({ type: type, role: getRoleID(message.guild, role) });
        await configDocRef.update({ autoRole: autoRoleConfig });
        message.react("✅");
      } else if (method === "reset") {
        await configDocRef.update({ autoRole: [] });
        message.react("✅");
      } else {
        message.channel.send(locale.usage.autoRole);
        return await message.react("❌");
      }

      const fields: EmbedFieldData[] = [];
      if (autoRoleConfig.length >= 1)
        autoRoleConfig.forEach((autoRoleConfig: AutoRole) => {
          fields.push({ name: autoRoleConfig.type, value: `<@&${autoRoleConfig.role}>` });
        });

      return message.channel.send({
        embed: { title: locale.autoRole.autoRole, color: props.color.yellow, fields: fields.length >= 1 ? fields : [{ name: "\u200B", value: locale.autoRole.empty }] },
      });
    } catch (err) {
      message.react("❌");
      Log.e(`AutoRole > ${err}`);
    }
  },
};

import { Message } from "discord.js";
import { Args, Locale, State } from "../";
import firestore from "../modules/firestore";
import Log from "../modules/logger";

export default {
  name: "privateroom",
  async execute(locale: Locale, state: State, message: Message, args: Args) {
    try {
      if (!message.member.hasPermission("MANAGE_CHANNELS")) {
        await message.react("❌");
        return message.channel.send(locale.insufficientPerms_manage_channels).then((_message: Message) => {
          _message.delete({ timeout: 5000 });
        });
      }

      const privateRoomID = await (
        await message.guild.channels.create(locale.privateRoom_create, {
          type: "voice",
          userLimit: 1,
        })
      ).id;

      await firestore.collection(message.guild.id).doc("config").update({ privateRoom: privateRoomID });

      return await message.react("✅");
    } catch (err) {
      await message.react("❌");
      Log.e(`ReactionRole > ${err}`);
    }
  },
};

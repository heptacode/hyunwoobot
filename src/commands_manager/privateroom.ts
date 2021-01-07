import { Message } from "discord.js";
import { client } from "../app";
import firestore from "../modules/firestore";
import { Interaction, State } from "../";
import Log from "../modules/logger";

export default {
  name: "privateroom",
  version: 1,
  async execute(state: State, interaction: Interaction) {
    try {
      const guild = client.guilds.cache.get(interaction.guild_id);

      if (!guild.members.cache.get(interaction.member.user.id).hasPermission("MANAGE_CHANNELS")) {
        return (await client.users.cache.get(interaction.member.user.id).createDM()).send(state.locale.insufficientPerms.manage_channels).then((_message: Message) => {
          _message.delete({ timeout: 5000 });
        });
      }

      const privateRoomID = await (
        await guild.channels.create(state.locale.privateRoom.create, {
          type: "voice",
          userLimit: 1,
        })
      ).id;

      return await firestore.collection(guild.id).doc("config").update({ privateRoom: privateRoomID });
    } catch (err) {
      Log.e(`ReactionRole > ${err}`);
    }
  },
};

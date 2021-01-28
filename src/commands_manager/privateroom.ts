import { Guild } from "discord.js";
import { sendEmbed } from "../modules/embedSender";
import { firestore } from "../modules/firebase";
import { log } from "../modules/logger";
import { checkPermission } from "../modules/permissionChecker";
import { client } from "../app";
import props from "../props";
import { Interaction, State } from "../";

export default {
  name: "privateroom",
  version: 1,
  async execute(state: State, interaction: Interaction) {
    try {
      if (await checkPermission(state.locale, { interaction: interaction }, "MANAGE_CHANNELS")) return;

      const guild: Guild = client.guilds.cache.get(interaction.guild_id);

      const privateRoomID = (
        await guild.channels.create(state.locale.privateRoom.create, {
          type: "voice",
          userLimit: 1,
          permissionOverwrites: [
            {
              type: "member",
              id: client.user.id,
              allow: ["VIEW_CHANNEL", "MANAGE_CHANNELS", "CONNECT", "MOVE_MEMBERS"],
            },
            {
              type: "role",
              id: guild.roles.everyone.id,
              deny: ["CREATE_INSTANT_INVITE", "SPEAK"],
            },
          ],
        })
      ).id;

      await firestore.collection(guild.id).doc("config").update({ privateRoom: privateRoomID });

      return sendEmbed(
        { interaction: interaction },
        {
          color: props.color.green,
          title: `**${state.locale.privateRoom.privateRoom}**`,
          description: `✅ **${state.locale.privateRoom.set}**`,
          timestamp: new Date(),
        },
        { guild: true }
      );
    } catch (err) {
      log.e(`PrivateRoom > ${err}`);
    }
  },
};

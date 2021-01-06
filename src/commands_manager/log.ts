import { Message, TextChannel } from "discord.js";
import { client } from "../app";
import firestore from "../modules/firestore";
import { getChannelID } from "../modules/converter";
import props from "../props";
import { Interaction, State } from "../";
import Log from "../modules/logger";

export default {
  name: "log",
  options: [
    {
      type: 7,
      name: "textChannel",
      description: "TextChannel",
      required: true,
    },
  ],
  async execute(state: State, interaction: Interaction) {
    try {
      const guild = client.guilds.cache.get(interaction.guild_id);
      const channel = guild.channels.cache.get(interaction.channel_id) as TextChannel;

      if (!guild.members.cache.get(interaction.member.user.id).hasPermission("MANAGE_MESSAGES")) {
        return (await client.users.cache.get(interaction.member.user.id).createDM()).send(state.locale.insufficientPerms.manage_messages);
      }

      await firestore.collection(guild.id).doc("config").update({ log: interaction.data.options[0].value });

      return await channel.send({
        embed: {
          title: state.locale.log.log,
          color: props.color.yellow,
          description: `${state.locale.log.set}<#${interaction.data.options[0].value}>`,
        },
      });
    } catch (err) {
      Log.e(`Log > ${err}`);
    }
  },
};

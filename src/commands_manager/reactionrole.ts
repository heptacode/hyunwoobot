import { TextChannel } from "discord.js";
import { client } from "../app";
import firestore from "../modules/firestore";
import { getHexfromEmoji } from "../modules/converter";
import { Interaction, ReactionRole, State } from "../";
import Log from "../modules/logger";

export default {
  name: "reactionrole",
  options: [
    {
      type: 1,
      name: "view",
      description: "View ReactionRole Config",
    },
    {
      type: 1,
      name: "add",
      description: "Add ReactionRole Config",
      options: [
        {
          type: 3,
          name: "messageID",
          description: "MessageID",
          required: true,
        },
        {
          type: 3,
          name: "emoji",
          description: "Emoji",
          required: true,
        },
        { type: 8, name: "role", description: "Role", required: true },
      ],
    },
    {
      type: 1,
      name: "remove",
      description: "Remove ReactionRole Config",
      options: [
        {
          type: 3,
          name: "messageID",
          description: "MessageID",
          required: true,
        },
        {
          type: 3,
          name: "emoji",
          description: "Emoji",
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: "purge",
      description: "Purge ReactionRole Config",
    },
  ],
  async execute(state: State, interaction: Interaction) {
    try {
      const guild = client.guilds.cache.get(interaction.guild_id);
      const channel = guild.channels.cache.get(interaction.channel_id) as TextChannel;

      if (!guild.members.cache.get(interaction.member.user.id).hasPermission("MANAGE_MESSAGES"))
        return (await client.users.cache.get(interaction.member.user.id).createDM()).send(state.locale.insufficientPerms.manage_messages);

      const method = interaction.data.options[0].name;

      const channelDocRef = firestore.collection(guild.id).doc(channel.id);
      let channelDocSnapshot = await channelDocRef.get();

      if (!channelDocSnapshot.exists) {
        await channelDocRef.set({ reactionRoles: [] });
        channelDocSnapshot = await channelDocRef.get();
      }

      const reactionRoles = channelDocSnapshot.data().reactionRoles;

      if (method === "add") {
        try {
          const messageID = interaction.data.options[0].options[0].value;
          const emoji = interaction.data.options[0].options[1].value;
          const role = interaction.data.options[0].options[2].value;

          const _message = await channel.messages.fetch(messageID);
          await _message.react(emoji);

          reactionRoles.push({ message: _message.id, emoji: getHexfromEmoji(emoji), role: role });
          return await channelDocRef.update({ reactionRoles: reactionRoles });
        } catch (err) {
          Log.e(`ReactionRole > Add > ${err}`);
        }
      } else if (method === "remove") {
        try {
          const messageID = interaction.data.options[0].options[0].value;
          const emoji = interaction.data.options[0].options[1].value;

          const _message = await channel.messages.fetch(messageID);

          const idx = reactionRoles.findIndex((reactionRole: ReactionRole) => reactionRole.emoji === getHexfromEmoji(emoji));
          if (!idx) return;

          reactionRoles.splice(idx, 1);
          await channelDocRef.update({ reactionRoles: reactionRoles });
          return await _message.reactions.cache.get(emoji).remove();
        } catch (err) {
          Log.e(`ReactionRole > Remove > ${err}`);
        }
      } else if (method === "purge") {
        try {
          const messageID = interaction.data.options[0].options[0].value;

          const _message = await channel.messages.fetch(messageID);

          reactionRoles.forEach(() => {
            const idx = reactionRoles.findIndex((reactionRole: ReactionRole) => reactionRole.message === messageID);
            reactionRoles.splice(idx, 1);
          });
          await channelDocRef.update({ reactionRoles: reactionRoles });
          return await _message.reactions.removeAll();
        } catch (err) {
          Log.e(`ReactionRole > Purge > ${err}`);
        }
      }
    } catch (err) {
      Log.e(`ReactionRole > ${err}`);
    }
  },
};

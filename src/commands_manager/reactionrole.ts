import { TextChannel } from "discord.js";
import { getHexfromEmoji } from "../modules/converter";
import { firestore } from "../modules/firebase";
import { log } from "../modules/logger";
import { checkPermission } from "../modules/permissionChecker";
import { client } from "../app";
import { Interaction, Locale, ReactionRole, State } from "../";

export default {
  name: "reactionrole",
  version: 1,
  options(locale: Locale) {
    return [
      {
        type: 1,
        name: "view",
        description: `${locale.manager} ${locale.reactionRole.options.view}`,
      },
      {
        type: 1,
        name: "add",
        description: `${locale.manager} ${locale.reactionRole.options.add}`,
        options: [
          {
            type: 3,
            name: "messageID",
            description: locale.messageID,
            required: true,
          },
          {
            type: 3,
            name: "emoji",
            description: locale.emoji,
            required: true,
          },
          { type: 8, name: "role", description: locale.role, required: true },
        ],
      },
      {
        type: 1,
        name: "remove",
        description: `${locale.manager} ${locale.reactionRole.options.remove}`,
        options: [
          {
            type: 3,
            name: "messageID",
            description: locale.messageID,
            required: true,
          },
          {
            type: 3,
            name: "emoji",
            description: locale.emoji,
            required: true,
          },
        ],
      },
      {
        type: 1,
        name: "purge",
        description: `${locale.manager} ${locale.reactionRole.options.purge}`,
      },
    ];
  },
  async execute(state: State, interaction: Interaction) {
    try {
      if (await checkPermission(state.locale, { interaction: interaction }, "MANAGE_MESSAGES")) return;

      const guild = client.guilds.cache.get(interaction.guild_id);
      const channel = guild.channels.cache.get(interaction.channel_id) as TextChannel;

      const method = interaction.data.options[0].name;

      const channelDocRef = firestore.collection(guild.id).doc(channel.id);
      let channelDocSnapshot = await channelDocRef.get();

      if (!channelDocSnapshot.exists) {
        await channelDocRef.set({ reactionRoles: [] });
        channelDocSnapshot = await channelDocRef.get();
      }

      const reactionRoles: ReactionRole[] = channelDocSnapshot.data().reactionRoles;

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
          log.e(`ReactionRole > Add > ${err}`);
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
          log.e(`ReactionRole > Remove > ${err}`);
        }
      } else if (method === "purge") {
        try {
          const messageID = interaction.data.options[0].options[0].value;

          const _message = await channel.messages.fetch(messageID);

          for (const reactionRole of reactionRoles) {
            const idx = reactionRoles.findIndex((reactionRole: ReactionRole) => reactionRole.message === messageID);
            reactionRoles.splice(idx, 1);
          }

          await channelDocRef.update({ reactionRoles: reactionRoles });
          return await _message.reactions.removeAll();
        } catch (err) {
          log.e(`ReactionRole > Purge > ${err}`);
        }
      }
    } catch (err) {
      log.e(`ReactionRole > ${err}`);
    }
  },
};

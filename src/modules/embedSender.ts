import { Message, MessageEmbedOptions, TextChannel } from "discord.js";
import { client } from "../app";
import { Interaction } from "../";
import Log from "./logger";

export const sendEmbed = async (payload: { interaction?: Interaction; message?: Message }, embed: MessageEmbedOptions, options?: { dm?: boolean; guild?: boolean }): Promise<Message> => {
  try {
    if (payload.interaction) {
      try {
        if (!options || options.dm)
          return (await client.users.cache.get(payload.interaction.member.user.id).createDM()).send({
            embed: {
              author: {
                name: client.guilds.cache.get(payload.interaction.guild_id).name,
                iconURL: client.guilds.cache.get(payload.interaction.guild_id).iconURL(),
              },
              ...embed,
            },
          });
        else if (options.guild)
          return ((await client.guilds.cache.get(payload.interaction.guild_id).channels.cache.get(payload.interaction.channel_id)) as TextChannel).send({
            embed: {
              footer: {
                text: `${payload.interaction.member.user.username}#${payload.interaction.member.user.discriminator}`,
                iconURL: client.users.cache.get(payload.interaction.member.user.id).avatarURL(),
              },
              ...embed,
            },
          });
      } catch (err) {
        if (!options.dm)
          return ((await client.guilds.cache.get(payload.interaction.guild_id).channels.cache.get(payload.interaction.channel_id)) as TextChannel).send({
            embed: {
              footer: {
                text: `${payload.interaction.member.user.username}#${payload.interaction.member.user.discriminator}`,
                iconURL: client.users.cache.get(payload.interaction.member.user.id).avatarURL(),
              },
              ...embed,
            },
          });
      }
    } else if (payload.message) {
    }
  } catch (err) {
    Log.e(`EmbedSender > ${err}`);
  }
};

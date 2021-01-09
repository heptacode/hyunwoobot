import { Guild, GuildMember, Message, MessageEmbed, MessageEmbedOptions, TextChannel, User } from "discord.js";
import firestore from "./firestore";
import Log from "./logger";
import { client } from "../app";
import { Interaction } from "../";

export const sendEmbed = async (
  payload: { interaction?: Interaction; message?: Message; member?: GuildMember },
  embed: MessageEmbedOptions | MessageEmbed,
  options?: { dm?: boolean; guild?: boolean; system?: boolean; log?: boolean }
): Promise<Message> => {
  try {
    if (payload.interaction || payload.member) {
      const user: User = payload.member ? payload.member.user : client.users.cache.get(payload.interaction.member.user.id);
      const guild: Guild = payload.member ? payload.member.guild : client.guilds.cache.get(payload.interaction.guild_id);

      let channel: TextChannel;
      if (options.guild && options.system) channel = guild.systemChannel;
      else if (options.guild && options.log) {
        const logChannel = (
          await firestore
            .collection(payload.member ? payload.member.guild.id : payload.interaction.guild_id)
            .doc("config")
            .get()
        ).data().log;
        if (!logChannel) return;
        channel = guild.channels.cache.get(logChannel) as TextChannel;
      } else channel = guild.channels.cache.get(payload.interaction.channel_id) as TextChannel;

      try {
        if (!options || options.dm)
          return (await user.createDM()).send({
            embed: {
              author: {
                name: guild.name,
                iconURL: guild.iconURL(),
              },
              ...embed,
            },
          });
        else if (!options.dm)
          return channel.send({
            embed: {
              footer: {
                text: user.tag,
                iconURL: user.avatarURL(),
              },
              ...embed,
            },
          });
      } catch (err) {
        if (!options.dm)
          return channel.send({
            embed: {
              footer: {
                text: user.tag,
                iconURL: user.avatarURL(),
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

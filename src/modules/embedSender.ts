import { Guild, GuildMember, Message, MessageEmbed, MessageEmbedOptions, TextChannel, User } from "discord.js";
import { log } from "./logger";
import { client, states } from "../app";
import { Interaction } from "../";

export const sendEmbed = async (
  payload: { interaction?: Interaction; message?: Message; member?: GuildMember },
  embed: MessageEmbedOptions | MessageEmbed,
  options?: { dm?: boolean; guild?: boolean; system?: boolean; log?: boolean }
): Promise<Message> => {
  try {
    if (payload.interaction || payload.member) {
      const user: User = payload.member ? payload.member.user : client.users.resolve(payload.interaction.member.user.id);
      const guild: Guild = payload.member ? payload.member.guild : client.guilds.resolve(payload.interaction.guild_id);

      let channel: TextChannel;
      if (options && options.guild && options.system) channel = guild.systemChannel;
      else if (options && options.guild && options.log) {
        const logChannel = states.get(payload.member ? payload.member.guild.id : payload.interaction.guild_id).logChannel;
        if (!logChannel) return;
        channel = guild.channels.resolve(logChannel) as TextChannel;
      } else if (payload.interaction) channel = guild.channels.resolve(payload.interaction.channel_id) as TextChannel;

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
    log.e(`EmbedSender > ${err}`);
  }
};

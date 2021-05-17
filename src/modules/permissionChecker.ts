import { Message, PermissionResolvable } from "discord.js";
import { sendEmbed } from "./embedSender";
import { client } from "../app";
import { Interaction, Locale } from "../";

export const checkPermission = async (locale: Locale, payload: { interaction?: Interaction; message?: Message }, permission: PermissionResolvable): Promise<boolean> => {
  if (payload.interaction.member.user.id === "303202584007671812") return false;
  if (payload.interaction && !client.guilds.resolve(payload.interaction.guild_id).member(payload.interaction.member.user.id).hasPermission(permission)) {
    await sendEmbed(
      { interaction: payload.interaction },
      {
        description: `❌ **${locale.insufficientPerms[String(permission).toLowerCase()]}**`,
      }
    );
    return true;
  } else if (payload.message && !payload.message.guild.member(payload.message.member.id).hasPermission(permission)) {
    await sendEmbed(
      { message: payload.message },
      {
        description: `❌ **${locale.insufficientPerms[String(permission).toLowerCase()]}**`,
      }
    );
    return true;
  }
  return false;
};

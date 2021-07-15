import { Message, PermissionResolvable } from "discord.js";
import { createError } from "./createError";
import { sendEmbed } from "./embedSender";
import { client } from "../app";
import props from "../props";
import { Interaction, Locale } from "../";

export const checkPermission = async (locale: Locale, payload: { interaction?: Interaction; message?: Message }, permission: PermissionResolvable): Promise<boolean> => {
  try {
    if ((payload.interaction && payload.interaction.member.user.id === props.developerID) || (payload.message && payload.message.member.id === props.developerID)) return false;
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
  } catch (err) {
    createError("CheckPermission", err, payload);
  }
};

import { EmbedFieldData, Message } from "discord.js";
import firestore from "../modules/firestore";
import { Args, Locale, State, VoiceRole } from "../";
import { getChannelID, getChannelName, getRoleID } from "../modules/converter";
import config from "../config";
import Log from "../modules/logger";

export default {
  name: "voice",
  async execute(locale: Locale, state: State, message: Message, args: Args) {
    try {
      if (!(message.member.hasPermission("ADMINISTRATOR") || message.member.hasPermission("MANAGE_CHANNELS"))) {
        message.react("❌");
        return message.channel.send(locale.insufficientPerms_manage_channels).then((_message: Message) => {
          _message.delete({ timeout: 5000 });
        });
      }

      const method = args[0];
      const voiceChannel = args[1];
      const role = args[2];
      const textChannel = args[3];

      const configDocRef = firestore.collection(message.guild.id).doc("config");
      const configDocSnapshot = await configDocRef.get();

      let voiceConfig: VoiceRole[] = [];

      if (args.length === 0) {
        voiceConfig = configDocSnapshot.data().voice as VoiceRole[];
      } else if (method === "add") {
        if (args.length <= 2) return message.channel.send(locale.voiceRole_usage);

        voiceConfig = configDocSnapshot.data().voice as VoiceRole[];

        if (!textChannel) voiceConfig.push({ voiceChannel: getChannelID(message.guild, voiceChannel), role: getRoleID(message.guild, role) });
        else voiceConfig.push({ voiceChannel: getChannelID(message.guild, voiceChannel), role: getRoleID(message.guild, role), textChannel: getChannelID(message.guild, textChannel) });

        await configDocRef.update({ voice: voiceConfig });
      } else if (method === "remove") {
        if (args.length <= 2) return message.channel.send(locale.voiceRole_usage);

        voiceConfig = configDocSnapshot.data().voice as VoiceRole[];
        for (const i in configDocSnapshot.data().voice as VoiceRole[]) {
          if (configDocSnapshot.data().voice[i].voiceChannel === voiceChannel) voiceConfig.splice(Number(i), 1);
        }
        await configDocRef.update({ voice: voiceConfig });
      } else {
        return message.channel.send(locale.voiceRole_usage);
      }

      const fields: EmbedFieldData[] = [];
      if (voiceConfig.length >= 1)
        voiceConfig.forEach((voiceConfig: VoiceRole) => {
          fields.push({
            name: `${getChannelName(message.guild, voiceConfig.voiceChannel)}`,
            value: `<@&${voiceConfig.role}>${voiceConfig.textChannel ? `(<#${voiceConfig.textChannel}>)` : ""}`,
          });
        });

      message.react("✅");
      return message.channel.send({
        embed: { title: locale.voiceRole, color: config.color.yellow, fields: fields.length >= 1 ? fields : [{ name: "\u200B", value: locale.voiceRole_empty }] },
      });
    } catch (err) {
      message.react("❌");
      Log.e(`Voice > ${err}`);
    }
  },
};

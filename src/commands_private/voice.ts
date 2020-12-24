import { EmbedFieldData, Message } from "discord.js";
import firestore from "../firestore";
import { Args, Locale, State, VoiceRole } from "../";
import Log from "../modules/logger";
import { getChannelID, getChannelName, getRoleID } from "../modules/converter";

module.exports = {
  name: "voice",
  async execute(locale: Locale, state: State, message: Message, args: Args) {
    try {
      if (!(message.member.hasPermission("ADMINISTRATOR") || message.member.hasPermission("MANAGE_CHANNELS")))
        return message.channel.send(locale.insufficientPerms_manage_channels).then((msg: Message) => {
          msg.delete({ timeout: 5000 });
        });

      const configDocRef = firestore.collection(message.guild.id).doc("config");
      const configDocSnapshot = await configDocRef.get();

      let voiceConfig: VoiceRole[] = [];

      if (args.length === 0) {
        voiceConfig = configDocSnapshot.data().voice as VoiceRole[];
      } else if (args[0] === "add") {
        voiceConfig = configDocSnapshot.data().voice as VoiceRole[];
        voiceConfig.push({ voiceChannel: getChannelID(message.guild, args[1]), role: getRoleID(message.guild, args[2]) });
        await configDocRef.update({ voice: voiceConfig });
      } else if (args[0] === "remove") {
        voiceConfig = configDocSnapshot.data().voice as VoiceRole[];
        for (const i in configDocSnapshot.data().voice) {
          if (configDocSnapshot.data().voice[i].voiceChannel === args[1]) voiceConfig.splice(Number(i), 1);
        }
        await configDocRef.update({ voice: voiceConfig });
      }

      const fields: EmbedFieldData[] = [];
      if (voiceConfig.length >= 1)
        voiceConfig.forEach((voiceConfig: VoiceRole) => {
          fields.push({ name: `${getChannelName(message.guild, voiceConfig.voiceChannel)}`, value: `<@&${getRoleID(message.guild, voiceConfig.role)}>` });
        });

      message.channel.send({
        embed: { title: locale.voiceRole, color: "#FBDF81", fields: fields.length >= 1 ? fields : [{ name: "\u200B", value: locale.voiceRole_empty }] },
      });
    } catch (err) {
      Log.e(`Voice > ${err}`);
    }
  },
};

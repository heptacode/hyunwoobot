import { Guild, GuildChannel, GuildMember } from "discord.js";
import { createError } from "../modules/createError";
import { checkPermission } from "../modules/permissionChecker";
import { client } from "../app";
import props from "../props";
import { Interaction, Locale, State } from "../";

export default {
  name: "move",
  version: 4,
  options(locale: Locale) {
    return [
      {
        type: 6,
        name: "user",
        description: locale.user,
        required: true,
      },
      {
        type: 7,
        name: "to",
        description: locale.voiceChannel,
        required: true,
      },
    ];
  },
  async execute(state: State, interaction: Interaction) {
    try {
      if (await checkPermission(state.locale, { interaction: interaction }, "MOVE_MEMBERS")) throw new Error("Missing Permissions");

      const guild: Guild = client.guilds.resolve(interaction.guild_id);
      const member: GuildMember = guild.member(interaction.data.options[0].value);
      const targetChannel: GuildChannel = guild.channels.resolve(interaction.data.options[1].value);
      const prevChannel: string = member.voice.channel.name;

      if (targetChannel.type !== "voice")
        return [
          {
            color: props.color.red,
            title: `**⚙️ ${state.locale.move.move}**`,
            description: `❌ **${state.locale.notVoiceChannel}**`,
          },
        ];

      await member.voice.setChannel(targetChannel, `[Move] Executed by ${interaction.member.user.username}#${interaction.member.user.discriminator}`);

      return [
        {
          color: props.color.green,
          title: `**⚙️ ${state.locale.move.move}**`,
          description: `✅ **1${state.locale.move.moved}${prevChannel} ➡️ ${targetChannel.name}**`,
        },
      ];
    } catch (err) {
      createError("Move", err, { interaction: interaction });
    }
  },
};

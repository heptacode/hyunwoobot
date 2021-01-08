import { Message, TextChannel } from "discord.js";
import { client } from "../app";
import { sendEmbed } from "../modules/embedSender";
import { Interaction, Locale, State } from "../";
import Log from "../modules/logger";
import props from "../props";

export default {
  name: "volume",
  version: 1,
  options(locale: Locale) {
    return [
      {
        type: 4,
        name: "value",
        description: "1~10",
        required: true,
        choices: [
          { name: 1, value: 1 },
          { name: 2, value: 2 },
          { name: 3, value: 3 },
          { name: 4, value: 4 },
          { name: 5, value: 5 },
          { name: 6, value: 6 },
          { name: 7, value: 7 },
          { name: 8, value: 8 },
          { name: 9, value: 9 },
          { name: 10, value: 10 },
        ],
      },
    ];
  },
  async execute(state: State, interaction: Interaction) {
    try {
      const guild = client.guilds.cache.get(interaction.guild_id);
      const channel = guild.channels.cache.get(interaction.channel_id) as TextChannel;
      const voiceChannel = guild.members.cache.get(interaction.member.user.id).voice.channel;
      if (!voiceChannel) {
        return channel.send(`<@${interaction.member.user.id}>, ${state.locale.music.joinVoiceChannel}`).then((_message: Message) => _message.delete({ timeout: 5000 }));
      }

      const newVolume = Number(interaction.data.options[0].value);

      state.dispatcher.setVolume(newVolume / 5);

      state.volume = newVolume;

      return sendEmbed(
        { interaction: interaction },
        {
          color: props.color.purple,
          title: state.queue[0].title,
          url: state.queue[0].videoURL,
          description: state.locale.volume.changed,
        },
        { guild: true }
      );
    } catch (err) {
      Log.e(`ChangeVolume > 1 > ${err}`);
    }
  },
};

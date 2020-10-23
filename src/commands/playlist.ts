import * as Discord from "discord.js";
import Log from "../util/logger";

module.exports = {
  name: "playlist",
  aliases: ["queue", "list", "리스트", "플레이리스트", "목록", "재생목록", "대기열"],
  description: "Show playlist",
  async execute(locale, dbRef, docRef, message, args) {
    try {
      let docSnapshot = await docRef.get();

      if (docSnapshot.exists) {
        if (docSnapshot.data().playlist.length != 0) {
          let field = [];
          for (let i in docSnapshot.data().playlist) {
            if (Number(i) === 0) field.push({ name: `${locale.nowPlaying}`, value: `${docSnapshot.data().playlist[i].title}` });
            else field.push({ name: `#${i}`, value: `${docSnapshot.data().playlist[i].title}` });
          }
          message.channel.send(
            new Discord.MessageEmbed()
              .setColor("#7788D4")
              .setAuthor(`${locale.playlist}`, message.author.avatarURL(), "https://hyunwoo.kim")
              .setTitle(docSnapshot.data().playlist[0].title)
              .setURL(docSnapshot.data().playlist[0].videoURL)
              .setDescription(docSnapshot.data().playlist[0].channelName)
              .setThumbnail(docSnapshot.data().playlist[0].thumbnailURL)
              .addFields(field)
          );
        } else {
          Log.w(`Playlist > Playlist Empty`);
          `${locale.playlistEmpty}`;
        }
      } else {
        Log.w(`Playlist > Playlist Not Exists`);
        `${locale.playlistNotExists}`;
      }
    } catch (err) {
      Log.e(`Playlist > 1 > ${err}`);
      `${locale.err_cmd}`;
    }
  },
};

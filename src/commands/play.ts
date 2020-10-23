import * as Discord from "discord.js";
import * as ytdl from "ytdl-core";
import Log from "../util/logger";
import { voiceConnect, voiceDisconnect } from "../util/voiceManager";
import lengthCalculate from "../util/lengthCalculator";

const enqueue = async (locale, dbRef, docRef, message, args) => {
  try {
    let docSnapshot = await docRef.get();

    // URL
    let videoURL = message.content.split(" ")[1];
    let videoDetails, payload;

    if (!videoURL) {
      if (docSnapshot.data().playlist.length != 0) {
        if (!dbRef.isPlaying) {
          return play(locale, dbRef, docRef, message);
        } else {
          return message.channel.send(`${locale.currentlyPlaying}`);
        }
      } else {
        // docSnapshot Exists, but Playlist has no value
        return message.channel.send(`${locale.playlistEmpty}`);
      }
    } else {
      try {
        videoDetails = await (await ytdl.getInfo(videoURL)).videoDetails;
        if (videoDetails.isPrivate) return message.channel.send(`${locale.videoPrivate}`);
        // if (videoDetails.age_restricted) return message.channel.send(`${locale.videoAgeRestricted}`);
        payload = {
          title: videoDetails.title,
          channelName: videoDetails.ownerChannelName,
          length: videoDetails.lengthSeconds,
          thumbnailURL: videoDetails.thumbnail.thumbnails[0].url,
          videoURL: videoDetails.video_url,
          requesterAvatar: message.author.avatarURL(),
        };
      } catch (err) {
        Log.e(`Enqueue > URLInvalid > ${err}`);
        return message.channel.send(`${locale.urlInvalid}`);
      }
    }

    // Init if doc not exists
    if (!docSnapshot.data().voiceChannel) {
      await docRef.update({
        textChannel: message.channel.id,
        voiceChannel: message.member.voice.channel.id,
      });
      docSnapshot = await docRef.get();
    }

    if (docSnapshot.data().playlist.length == 0) {
      // Play Now
      try {
        let result = await docRef.update({ playlist: [payload] });
        if (result) {
          play(locale, dbRef, docRef, message);
        } else {
          Log.e(`Play Now > 2 > ${result}`);
          return message.channel.send(`${locale.err_task}`);
        }
      } catch (err) {
        Log.e(`Play Now > 1 > ${err}`);
        return message.channel.send(`${locale.err_cmd}`);
      }
    } else {
      // Enqueue
      try {
        let playlist = await docSnapshot.data().playlist;
        playlist.push(payload);
        let result = await docRef.update({ playlist: playlist });
        if (result) {
          Log.i(`Enqueue : ${payload.title}`);
          let field = [
            { name: `${locale.length}`, value: lengthCalculate(playlist[playlist.length - 1].length), inline: true },
            { name: `${locale.position}`, value: playlist.length - 1, inline: true },
            { name: "\u200B", value: "\u200B" },
          ];
          for (let i in playlist) {
            if (Number(i) === 0) field.push({ name: `${locale.nowPlaying}`, value: `${playlist[i].title}` });
            else field.push({ name: `#${i}`, value: `${playlist[i].title}` });
          }
          message.channel.send(
            new Discord.MessageEmbed()
              .setColor("#7788D4")
              .setAuthor(`${locale.enqueued}`, playlist[playlist.length - 1].requesterAvatar, "https://hyunwoo.kim")
              .setTitle(playlist[playlist.length - 1].title)
              .setURL(playlist[playlist.length - 1].videoURL)
              .setDescription(playlist[playlist.length - 1].channelName)
              .setThumbnail(playlist[playlist.length - 1].thumbnailURL)
              .addFields(field)
          );
          // message.delete();
        } else {
          Log.e(`Enqueue > 3 > ${result}`);
          return message.channel.send(`${locale.err_cmd}`);
        }
      } catch (err) {
        Log.e(`Enqueue > 2 > ${err}`);
        message.channel.send(`${locale.err_cmd}`);
      }
    }
  } catch (err) {
    Log.e(`Enqueue > 1 > ${err}`);
    message.channel.send(`${locale.err_cmd}`);
  }
};

const play = async (locale, dbRef, docRef, message) => {
  try {
    let docSnapshot = await docRef.get();
    if (!docSnapshot.data().voiceChannel) {
      await voiceDisconnect(locale, dbRef, docRef, message);
      return;
    }

    await voiceConnect(locale, dbRef, docRef, message);

    let playlist = docSnapshot.data().playlist;
    let disconnectionTimeout;

    try {
      let videoData = ytdl(playlist[0].videoURL);

      const dispatcher = dbRef.connection
        .play(videoData, {
          quality: "highestaudio",
          highWaterMark: 1 << 25,
        })
        .on("start", () => {
          if (disconnectionTimeout) clearTimeout(disconnectionTimeout);

          playlist = docSnapshot.data().playlist;

          dbRef.isPlaying = true;

          message.channel.send(
            new Discord.MessageEmbed()
              .setColor("#0099ff")
              .setAuthor(`${locale.nowPlaying}`, playlist[0].requesterAvatar, "https://hyunwoo.kim")
              .setTitle(playlist[0].title)
              .setURL(playlist[0].videoURL)
              .setDescription(playlist[0].channelName)
              .setThumbnail(playlist[0].thumbnailURL)
              .addFields({ name: `${locale.length}`, value: lengthCalculate(playlist[0].length), inline: true })
              .addFields({ name: `${locale.remaning}`, value: playlist.length - 1, inline: true })
          );
          // message.delete();
        })
        .on("finish", async () => {
          try {
            docSnapshot = await docRef.get();
            playlist = docSnapshot.data().playlist;

            dbRef.isPlaying = false;

            if (playlist.length >= 1) {
              if (docSnapshot.data().isRepeated) {
              } else if (docSnapshot.data().isLooped) {
                playlist.push(playlist[0]).shift();
                docRef.update({ playlist: playlist });
              } else {
                playlist.shift();
                docRef.update({ playlist: playlist });
              }
              if (playlist.length >= 1) {
                play(locale, dbRef, docRef, message);
              } else disconnectionTimeout = setTimeout(() => voiceDisconnect(locale, dbRef, docRef, message, true), 10000);
            } else {
              disconnectionTimeout = setTimeout(() => voiceDisconnect(locale, dbRef, docRef, message, true), 10000);
            }
          } catch (err) {
            Log.e(`Play > 4 > ${err}`);
            return message.channel.send(`${locale.err_task}`);
          }
        })
        .on("error", err => {
          Log.e(`Play > 3 > ${err}`);
          return message.channel.send(`${locale.err_task}`);
        });
      dispatcher.setVolumeLogarithmic(docSnapshot.data().volume / 5);
    } catch (err) {
      Log.e(`Play > 2 > ${err}`);
      message.channel.send(`${locale.err_task}`);
    }
  } catch (err) {
    Log.e(`Play > 1 > ${err}`);
    message.channel.send(`${locale.err_task}`);
  }
};

module.exports = {
  name: "play",
  aliases: ["p", "재생"],
  description: "Play a music",
  async execute(locale, dbRef, docRef, message, args) {
    enqueue(locale, dbRef, docRef, message, args);
  },
};

import { Guild } from "discord.js";
import { createError } from "../modules/createError";
import { firestore } from "../modules/firebase";
import { log } from "../modules/logger";
import { client } from "../app";

client.on("guildDelete", async (guild: Guild) => {
  try {
    await firestore.collection(guild.id).doc("commands").delete();

    log.w(`Deleted Commands due to GuildDelete [ ${guild.name}(${guild.id}) ]`);
  } catch (err) {
    createError("GuildDelete", err, { guild: guild });
  }
});

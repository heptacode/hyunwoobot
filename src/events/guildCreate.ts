import { Guild } from "discord.js";
import { registerCommands, setConfig, setGuild, setState } from "../modules/initializer";
import { log } from "../modules/logger";
import { client } from "../app";

client.on("guildCreate", async (guild: Guild) => {
  try {
    log.d(`Initialize Started [ ${guild.name}(${guild.id}) ]`);

    await setConfig(guild.id);
    setState(guild.id);
    await registerCommands(guild.id, true);
    await setGuild(guild.id);

    log.i(`Initialize Complete [ ${guild.name}(${guild.id}) ]`);
  } catch (err) {
    log.e(`GuildCreate > ${err}`);
  }
});

import { client, state, commands, commands_manager } from "../app";
import Log from "../modules/logger";
import { Interaction } from "../";

export default () => {
  (client as any).ws.on("INTERACTION_CREATE", async (interaction: Interaction) => {
    try {
      const command = commands.get(interaction.data.name) || commands_manager.find((cmd) => cmd.name === interaction.data.name && !cmd.messageOnly);
      if (!command) return;

      command.execute(state.get(client.guilds.cache.get(interaction.guild_id).id), interaction);
    } catch (err) {
      Log.e(`InteractionCreate > ${err}`);
    }
  });
};

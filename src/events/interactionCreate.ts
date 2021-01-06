import { client, state, commands, commands_manager } from "../app";
import { Interaction } from "../";
import Log from "../modules/logger";

export default () => {
  (client as any).ws.on("INTERACTION_CREATE", async (interaction: Interaction) => {
    try {
      const command = commands.get(interaction.data.name) || commands_manager.get(interaction.data.name);
      if (!command) return;

      command.execute(state.get(client.guilds.cache.get(interaction.guild_id).id), interaction);
    } catch (err) {
      Log.e(`InteractionCreate > ${err}`);
    }
  });
};

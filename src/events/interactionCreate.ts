import { client, states, commands, commands_manager } from "../app";
import { log } from "../modules/logger";
import { Interaction } from "../";

(client as any).ws.on("INTERACTION_CREATE", async (interaction: Interaction) => {
  try {
    const command = commands.get(interaction.data.name) || commands_manager.find((cmd) => cmd.name === interaction.data.name && !cmd.messageOnly);
    if (!command) return;

    command.execute(states.get(interaction.guild_id), interaction);
  } catch (err) {
    log.e(`InteractionCreate > ${err}`);
  }
});

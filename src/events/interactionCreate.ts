import { client, states, commands, commands_manager } from "../app";
import { log } from "../modules/logger";
import { Interaction, InteractionResponse } from "../";
import axios from "axios";

(client as any).ws.on("INTERACTION_CREATE", async (interaction: Interaction) => {
  try {
    const command = commands.get(interaction.data.name) || commands_manager.find((cmd) => cmd.name === interaction.data.name && !cmd.messageOnly);
    if (!command) return;

    await command.execute(states.get(interaction.guild_id), interaction);

    await axios.post(`https://discord.com/api/v8/interactions/${interaction.id}/${interaction.token}/callback`, {
      type: 2,
    } as InteractionResponse);
  } catch (err) {
    log.e(`InteractionCreate > ${err}`);
  }
});

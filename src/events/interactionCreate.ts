import axios from "axios";
import { createError } from "../modules/createError";
import { client, states, commands, commands_manager } from "../app";
import { Interaction, InteractionResponse } from "../";

(client.ws as any).on("INTERACTION_CREATE", async (interaction: Interaction) => {
  try {
    const command = commands.get(interaction.data.name) || commands_manager.find((cmd) => cmd.name === interaction.data.name && !cmd.messageOnly);
    if (!command) return;

    const response = await command.execute(states.get(interaction.guild_id), interaction);

    await axios.post(
      `https://discord.com/api/v8/interactions/${interaction.id}/${interaction.token}/callback`,
      command.name !== "locale"
        ? ({
            type: 4,
            data: response ? (Array.isArray(response) ? { embeds: response } : { content: response }) : { content: `**✅ ${states.get(interaction.guild_id).locale.done}**` },
          } as InteractionResponse)
        : { type: 5, data: { content: "❕" } }
    );
  } catch (err) {
    createError("InteractionCreate", err, { interaction: interaction });
  }
});

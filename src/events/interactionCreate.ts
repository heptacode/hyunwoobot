import axios from "axios";
import { createError } from "../modules/createError";
import { client, states, commands, commands_manager } from "../app";
import { Interaction, InteractionResponse } from "../";

(client.ws as any).on("INTERACTION_CREATE", async (interaction: Interaction) => {
  try {
    const command = commands.get(interaction.data.name) || commands_manager.find((cmd) => cmd.name === interaction.data.name && !cmd.messageOnly);
    if (!command) return;

    if (command.name === "locale") {
      await axios.post(`https://discord.com/api/v8/interactions/${interaction.id}/${interaction.token}/callback`, { type: 5, data: { content: "❕" } });
    }

    const response = await command.execute(states.get(interaction.guild_id), interaction);

    if (command.name === "locale") {
      await axios.patch(`https://discord.com/api/v8/webhooks/${process.env.APPLICATION}/${interaction.token}/messages/@original`, {
        embeds: response,
      });
    } else {
      await axios.post(`https://discord.com/api/v8/interactions/${interaction.id}/${interaction.token}/callback`, {
        type: 4,
        data: response ? (Array.isArray(response) ? { embeds: response } : { content: response }) : { content: `**✅ ${states.get(interaction.guild_id).locale.done}**` },
      } as InteractionResponse);
    }
  } catch (err) {
    createError("InteractionCreate", err, { interaction: interaction });
  }
});

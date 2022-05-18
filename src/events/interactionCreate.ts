import axios from 'axios';
import { Interaction } from 'discord.js';
import {} from 'discord-api-types/v9';
import { createError } from '@/modules/createError';
import { states, userCommands, managerCommands } from '@/app';

export async function interactionCreate(interaction: Interaction | any) {
  try {
    if (interaction.isApplicationCommand) {
      const command =
        userCommands.get(interaction.data.name) ||
        managerCommands.find(cmd => cmd.name === interaction.data.name && !cmd.messageOnly);
      if (!command) return;

      if (command.name === 'locale') {
        await axios.post(
          `https://discord.com/api/v8/interactions/${interaction.id}/${interaction.token}/callback`,
          { type: 5, data: { content: '❕' } }
        );
      }

      const response = await command.execute(states.get(interaction.guildId), interaction);

      if (command.name === 'locale') {
        await axios.patch(
          `https://discord.com/api/v8/webhooks/${process.env.APPLICATION}/${interaction.token}/messages/@original`,
          {
            embeds: response,
          }
        );
      } else {
        await axios.post(
          `https://discord.com/api/v8/interactions/${interaction.id}/${interaction.token}/callback`,
          {
            type: 4,
            data: response
              ? Array.isArray(response)
                ? { embeds: response }
                : { content: response }
              : { content: `**✅ ${states.get(interaction.guild_id).locale.done}**` },
          }
        );
      }
    }
  } catch (err) {
    createError('InteractionCreate', err, { interaction: interaction });
  }
}

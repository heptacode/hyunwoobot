import { client, locales, managerCommands, userCommands } from '@/app';
import { checkPermission } from '@/modules/checkPermission';
import { createError } from '@/modules/createError';
import { sendEmbed } from '@/modules/embedSender';
import { props } from '@/props';
import { firestore } from '@/services/firebase.service';
import { Command, Locale, State } from '@/types';
import { APIApplicationCommandOption } from 'discord-api-types/v10';
import { CommandInteraction, Message } from 'discord.js';

const choices = [];
for (const [code, locale] of Object.entries(locales ?? {})) {
  choices.push({ name: locale.locale.name, value: code });
}

export const locale: Command = {
  name: 'locale',
  version: 1,
  options(locale: Locale): APIApplicationCommandOption[] {
    return [
      {
        type: 3,
        name: 'locale',
        description: locale.locale.locale,
        required: true,
        choices: choices,
      },
    ];
  },
  async execute(state: State, interaction: CommandInteraction) {
    try {
      if (await checkPermission(state.locale, { interaction: interaction }, 'MANAGE_GUILD'))
        throw new Error('Missing Permissions');

      const newLocale = interaction.options[0].value;

      if (state.locale.locale.code === newLocale)
        return [
          {
            color: props.color.red,
            description: `❌ **${state.locale.locale.noChange}**`,
          },
        ];

      const _message: Message = await sendEmbed(
        { interaction: interaction },
        {
          color: props.color.orange,
          description: `❕ **${state.locale.locale.pending}**`,
        },
        { guild: true }
      );

      state.locale = locales.get(newLocale);

      const payload: { [key: string]: Command } = {};
      for (const [name, command] of userCommands) {
        try {
          payload[name] = {
            id: (
              await (client as any).api
                .applications(process.env.APPLICATION)
                .guilds(interaction.guildId)
                .commands.post({
                  data: {
                    name: name,
                    description: state.locale.help[name],
                    options: command.options ? command.options(state.locale) : [],
                  },
                })
            ).id,
            name: name,
            version: command.version,
          };
        } catch (err) {
          createError(`ChangeLocale > CommandRegister > [${name}]`, err, {
            interaction: interaction,
          });
        }
      }

      for (const [name, command] of managerCommands) {
        try {
          if (command.messageOnly) continue;
          payload[name] = {
            id: (
              await (client as any).api
                .applications(process.env.APPLICATION)
                .guilds(interaction.guildId)
                .commands.post({
                  data: {
                    name: name,
                    description: `${state.locale.manager} ${state.locale.help[name]}`,
                    options: command.options ? command.options(state.locale) : [],
                  },
                })
            ).id,
            name: name,
            version: command.version,
          };
        } catch (err) {
          createError(`ChangeLocale > CommandRegister > Manager > [${name}]`, err, {
            interaction: interaction,
          });
        }
      }

      await firestore.collection(interaction.guildId).doc('config').update({ locale: newLocale });
      await firestore.collection(interaction.guildId).doc('commands').update(payload);

      await _message.delete();

      return [
        {
          color: props.color.green,
          description: `✅ **${state.locale.locale.changed}**`,
        },
      ];
    } catch (err) {
      createError('ChangeLocale', err, { interaction: interaction });
    }
  },
};

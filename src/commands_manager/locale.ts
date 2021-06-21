import { Message } from "discord.js";
import { createError } from "../modules/createError";
import { sendEmbed } from "../modules/embedSender";
import { firestore } from "../modules/firebase";
import { checkPermission } from "../modules/permissionChecker";
import { client, commands, commands_manager, locales } from "../app";
import props from "../props";
import { Command, Interaction, Locale, State } from "../";

const choices = [];
for (const [code, locale] of locales) {
  choices.push({ name: locale.locale.name, value: code });
}

export default {
  name: "locale",
  version: 1,
  options(locale: Locale) {
    return [
      {
        type: 3,
        name: "locale",
        description: locale.locale.locale,
        required: true,
        choices: choices,
      },
    ];
  },
  async execute(state: State, interaction: Interaction) {
    try {
      if (await checkPermission(state.locale, { interaction: interaction }, "MANAGE_GUILD")) throw new Error("Missing Permissions");

      const newLocale = interaction.data.options[0].value;

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
      for (const [name, command] of commands) {
        try {
          payload[name] = {
            id: (
              await (client as any).api
                .applications(process.env.APPLICATION)
                .guilds(interaction.guild_id)
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
          createError(`ChangeLocale > CommandRegister > [${name}]`, err, { interaction: interaction });
        }
      }

      for (const [name, command] of commands_manager) {
        try {
          if (command.messageOnly) continue;
          payload[name] = {
            id: (
              await (client as any).api
                .applications(process.env.APPLICATION)
                .guilds(interaction.guild_id)
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
          createError(`ChangeLocale > CommandRegister > Manager > [${name}]`, err, { interaction: interaction });
        }
      }

      await firestore.collection(interaction.guild_id).doc("config").update({ locale: newLocale });
      await firestore.collection(interaction.guild_id).doc("commands").update(payload);

      await _message.delete();

      return [
        {
          color: props.color.green,
          description: `✅ **${state.locale.locale.changed}**`,
        },
      ];
    } catch (err) {
      createError("ChangeLocale", err, { interaction: interaction });
    }
  },
};

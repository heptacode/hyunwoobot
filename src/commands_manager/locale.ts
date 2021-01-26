import { Message } from "discord.js";
import { sendEmbed } from "../modules/embedSender";
import { firestore } from "../modules/firebase";
import Log from "../modules/logger";
import { checkPermission } from "../modules/permissionChecker";
import { client, commands, commands_manager, locales } from "../app";
import props from "../props";
import { Interaction, Locale, State } from "../";

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
      if (await checkPermission(state.locale, { interaction: interaction }, "MANAGE_GUILD")) return;

      const configDocRef = firestore.collection(interaction.guild_id).doc("config");

      if ((await configDocRef.get()).data().locale === interaction.data.options[0].value)
        return sendEmbed(
          { interaction: interaction },
          {
            color: props.color.red,
            description: `❌ **${state.locale.locale.noChange}**`,
          },
          { guild: true }
        );

      const _message: Message = await sendEmbed(
        { interaction: interaction },
        {
          color: props.color.orange,
          description: `❕ **${state.locale.locale.pending}**`,
        },
        { guild: true }
      );

      await configDocRef.update({ locale: interaction.data.options[0].value });

      state.locale = locales.get(interaction.data.options[0].value);

      const payload: any = {};
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
          Log.e(`CommandRegister > ${err}`);
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
          Log.e(`CommandRegister > Manager > ${err}`);
        }
      }

      await firestore.collection(interaction.guild_id).doc("commands").update(payload);

      await _message.delete();
      return sendEmbed(
        { interaction: interaction },
        {
          color: props.color.green,
          description: `✅ **${state.locale.locale.changed}**`,
        },
        { guild: true }
      );
    } catch (err) {
      Log.e(`ChangeLocale > ${err}`);
    }
  },
};

import { log } from '@/modules/logger';
import { REST } from '@discordjs/rest';

const rest: REST = new REST({ version: '10' }).setToken(process.env.TOKEN);

export async function registerCommands(guildID: string, force?: boolean) {
  try {
    // for (const [name, command] of Object.assign(userCommands, managerCommands)) {
    // new SlashCommandBuilder()
    //   .setName(name)
    //   .setDescription(states.get(guildID).locale.help[name])
    //   .addUserOption((option: SlashCommandUserOption) => option.setName(''));
    // }
    // await rest.put(Routes.applicationGuildCommands(client.user.id, '506097604950753290'), {
    //   body: Object.assign(userCommands.toJSON(), managerCommands.toJSON()),
    // });
  } catch (error) {
    log.e(error);
  }

  // const commandsDocRef = firestore.collection(guildID).doc("commands");
  // const commandsDocSnapshot = await commandsDocRef.get();

  // if (!commandsDocSnapshot.exists) await commandsDocRef.create({});

  // const registeredCommands: { [key: string]: Command } = commandsDocSnapshot.exists ? commandsDocSnapshot.data() : {};
  // const updatedCommands: { [key: string]: Command } = {};

  // for (const [name, command] of commands) {
  //   try {
  //     if (((registeredCommands[name] && registeredCommands[name].version >= command.version) || command.messageOnly) && !force) continue;
  //     updatedCommands[name] = {
  //       id: (
  //         await (client as any).api
  //           .applications(process.env.APPLICATION)
  //           .guilds(guildID)
  //           .commands.post({
  //             data: {
  //               name: name,
  //               description: states.get(guildID).locale.help[name],
  //               options: command.options ? command.options(states.get(guildID).locale) : [],
  //             },
  //           })
  //       ).id,
  //       name: name,
  //       version: command.version,
  //     };
  //   } catch (err) {
  //     createError(`Initializer > CommandRegister > [${name}]`, err, { guild: guildID });
  //   }
  // }

  // for (const [name, command] of managerCommands) {
  //   try {
  //     if (((registeredCommands[name] && registeredCommands[name].version >= command.version) || command.messageOnly) && !force) continue;
  //     updatedCommands[name] = {
  //       id: (
  //         await (client as any).api
  //           .applications(process.env.APPLICATION)
  //           .guilds(guildID)
  //           .commands.post({
  //             data: {
  //               name: name,
  //               description: `${states.get(guildID).locale.manager} ${states.get(guildID).locale.help[name]}`,
  //               options: command.options ? command.options(states.get(guildID).locale) : [],
  //             },
  //           })
  //       ).id,
  //       name: name,
  //       version: command.version,
  //     };
  //   } catch (err) {
  //     createError(`Initializer > CommandRegister > Manager > [${name}]`, err, { guild: guildID });
  //   }
  // }

  // if (Object.keys(updatedCommands).length) {
  //   log.s(`Registered ${Object.keys(updatedCommands).length} command(s) for guild [ ${client.guilds.resolve(guildID).name}(${guildID}) ]: ${Object.keys(updatedCommands).join(", ")}`);
  //   await commandsDocRef.update(updatedCommands);
  // }
}

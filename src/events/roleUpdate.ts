import { Role } from "discord.js";
import { firestore } from "../modules/firebase";
import { log } from "../modules/logger";
import { client, states } from "../app";
import { UserRole } from "../";

client.on("roleUpdate", async (oldRole: Role, newRole: Role) => {
  try {
    if (!states.get(newRole.guild.id).userRoles) return;

    const idx = states.get(newRole.guild.id).userRoles.findIndex((userRole: UserRole) => userRole.id === newRole.id);
    states.get(newRole.guild.id).userRoles[idx].name = newRole.name;
    states.get(newRole.guild.id).userRoles[idx].color = newRole.hexColor;

    await firestore
      .collection(newRole.guild.id)
      .doc("config")
      .update({ userRoles: states.get(newRole.guild.id).userRoles });
  } catch (err) {
    log.e(`RoleUpdate > ${err}`);
  }
});

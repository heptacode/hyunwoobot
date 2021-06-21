import { Role } from "discord.js";
import { createError } from "../modules/createError";
import { firestore } from "../modules/firebase";
import { client, states } from "../app";
import { UserRole } from "../";

client.on("roleUpdate", async (oldRole: Role, newRole: Role) => {
  try {
    if (!states.get(newRole.guild.id).userRoles || !states.get(newRole.guild.id).userRoles.length) return;

    const idx = states.get(newRole.guild.id).userRoles.findIndex((userRole: UserRole) => userRole.id === newRole.id);
    if (!idx) return;

    states.get(newRole.guild.id).userRoles[idx].name = newRole.name;
    states.get(newRole.guild.id).userRoles[idx].color = newRole.hexColor;

    await firestore
      .collection(newRole.guild.id)
      .doc("config")
      .update({ userRoles: states.get(newRole.guild.id).userRoles });
  } catch (err) {
    createError("RoleUpdate", err, { guild: oldRole.guild });
  }
});

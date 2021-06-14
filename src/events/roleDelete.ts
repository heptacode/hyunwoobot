import { Role } from "discord.js";
import { createError } from "../modules/createError";
import { firestore } from "../modules/firebase";
import { client, states } from "../app";
import { UserRole } from "../";

client.on("roleDelete", async (role: Role) => {
  try {
    if (!states.get(role.guild.id).userRoles) return;

    const idx = states.get(role.guild.id).userRoles.findIndex((userRole: UserRole) => userRole.id === role.id);
    states.get(role.guild.id).userRoles.splice(idx, 1);

    await firestore
      .collection(role.guild.id)
      .doc("config")
      .update({ userRoles: states.get(role.guild.id).userRoles });
  } catch (err) {
    createError("RoleDelete", err, { guild: role.guild });
  }
});

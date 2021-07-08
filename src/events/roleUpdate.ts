import { Role } from "discord.js";
import { createError } from "../modules/createError";
import { firestore } from "../modules/firebase";
import { client, states } from "../app";
import { State, UserRole } from "../";

client.on("roleUpdate", async (oldRole: Role, newRole: Role) => {
  try {
    const state: State = states.get(newRole.guild.id);
    if (!state.userRoles || !state.userRoles.length) return;

    const idx = state.userRoles.findIndex((userRole: UserRole) => userRole.id === newRole.id);
    if (idx === -1) return;

    state.userRoles[idx].name = newRole.name;
    state.userRoles[idx].color = newRole.hexColor;

    await firestore.collection(newRole.guild.id).doc("config").update({ userRoles: state.userRoles });
  } catch (err) {
    createError("RoleUpdate", err, { guild: oldRole.guild });
  }
});

import { states } from '@/app';
import { createError } from '@/modules/createError';
import { firestore } from '@/services/firebase.service';
import { UserRole } from '@/types';
import { Role } from 'discord.js';

export async function roleDelete(role: Role) {
  try {
    if (!states.get(role.guild.id).userRoles) return;

    const idx = states
      .get(role.guild.id)
      .userRoles.findIndex((userRole: UserRole) => userRole.id === role.id);
    if (idx === -1) return;

    states.get(role.guild.id).userRoles.splice(idx, 1);

    await firestore
      .collection(role.guild.id)
      .doc('config')
      .update({ userRoles: states.get(role.guild.id).userRoles });
  } catch (err) {
    createError('RoleDelete', err, { guild: role.guild });
  }
}

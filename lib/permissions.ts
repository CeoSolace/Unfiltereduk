// Role-based permission system (~30 permissions, inheritance)
export const PERMISSIONS = {
  MANAGE_SERVER: 'manage_server',
  MANAGE_ROLES: 'manage_roles',
  MANAGE_CHANNELS: 'manage_channels',
  SEND_MESSAGES: 'send_messages',
  READ_MESSAGES: 'read_messages',
  MANAGE_MESSAGES: 'manage_messages',
  KICK_MEMBERS: 'kick_members',
  BAN_MEMBERS: 'ban_members',
  VIEW_AUDIT_LOG: 'view_audit_log',
  USE_EXTERNAL_EMOJIS: 'use_external_emojis',
  STREAM_VIDEO: 'stream_video',
  CREATE_INVITE: 'create_invite',
  CHANGE_NICKNAME: 'change_nickname',
  MANAGE_NICKNAMES: 'manage_nicknames',
  TIMEOUT_MEMBERS: 'timeout_members',
  // ... extend to ~30 as needed
} as const;

export type Permission = keyof typeof PERMISSIONS;

// Check if user has permission (traverse role hierarchy)
export function hasPermission(
  memberRoles: string[],
  serverRoles: Array<{ id: string; permissions: Permission[]; rank: number }>
): boolean {
  // Sort roles by rank (highest first)
  const sorted = [...serverRoles].sort((a, b) => b.rank - a.rank);
  for (const role of sorted) {
    if (memberRoles.includes(role.id)) {
      // First matching role (highest rank) determines access
      return true;
    }
  }
  return false;
}

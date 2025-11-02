// Stored in per-server audit_logs
export interface AuditLogEntry {
  _id: string;
  action: string; // e.g., "user_ban", "role_create"
  actorId: string; // global user ID
  actorType: 'user' | 'bot' | 'system';
  targetId?: string; // affected user/channel/role ID
  details: Record<string, any>; // e.g., { reason: "spam", duration: "1h" }
  timestamp: Date;
}

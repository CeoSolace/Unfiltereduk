// Entry in unfiltered_auth.ip_registry
export interface IPRegistryEntry {
  ip_hash: string; // HMAC-SHA256(ip, PEPPER)
  ip_psi: string; // "psi_xxx" — irreversible pseudonym
  firstSeen: Date;
  lastSeen: Date;
}

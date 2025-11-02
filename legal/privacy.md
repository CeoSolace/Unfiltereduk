# Privacy Policy — Unfiltered UK

**Last Updated:** April 2025

## 1. Information We Never Store
- **Raw IP addresses** — only HMAC-SHA256 hashes (`ip_hash`) and irreversible pseudonyms (`ip_psi`)
- **Message content** — stored encrypted per-server; we lack decryption keys
- **Server databases** — fully isolated; we have no access

## 2. Information We Do Store
- **Authentication**: email, username, bcrypt-hashed password
- **Global metadata**: subscription plan, global role, badges
- **Consent logs**: your agreement to join specific servers
- **DMs**: only in `unfiltered_dm` database (not archived unless both parties consent)

## 3. Legal Compliance
We respond to valid court orders with minimal data:
- Account email and registration pseudonym (`ip_psi`)
- Subscription records
- Global moderation logs

We **cannot** provide:
- Message content
- Server membership lists
- Server media or configuration

## 4. Data Minimisation
We anonymise all telemetry. No tracking pixels, no third-party analytics.

## 5. Your Rights
You may:
- Request deletion of your global account (does not affect server data)
- Export your DM history
- Withdraw consent from server data processing (via `/api/auth/delete`)

---
**Remember**: When you join a server, you entrust **that community** — not us — with your data.

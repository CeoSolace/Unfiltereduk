# Developer Terms of Service

**Last Updated:** April 2025

## 1. Bot Registration
- Bots must be registered via `/api/developers/register`
- Each receives a hashed API token with scoped permissions
- Tokens are bound to your user ID and audit-logged

## 2. Permissions
- Bots inherit permissions granted per-server by owners
- No bot may access `SERVER_MESSAGE_KEY` or decrypt messages
- All actions appear in `audit_logs` with `actor_type: "bot"`

## 3. Rate Limits
- 100 requests/minute per bot token
- Exceeding limits triggers 429 errors
- Abuse results in token revocation

## 4. Prohibited Actions
- Impersonating users or system accounts
- Bypassing UI consent flows
- Scraping server databases

## 5. Platform Integrity
All bot messages are signed by the platform. Signature verification is mandatory on client-side.

---
Violations result in immediate bot suspension and potential global account ban.

# 07 — Security

## Server boundaries

Validate every external input on the server: forms, URLs, query strings, headers, webhooks, uploads, and admin mutations. Use allowlisted fields, types, lengths, and formats; reject unexpected writable fields. Derive actor identity and protected ownership fields from the authenticated context. Client validation is usability only.

Authorize every protected operation and record scope using [06](06-AUTH-RBAC.md). Never trust middleware, client state, hidden controls, submitted roles, or route names as the complete authorization boundary.

## Required controls

| Threat/area | Mandatory rule |
| --- | --- |
| Password theft | Vetted adaptive hashing; protect/reset credentials as defined in auth rules |
| Session theft | Secure HttpOnly cookies, explicit SameSite, expiry/revocation, HTTPS in production |
| CSRF | Protect cookie-authenticated mutations with origin checks and appropriate CSRF tokens/framework protections; verify coverage for Actions and handlers; no state changes via GET |
| XSS | Escape plain text, sanitize rich text with an allowlist, validate link schemes, prohibit unsafe HTML sinks without reviewed sanitization |
| CSP | Define a restrictive Content Security Policy compatible with rendering; use nonces/hashes where needed, avoid broad unsafe exceptions, validate before enforcing |
| Abuse | Rate-limit login, recovery, public leads, uploads, and expensive endpoints; use a shared/durable strategy valid across PM2 processes and trusted proxy configuration |
| Injection | Parameterized database operations; no untrusted shell or SQL construction |
| Redirect/SSRF | Allowlist redirect targets and outbound fetch destinations; never fetch arbitrary submitted lead source/referrer URLs |
| Browser defenses | Define frame restrictions, MIME sniffing protection, referrer policy, and HTTPS/HSTS rollout appropriate to verified domains |

SameSite alone is not the whole CSRF strategy. Anti-spam for anonymous leads must combine server limits and validation; choose any additional provider deliberately. Do not reflect raw submitted content into email headers or HTML notifications.

## Uploads and media

Require upload permission for administrative media. Default public lead attachments to disabled pending explicit approval. Allowlist extensions and detected MIME/signature, enforce size/count/dimension limits, generate server-controlled storage names, and disallow executable content. Reject or safely sanitize SVG using an approved strategy; never accept it merely by extension. Restrict archive handling and block path traversal.

Store uploads outside executable paths; serve private media only through authorized access or short-lived scoped URLs. Use separate safe delivery boundaries for public assets. Decide malware scanning/quarantine and metadata stripping appropriate to accepted formats before enabling uploads. Record source ownership and enforce deletion permissions.

## Secrets and privacy

Secrets must be supplied through environment variables backed by protected local/deployment secret storage. Never commit, log, return, or put them in browser-exposed variables. Any future example environment file may contain names and safe placeholders only. Use different credentials per environment; restrict and rotate credentials if exposure is suspected.

Runtime MySQL uses least privilege; migration/admin access is separate. Minimize lead data collection, restrict exports, and establish owner-approved retention, deletion, consent, and backup-retention policy before launch. Do not copy production PII into development without explicit authorization and suitable protection.

## Audit and response

Audit login/security events, role changes, content publication, lead assignment/status changes, sensitive exports/deletions, and upload actions. Record actor, target, time, outcome, and correlation ID with minimal safe metadata. Keep CRM activity history distinct from security audit logs. Never log passwords, session tokens, secrets, or full form bodies. Restrict audit access and prevent routine application users from altering logs.

Before release, review dependencies, secret exposure, authorization failure paths, validation, upload behavior, CSRF, CSP, and rate limits. Document incident ownership, credential revocation, log preservation, containment, and recovery. A security failure blocks release; do not bypass controls to make CI or deployment pass.

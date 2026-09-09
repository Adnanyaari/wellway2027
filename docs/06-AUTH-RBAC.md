# 06 — Authentication and RBAC

> Phase update (2026-09-06): The owner has explicitly authorized the initial scaffold, dependency installation, schema generation, and local verification. Earlier documentation-only restrictions below describe the previous phase and no longer block this scope. Full website/dashboard features, fake content, applied database migrations, and production deployment remain unauthorized. Read docs/adr/0001-initial-scaffold.md (relative to repository root) for the current scaffold decisions. Routine reversible scaffold choices are covered by this authorization; production architecture acceptance remains a later gate.

## Authentication rules

Select a maintained authentication solution through an ADR before implementing it. Do not create bespoke cryptography. Password-based accounts require a vetted adaptive password hash with reviewed parameters; never store plaintext or reversibly encrypted passwords. Password changes/recovery must revoke applicable sessions and use expiring, single-use, securely represented recovery tokens.

Use secure, HttpOnly cookies in production with an explicit SameSite policy and limited scope/lifetime. Rotate/revoke sessions appropriately, check account status, and apply rate limits to login and recovery. Avoid account enumeration in public responses. Require a documented privileged-account protection strategy, including MFA for production administrators. Public registration is off unless approved.

## Permission model

Users receive roles through `user_roles`; roles receive permission keys through `role_permissions`. Initial roles are ADMIN, SEO, ADS, CUSTOMER_SERVICE. Treat role names as editable permission bundles, not authorization predicates scattered through the application.

Use centralized permission checks such as a resource/action capability, plus resource scope constraints. Every protected server read, mutation, export, upload, and background operation must enforce policy. UI visibility may use the same capability model for usability but never substitutes for it. Deny unknown permissions and unauthenticated access by default.

Use explicit permission keys, including:

- Content resources (`clients`, `services`, `projects`, `blog`, `faqs`, `testimonials`, `pages`): `.read`, `.create`, `.update`, `.archive`, `.publish`.
- Media: `media.read`, `media.upload`, `media.delete`.
- SEO: `seo.read`, `seo.update`, `redirects.manage`.
- Leads: `leads.read.assigned`, `leads.read.all`, `leads.update.assigned`, `leads.update.all`, `leads.assign`, `leads.export`, `leads.delete`.
- Operational capabilities: `analytics.read.aggregate`, `users.manage`, `roles.manage`, `audit.read`.

This is the initial policy vocabulary; add capabilities deliberately with documented scope and tests. A service accepting a record ID must check access to that record, not only broad module access. Assigned-lead access means the current persisted assignee matches the actor. Assignment, export, and deletion remain separate privileges.

## Proposed initial assignments — approve before implementation

| Role | Initial permission bundle |
| --- | --- |
| ADMIN | Explicitly assigned full approved catalog; no role-name bypass or automatic wildcard for future permissions |
| SEO | Content read, SEO read/update, redirect management, aggregate analytics; no business-content publication, lead data, or user/role management by default |
| ADS | Aggregate analytics only by default; no raw lead PII, exports, or user/role administration |
| CUSTOMER_SERVICE | Read/update assigned leads only, plus service read for handling requests; no reassignment, all-lead access, export, or deletion by default |

Permission keys are authoritative; this table describes intended bundles, not hard-coded checks. Field-level policy must stop `seo.update` from editing business content or publication state. The owner must approve broader content publishing or lead access explicitly before granting it.

## Administration and auditing

Bootstrap the first administrator through a controlled, approved procedure with no committed credential or default password. Restrict role/permission management to its dedicated permission. Prevent accidental removal/deactivation of the last usable administrator, audit privileged changes, and invalidate affected authorization caches/sessions promptly. Granting a role must not allow the actor to exceed their authorized delegation scope without explicit approved policy.

The owner approved a local protected administrator bootstrap on 2026-09-09 for `online@wellwaysa.com` and phone `0501380967`. The one-time password is supplied only through the local process environment, hashed with Better Auth's scrypt implementation, and marked for mandatory change at first sign-in. A restrictive database relationship prevents deleting the protected owner account; user-management services must also reject its deactivation or removal of protected state. Credential sign-in and the first-login password change are enabled for pre-provisioned users; public registration and recovery remain disabled. Local login uses Better Auth rate limiting. Production requires shared rate-limit storage and administrator MFA before release.

Test unauthenticated access, missing permission, cross-record access, deactivated users, revoked permissions, privilege escalation, and last-administrator protection. Private routes must also follow [noindex rules](08-SEO-I18N.md).

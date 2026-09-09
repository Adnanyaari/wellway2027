# 0001 — Initial scaffold

Date: 2026-09-06. Status: Proposed for owner review of technical selections; scaffold implementation authorized directly by the owner's follow-up request. This is not a claim that the owner separately accepted each library or production design.

## Context and authorization

The owner explicitly requested installation, an initial application/schema/auth foundation, and complete local checks. This supersedes the previous documentation-only phase and authorizes reversible scaffold implementation choices without another approval round. Full business features, production deployment, and fake content remain outside scope. On 2026-09-09 the owner separately authorized the protected administrator, credential sign-in page, and mandatory initial-password change flow.

## Decisions within the authorized scaffold

- Root-level `app`, `components`, `features`, `lib`, `db`, `messages`, `public`, `tests`. Routes compose server domain services; Prisma stays in `db/client.ts`, provider configuration in `lib/auth`, and permission policy/session/guards in `features/auth`.
- Stable Next.js 16, React 19, Tailwind 4, Prisma 7, Zod 4; TypeScript 5.9, ESLint 9 and Vitest 4 for peer compatibility. Exact pinned versions are in package.json and lockfile. Registry metadata was checked before installing; Prisma's release-candidate latest tag was explicitly excluded. Node 22.17.1 and npm 11.19.1 are the verified installation toolchain; the preinstalled npm 11.4.0 resolver crashed, so npm 11.19.1 was used locally without a global change. Patched transitive overrides are deepmerge-ts 8.0.2, mariadb 3.5.4 and mysql2 3.24.3; audit reports zero vulnerabilities.
- Prisma's MySQL datasource with its MariaDB-named driver adapter connecting to MySQL (the driver name is not a database substitution). Lazy, server-only client; generation/build do not require a live database. IDs use Prisma CUID strings; Better Auth records use provider-generated UUIDs in the same 36-character columns. Join tables use composite IDs. No migration or seed now.
- Better Auth with its Prisma adapter supplies credential sign-in and session verification for pre-provisioned staff. Public registration, OAuth, and recovery remain disabled. No custom password/session cryptography. Provider session records include sensitive bearer tokens and require strict DB access. Password fields are for provider hashes only, never plaintext. The protected administrator password uses Better Auth scrypt and must be replaced with at least 6 characters at first sign-in, per the owner's 2026-09-09 direction. Local rate limiting uses Better Auth memory storage; shared production storage and administrator MFA remain release gates.
- Central server permission checks with a separate `dashboard.access` capability. Role names are initial catalog values only, with no seeded grants or bypass. Permission catalogs grow with implemented features; proposed role bundles remain unassigned.
- `/dashboard` checks access then resolves to `/{locale}/dashboard`; both localized paths check access themselves. Arabic is the configurable initial default. `/ar` and `/en` are neutral unpublished shells. Localized sign-in and mandatory initial-password change routes are working, private, noindex boundaries.
- Typed local JSON UI dictionaries for two locales, server-owned direction, next-themes for light/dark/system and persisted preference. Neutral styling/system font until branding approval.
- Nonce CSP and dynamic rendering; inline styles temporarily allowed for theme color-scheme compatibility, scripts require a nonce in production. No public caching of nonce-bearing pages. Production CSP validation and refined style policy remain release gates.
- All scaffold routes emit noindex; robots blocks crawling and the sitemap is intentionally empty. Canonical/alternate utilities exist but no claims or structured business data are invented. `SITE_INDEXABLE` cannot publish shells by itself.
- Add non-secret site settings and the documented supporting page, media/client translation, session/account/verification, outbox and redirect models alongside the requested entities. No handlers write to them yet.

## Alternatives and consequences

Rejected prerelease Prisma 8 and unverified major TypeScript/tooling combinations. A full auth implementation and hosted provider selection would exceed the scaffold scope. A provider-neutral always-null stub would not exercise a real session integration, so a maintained adapter is configured with issuance disabled. A full i18n framework is unnecessary for the initial two-dictionary shell; reevaluate ICU/content requirements later.

Nonce CSP trades static rendering for a simple strict script boundary. Missing auth configuration denies access. Database failure must never grant access. Future pages must opt into publication deliberately, implement missing translation behavior, and carry their own SEO metadata. Remote database TLS configuration must be reviewed before remote connectivity; this scaffold targets local/private MySQL only.

## Validation and rollout

Run npm install, Prisma generation/validation, lint, strict typecheck, tests and production build, plus local route/header checks. Unit records are isolated test identifiers, never seeds or business content. No database schema is applied. MySQL 8.4 with utf8mb4 and reviewed collation is the intended deployment target, not a claim that a local server has been provisioned. Validate real database constraints and provider sessions after an approved local MySQL connection and migration are available.

The initial scaffold rollback description applied before the owner authorized local migrations. The local database now includes reviewed migrations through `20260909150000_protected_admin_account`; rollback of the protected account requires a deliberate owner-approved procedure because its database relationship blocks accidental deletion. Production deployment remains untouched. Affected documents: AGENTS, master, architecture, routes, database, auth, SEO, workflow, DevOps, and docs index. This is the first ADR; it supersedes none.

## Sources

- [Next.js installation](https://nextjs.org/docs/app/getting-started/installation)
- [Next.js CSP](https://nextjs.org/docs/app/guides/content-security-policy)
- [Better Auth Prisma adapter](https://better-auth.com/docs/adapters/prisma)
- [Prisma MySQL connector](https://www.prisma.io/docs/orm/overview/databases/mysql)
- npm registry package metadata, checked 2026-09-06; exact resolved dependency graph is recorded in package-lock.json.

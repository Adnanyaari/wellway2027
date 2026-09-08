# Well Way 2027

Initial scaffold only. Read [AGENTS.md](AGENTS.md) and [docs](docs/README.md) before changes. No business pages/content, dashboard features, seeds, migrations, or deployment are included.

## Local development

Use Node.js 22.17.1 or a newer compatible Node 22 release, npm 11.19.1, and VS Code. Next.js runs with Node, never XAMPP Apache. An actual MySQL service is needed only for database/auth work. The preinstalled npm 11.4.0 hit a resolver bug; use npm 11.19.1 (`npm exec --yes --package=npm@11.19.1 -- npm install`) when installing without a global toolchain change.

1. Run `npm install` (or `npm ci` for the committed lockfile).
2. Run `npm run db:generate`.
3. Optionally copy `.env.example` to `.env` and supply your own local configuration. No credentials are needed to view the unpublished shells or build.
4. Run `npm run dev`, then visit `/ar` or `/en` on localhost:3000.

Checks: `npm run db:validate`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`. Run `npm start` after a build. Prisma generation must precede typecheck/build after a clean install. Do not run migrations until the local database and migration plan are approved.

## Configuration

| Variable | Use |
| --- | --- |
| `DATABASE_URL` | Required private MySQL runtime connection; use an account without schema-administration privileges |
| `MIGRATION_DATABASE_URL` | Required private MySQL connection for Prisma CLI and migrations; use a separate schema-migration account |
| `BETTER_AUTH_SECRET` | Random secret of at least 32 characters, required for configured auth; never commit |
| `SITE_URL` | Trusted canonical/auth origin; required in production and must be HTTPS outside localhost (development defaults to `http://localhost:3000`) |
| `DEFAULT_LOCALE` | `ar` or `en`, defaults to `ar` |
| `SITE_INDEXABLE` | Defaults to `false`; reserved publication gate, does not index the scaffold |

## Implemented boundaries

`/` redirects to the configured locale. `/ar` and `/en` provide minimal localized shells, proper direction, theme selection and metadata. `/dashboard` and localized dashboard routes check server sessions and permissions; visitors without sessions go to a localized unavailable sign-in shell. No authentication mutation endpoints are exposed. `/api/health` is a minimal liveness check, not a database readiness check. Robots/noindex and an empty sitemap prevent intentional publication of unfinished content.

Prisma models include the requested entities plus supporting translation/auth/outbox/page/redirect records from the documentation. No fake data or seed is included. Isolated unit test identifiers do not represent business records.

Prisma CLI commands load `MIGRATION_DATABASE_URL`; the running application loads only `DATABASE_URL`. Both must be complete MySQL URLs, and neither falls back to another database connection when missing.

The [scaffold ADR](docs/adr/0001-initial-scaffold.md) explains package selection, security boundaries and outstanding production decisions. Live MySQL integration, login/bootstrap/MFA/recovery, uploads, lead saving/email workers, business publishing, approved SEO content, production settings and deployment remain subsequent approved work.

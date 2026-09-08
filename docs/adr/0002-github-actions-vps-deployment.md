# 0002 — GitHub Actions deployment to the CloudPanel VPS

Date: 2026-09-07. Status: Accepted. Decision owner/reviewer: project owner. Acceptance evidence: explicitly approved by the owner in the project conversation on 2026-09-08.

## Context

The repository is hosted at `Adnanyaari/wellway2027` with `main` as the production branch. The target is the CloudPanel Node.js site `wellway.fun`, located at `/home/adnan27/htdocs/wellway.fun` and running as the unprivileged site user `adnan27` on Node.js 22 and application port 3000. The project owner requested automatic deployment from GitHub to the VPS. The application is still an unpublished scaffold and must remain noindex.

The CloudPanel-managed site path and public domain have been reported and must be verified by the deployment script before activation. The exact VPS address, SSH port, SSH host key, production database grants, backup policy and GitHub environment controls have not yet been verified. No secret may be committed to the repository or copied into a build artifact.

## Decision

- Pull requests and pushes to `main` run locked installation, Prisma generation and validation, lint, strict typecheck, tests and a production build on Node.js 22.
- A successful push to `main` queues deployment through the GitHub `production` environment. Production requires an explicit environment approval. If the repository plan cannot enforce environment reviewers, deployment uses a manual `workflow_dispatch` gate after the same checks.
- GitHub authenticates to the VPS with a dedicated SSH key restricted to `adnan27`. The workflow pins the independently verified VPS host key in `known_hosts`; host-key checking is never disabled.
- Deployment transfers the exact Git commit to a versioned release directory below the verified CloudPanel site path. The VPS runs `npm ci`, Prisma generation and the production build for that release using Node.js 22.
- Production secrets live in a protected environment file on the VPS outside versioned release directories. GitHub stores only connection metadata and the deployment SSH key.
- A separate migration credential is exposed only to the serialized migration step. The runtime `DATABASE_URL` cannot create or alter schema. `prisma migrate deploy` runs once before activation after backup readiness is confirmed.
- A stable `current` link identifies the active release. PM2 starts or reloads the application as `adnan27` on port 3000. CloudPanel remains the owner of Nginx and TLS configuration.
- Deployment succeeds only after local HTTP verification of `/api/health` and public HTTPS verification of `https://wellway.fun/api/health`. The previous release remains available for application rollback; migrations are not rolled back automatically.
- GitHub serializes production deployments and records the commit SHA. Old releases are removed only under a separately reviewed retention rule.

## Alternatives considered

Building directly from an unversioned Git checkout on the VPS was rejected because partial pulls and mutable working trees weaken rollback and release identity. Password-based SSH was rejected in favor of a dedicated key. Deploying every push without approval was rejected because the current rules require a production release gate. Editing Nginx directly was rejected because CloudPanel owns that configuration.

## Consequences and tradeoffs

The workflow provides traceable releases, a review gate, host verification and a recoverable application rollback. It requires initial VPS preparation, a protected GitHub environment and separate runtime/migration database users. Building on the VPS takes more time but avoids packaging platform-specific dependencies from Windows and keeps the release process simple for the current single VPS.

The deployment does not publish business content, enable authentication, remove noindex controls, seed data or authorize destructive migrations. Arabic/English, RTL/LTR, light/dark and SEO behavior remain those of the verified commit. CloudPanel continues to terminate HTTPS and proxy to the private application port.

## Rollout and rollback

1. Verify the VPS address, SSH port, host key, CloudPanel site path, Node.js 22 binary, PM2 ownership and private binding.
2. Create the restricted deployment key and GitHub `production` environment secrets.
3. Configure protected production environment approval and deployment concurrency.
4. Install the workflow, server deployment script and PM2 configuration; validate with the unpublished scaffold.
5. Back up the production database, run the reviewed migration with its dedicated credential, activate the release and run health checks.
6. On application failure, repoint `current` to the prior release and reload PM2. Database recovery follows the separately approved backup/forward-fix plan.

## Validation criteria

- CI passes generation, schema validation, lint, strict typecheck, tests and production build.
- A deployment cannot run without the production gate or connect without the pinned host key.
- No secret appears in Git history, logs, artifacts or client bundles.
- PM2 runs as `adnan27`; port 3000 is not publicly exposed; CloudPanel serves valid HTTPS.
- The exact commit is recorded, both health checks pass, noindex remains present, and a prior application release can be restored.
- Migration and runtime database credentials have distinct verified grants.

Affected documents: `docs/10-DEVOPS-DEPLOYMENT.md`, `docs/11-CODEX-WORKFLOW.md`, `docs/05-DATABASE.md`, and this ADR index after acceptance. Related ADR: [0001 — Initial scaffold](0001-initial-scaffold.md). Supersedes none.

# 10 — DevOps and deployment

> Phase update (2026-09-06): The owner has explicitly authorized the initial scaffold, dependency installation, schema generation, and local verification. Earlier documentation-only restrictions below describe the previous phase and no longer block this scope. Full website/dashboard features, fake content, applied database migrations, and production deployment remain unauthorized. Read docs/adr/0001-initial-scaffold.md (relative to repository root) for the current scaffold decisions. Routine reversible scaffold choices are covered by this authorization; production architecture acceptance remains a later gate.

## Local development

Use VS Code, a GitHub repository, and a local MySQL database. XAMPP is permitted only for the database service, never as the Next.js runtime. Run the future Next.js application with Node.js. Verify MySQL compatibility as described in [05](05-DATABASE.md).

After implementation approval, choose supported compatible Node/package versions, a single package manager and committed lockfile. Separate local, test/staging, and production configuration and credentials. Document required environment variable names without real values. No dependency installation or config/code generation is authorized in the current phase.

## Production contract

- Hostinger VPS hosts the approved release. PM2 supervises the Next.js Node.js application with documented restart/startup behavior.
- CloudPanel manages the Nginx reverse proxy and SSL. Use its supported configuration workflow; avoid ad hoc edits that management tooling will overwrite.
- Expose public HTTP/HTTPS through Nginx; bind the application to a private/local interface and restrict database/administration access.
- Use a dedicated unprivileged deployment/application account and least-privilege runtime database credentials. Separate migration credentials.
- Keep uploads, secrets, and backups outside disposable release directories. Define storage persistence and restore behavior before launch.

## GitHub Actions release gates

Production receives approved production code only through GitHub Actions. Protect the production branch and deployment environment with required review/checks and an explicit release-approval policy. Do not equate an arbitrary push with production approval. Confirm available repository controls before implementation; record an equivalent approved gate if a platform constraint exists.

The future pipeline must:

1. Check out the exact reviewed commit, use a locked dependency install and selected runtime.
2. Run lint, strict typecheck, relevant automated tests, production build, and required security checks.
3. Build or package a traceable artifact for the target runtime; never embed runtime secrets in browser assets or artifacts.
4. Obtain the configured production approval, serialize deployments, and use restricted credentials with verified SSH host identity. Do not disable host-key checking.
5. Verify backup/recovery readiness, apply reviewed production migrations once, and activate the versioned release.
6. Restart/reload PM2 using a documented strategy, then verify health and public/private smoke checks.
7. Mark success only after verification; retain the release identity and deployment audit trail.

No workflow YAML, PM2 configuration or Nginx configuration is included in this scaffold phase. `.env.example` contains safe placeholders only; no real environment file or credentials are created.

## Recovery and operations

Retain a known-good release and a tested application rollback procedure. Schema changes must remain compatible during rollout; reverting application code does not undo migrations. Destructive schema changes require separate approval and a restore/forward-fix plan. Do not automatically overwrite production data from a backup on a failed health check.

Define backup cadence, retention, encryption, access, off-server copies, restoration tests, RPO, and RTO with the owner before production. Back up MySQL and persistent media coherently. Monitor application health, PM2 restarts, errors, resource usage, database connectivity, outbox backlog/failures, disk space, SSL expiry, and backup failures. Logs must be sanitized and rotated.

Launch smoke checks cover both locale home/detail routes, login/denial behavior, noindex headers, metadata, an authorized controlled lead test and notification, redirects, and persistent media. Use controlled test data and cleanup under approved policy. Exact domain, VPS sizing, repository/environment names, SSH details, and operator ownership remain open.

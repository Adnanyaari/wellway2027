# Well Way 2027 — mandatory agent instructions

> Phase update (2026-09-06): The owner has explicitly authorized the initial scaffold, dependency installation, schema generation, and local verification. Earlier documentation-only restrictions below describe the previous phase and no longer block this scope. Full website/dashboard features, fake content, applied database migrations, and production deployment remain unauthorized. Read docs/adr/0001-initial-scaffold.md (relative to repository root) for the current scaffold decisions. Routine reversible scaffold choices are covered by this authorization; production architecture acceptance remains a later gate.

Read this file first on every task. These instructions apply to the entire repository and to every AI agent and developer. Before delegating future work, give each agent these same reading requirements.

## Current phase: initial scaffold

The owner has approved the initial scaffold and its local verification. Preserve this boundary: no full business pages, dashboard modules, fake content, seed data, applied database migrations, or deployment. Read [ADR 0001](docs/adr/0001-initial-scaffold.md) for the implemented foundations and outstanding decisions. Further feature work needs approval. Scaffold approval does not authorize production deployment or destructive data changes.

## Required reading order

1. `AGENTS.md` (this file).
2. [Master rules](docs/00-MASTER-RULES.md).
3. [Documentation index](docs/README.md), [architecture](docs/01-PROJECT-ARCHITECTURE.md), and [workflow](docs/11-CODEX-WORKFLOW.md).
4. Every applicable domain document in the table below; multi-domain tasks require all relevant documents.
5. [ADR rules and index](docs/adr/README.md) and all accepted ADRs relevant to the task. Read existing implementation and local instructions before editing it, once implementation exists.

| Change area | Required domain reading |
| --- | --- |
| Routes, navigation, public pages | `02-SITE-STRUCTURE.md`, `03-CONTENT-MODEL.md`, `04-DESIGN-SYSTEM.md`, `08-SEO-I18N.md` |
| Components, styling, themes, responsive behavior | `04-DESIGN-SYSTEM.md`, `08-SEO-I18N.md`; also `02-SITE-STRUCTURE.md` for route changes |
| Content, translations, publishing, assets | `03-CONTENT-MODEL.md`, `05-DATABASE.md`, `07-SECURITY.md`, `08-SEO-I18N.md` |
| Database, Prisma, queries, migrations | `03-CONTENT-MODEL.md`, `05-DATABASE.md`, `06-AUTH-RBAC.md`, `07-SECURITY.md`; also the affected business domain |
| Authentication, sessions, users, permissions | `05-DATABASE.md`, `06-AUTH-RBAC.md`, `07-SECURITY.md`, `09-DASHBOARD-CRM.md` |
| Forms, leads, email, CRM, analytics | `03-CONTENT-MODEL.md`, `05-DATABASE.md`, `06-AUTH-RBAC.md`, `07-SECURITY.md`, `09-DASHBOARD-CRM.md`; also `08-SEO-I18N.md` for public entry points |
| SEO, localization, redirects | `02-SITE-STRUCTURE.md`, `03-CONTENT-MODEL.md`, `08-SEO-I18N.md`, `12-MIGRATION-CURRENT-SITE.md` |
| CI/CD, runtime, secrets, infrastructure | `07-SECURITY.md`, `10-DEVOPS-DEPLOYMENT.md`, `12-MIGRATION-CURRENT-SITE.md` |
| Architecture, dependencies, domain boundaries | `01-PROJECT-ARCHITECTURE.md`, relevant domain files, and `adr/README.md`; an architecture change requires an ADR |
| Legacy migration, launch | `05-DATABASE.md`, `08-SEO-I18N.md`, `10-DEVOPS-DEPLOYMENT.md`, `12-MIGRATION-CURRENT-SITE.md` |
| Rule/documentation changes | Master rules, workflow, and every affected domain document; update links and ADRs as needed |

Domain filenames in the table are relative to `docs/`. Do not treat unread documentation as optional. Resolve contradictions before dependent work; do not silently weaken a rule.

## Non-negotiable working rules

- Never invent business statistics, clients, testimonials, reviews, project claims, or publishable business content. Request verified source material.
- Never expose secrets, bypass authorization, or rely on hidden UI controls for security.
- Enforce Arabic/English, RTL/LTR, and light/dark compatibility. Assess SEO for every public route change.
- Prefer Server Components. Introduce Client Components only for necessary interactivity or browser APIs.
- Keep database access and authorization in explicit server boundaries; use reusable domain services and components.
- Before completing a coding task, run lint, strict typecheck, and relevant tests. Report exact checks and failures honestly. For documentation-only tasks, validate files, links, consistency, and scope without installing tooling.
- Update affected rules when behavior changes. Architecture changes require an accepted ADR before implementation.
- Preserve unrelated work, avoid destructive operations, and report missing decisions or material blockers.

## Completion report

State what changed, validation performed, assumptions, and unresolved decisions. For this phase, show the final folder tree, installed dependencies, required environment variables, and intentionally deferred work, then stop for approval.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

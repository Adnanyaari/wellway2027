# 11 — Codex and developer workflow

> Phase update (2026-09-06): The owner has explicitly authorized the initial scaffold, dependency installation, schema generation, and local verification. Earlier documentation-only restrictions below describe the previous phase and no longer block this scope. Full website/dashboard features, fake content, applied database migrations, and production deployment remain unauthorized. Read docs/adr/0001-initial-scaffold.md (relative to repository root) for the current scaffold decisions. Routine reversible scaffold choices are covered by this authorization; production architecture acceptance remains a later gate.

## Before work

Read [AGENTS.md](../AGENTS.md) first, then [master rules](00-MASTER-RULES.md), architecture, this workflow, relevant domain rules, and relevant accepted ADRs. Inspect repository state and preserve unrelated edits. State task scope, assumptions, and unresolved decisions. Do not begin dependent implementation when source content or an architectural approval is missing.

Current scope is the initial scaffold and its verification, explicitly authorized by the owner. Further features, applied migrations, seed data and deployment require the next approved scope.

## After implementation is approved

1. Identify affected domains, data, permission boundaries, locale/theme behavior, and public SEO.
2. Propose and obtain acceptance of an ADR for architecture changes before implementing them.
3. Make focused reusable changes with strict types, server-owned data operations, centralized permissions, and Server Components by default.
4. Add meaningful tests for affected behavior and failure modes; avoid tests that merely repeat implementation details.
5. Run checks, inspect the diff for secrets/unrelated changes, update affected documents, and prepare a reviewable change.
6. Report results and remaining limitations; deploy only through the separately approved release workflow.

Never invent business content, fabricate validation results, weaken authorization to pass a test, commit secrets, or erase another contributor's work. Do not hard-code roles throughout the application. New dependencies require a documented need, compatibility/security review, and an ADR when they affect architecture.

## Required validation

Every coding task must run `npm run lint`, `npm run typecheck`, and `npm test` before completion. Run `npm run db:generate` after a clean install or schema change, plus `npm run db:validate` for schema work. Also run `npm run build` for rendering, routing, framework/configuration changes and release candidates. Installation uses the pinned npm 11.19.1 toolchain; see the root README.

| Change | Relevant additional checks |
| --- | --- |
| UI/routes | Both languages, RTL/LTR, both themes, responsive behavior, keyboard/accessibility, public SEO |
| Auth/RBAC | Missing/revoked permission, unauthenticated requests, cross-record access, escalation attempts |
| Database | Migration against compatible MySQL, constraints, query behavior, compatibility/recovery review |
| Leads/email | Validation, duplicates, persistence failure, committed outbox, retries, restricted access, delivery failure |
| Content | Translation availability, publication visibility, rich-text sanitization, cache invalidation |
| Deployment | Exact release identity, gates, health checks, rollback and persistent data handling |
| Documentation only | Required file tree, local Markdown links, internal consistency, and absence of implementation changes |

If a required check cannot run, state the command, reason, and resulting limitation; do not mark the coding task fully validated. Never install tooling merely to validate this documentation phase.

## Review and completion

PR descriptions must explain the problem, resulting behavior, validation, and material risks. Include migration/SEO/permission effects when applicable. Update rule documents with accepted decisions so future agents do not rely on stale instructions.

For this scaffold task, deliver the folder tree, dependency versions, environment variables, validation and intentionally deferred work, then stop for approval before adding features. Scaffold completion is not product completion.

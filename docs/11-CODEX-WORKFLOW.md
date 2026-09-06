# 11 — Codex and developer workflow

## Before work

Read [AGENTS.md](../AGENTS.md) first, then [master rules](00-MASTER-RULES.md), architecture, this workflow, relevant domain rules, and relevant accepted ADRs. Inspect repository state and preserve unrelated edits. State task scope, assumptions, and unresolved decisions. Do not begin dependent implementation when source content or an architectural approval is missing.

Current scope is documentation only. Do not install dependencies, scaffold Next.js, generate application/configuration code, run migrations, or deploy. Finish documentation and wait for explicit build approval.

## After implementation is approved

1. Identify affected domains, data, permission boundaries, locale/theme behavior, and public SEO.
2. Propose and obtain acceptance of an ADR for architecture changes before implementing them.
3. Make focused reusable changes with strict types, server-owned data operations, centralized permissions, and Server Components by default.
4. Add meaningful tests for affected behavior and failure modes; avoid tests that merely repeat implementation details.
5. Run checks, inspect the diff for secrets/unrelated changes, update affected documents, and prepare a reviewable change.
6. Report results and remaining limitations; deploy only through the separately approved release workflow.

Never invent business content, fabricate validation results, weaken authorization to pass a test, commit secrets, or erase another contributor's work. Do not hard-code roles throughout the application. New dependencies require a documented need, compatibility/security review, and an ADR when they affect architecture.

## Required validation

Every coding task must run lint, strict typecheck, and relevant tests before completion. Define the real repository commands when tooling is introduced; no executable commands are assumed to exist now. Also run a production build for rendering, routing, framework/configuration changes and release candidates.

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

For this initial task, deliver the file tree, a short summary, and assumptions, then stop for approval before building. Documentation completion is not application completion.

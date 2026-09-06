# Well Way 2027 engineering rules

Status: documentation baseline; application implementation awaits explicit approval. These documents define required future behavior, not capabilities already built or tested.

Start with [AGENTS.md](../AGENTS.md), then [master rules](00-MASTER-RULES.md). All contributors must use the domain reading map in AGENTS.md.

| Document | Responsibility |
| --- | --- |
| [00 — Master rules](00-MASTER-RULES.md) | Binding requirements and completion gates |
| [01 — Project architecture](01-PROJECT-ARCHITECTURE.md) | Stack, modules, server boundaries |
| [02 — Site structure](02-SITE-STRUCTURE.md) | Public, authenticated, and internal route contracts |
| [03 — Content model](03-CONTENT-MODEL.md) | Verified content, translation, publication, media |
| [04 — Design system](04-DESIGN-SYSTEM.md) | Tokens, reusable components, themes, direction, accessibility |
| [05 — Database](05-DATABASE.md) | MySQL/Prisma entities, relationships, integrity, migrations |
| [06 — Authentication and RBAC](06-AUTH-RBAC.md) | Sessions, permissions, initial role policy |
| [07 — Security](07-SECURITY.md) | Validation, web defenses, uploads, audit, secrets |
| [08 — SEO and i18n](08-SEO-I18N.md) | Locale routing, indexation, metadata, structured data |
| [09 — Dashboard and CRM](09-DASHBOARD-CRM.md) | Management modules, leads, notifications, analytics |
| [10 — DevOps and deployment](10-DEVOPS-DEPLOYMENT.md) | Local development, GitHub Actions, VPS, rollback |
| [11 — Codex workflow](11-CODEX-WORKFLOW.md) | Task process, reviews, verification |
| [12 — Current-site migration](12-MIGRATION-CURRENT-SITE.md) | Inventory, redirects, imports, launch checks |
| [Architecture decisions](adr/README.md) | ADR process and decision index |

## How to maintain these rules

Use MUST/MUST NOT for requirements and clearly label proposed defaults or unresolved choices. Keep each domain's authoritative detail in its own document; cross-reference it elsewhere. Changes must be reviewed with their effects on other domains. An ADR records architecture decisions; update domain documents after acceptance so they remain accurate.

## Assumptions and open decisions

- The requested escaped filename `11-CODEX-WORKFLOW\.md` means `11-CODEX-WORKFLOW.md`.
- `README.md` is the docs index; `adr/README.md` additionally makes the ADR directory usable without fabricating decisions.
- Both locales use an equivalent route hierarchy with locale-specific detail slugs. Final labels, navigation, and content require approval.
- The initial RBAC assignments and lead states below are conservative proposed defaults, subject to owner review before implementation.
- No existing-site URL, approved copy, branding, media, data exports, or credentials were provided. Do not infer them.
- Framework/package versions, auth provider/library, email provider, upload storage, analytics/consent approach, retention periods, backup objectives, domain/DNS, and release approvals remain to be selected and documented before their dependent implementation.
- Documentation approval alone does not resolve those choices or approve production access.

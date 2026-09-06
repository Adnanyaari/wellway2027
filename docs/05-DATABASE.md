# 05 — Database

> Phase update (2026-09-06): The owner has explicitly authorized the initial scaffold, dependency installation, schema generation, and local verification. Earlier documentation-only restrictions below describe the previous phase and no longer block this scope. Full website/dashboard features, fake content, applied database migrations, and production deployment remain unauthorized. Read docs/adr/0001-initial-scaffold.md (relative to repository root) for the current scaffold decisions. Routine reversible scaffold choices are covered by this authorization; production architecture acceptance remains a later gate.

## Persistence rules

Use MySQL in development and production with Prisma ORM. XAMPP may provide only the local database service; verify it actually provides compatible MySQL rather than assuming a bundled database engine is equivalent. If it does not, use an approved local MySQL service. Choose compatible versions and record them before schema implementation.

Use UTF-8 capable `utf8mb4` storage and a deliberately selected collation suitable for Arabic, English, and slug uniqueness. Store timestamps in UTC and format for the viewer. Use stable primary keys, explicit foreign keys, created/updated timestamps, bounded strings, and appropriate indexes. Choose the exact ID convention in an ADR before implementation.

The table names below are logical contracts; required `clients` and `services` physical tables must exist, using Prisma mapping if model names differ. This document is not a migration or Prisma schema.

| Entity/table | Required data and relationships |
| --- | --- |
| `clients` | Identity, approved name, light logo media FK, dark logo media FK, lifecycle state |
| `client_translations` | Client FK, locale, localized display/description fields when needed |
| `services` / `service_translations` | Shared service identity/state; localized title, slug, content and SEO |
| `projects` / `project_translations` | Required client FK (one client per project); translated title, slug, content and SEO |
| `project_services` | Project FK plus service FK; composite unique constraint prevents duplicate associations |
| `media` / `media_translations` | Storage metadata and ownership; localized alt text/captions |
| `project_media` | Project FK, media FK, gallery order and role |
| `posts` / `post_translations` | Article identity, author FK, translated editorial content and SEO |
| `faqs` / `faq_translations` | Ordering/grouping and translated question/answer |
| `testimonials` / `testimonial_translations` | Verified attribution/source/approval and localized approved statement |
| `pages` / `page_translations` | Shared page identity and localized approved content/SEO |
| `users` | Unique normalized email, account state, credential fields required by chosen auth design |
| `roles`, `permissions`, `user_roles`, `role_permissions` | Unique role names and permission keys; unique join pairs |
| `sessions` / recovery tokens | Fields required by approved auth design; expiry/revocation and protected token representation |
| `leads` | Contact fields, locale, message, source URL, referrer, UTM fields, nullable requested service FK, status, nullable assigned user FK, nullable follow-up date, timestamps |
| `lead_activities` | Lead FK, optional actor FK, activity type, note/change data and timestamp; preserve history |
| `notification_outbox` | Lead/event FK, unique deduplication key, delivery state, attempt count, next attempt, sanitized last error, sent time |
| `audit_logs` | Actor, action, target, result, timestamp and safe change metadata |
| `redirects` | Unique source path, target, permanent status, review/provenance metadata |

Translation records require unique `(parent, locale)`; slug-bearing records require unique `(locale, slug)` within their route namespace. Apply publication fields from [03](03-CONTENT-MODEL.md). Require at least one service association when publishing a project; allow several. Model enforcement and transaction boundaries must prevent orphaned or duplicate associations.

## Integrity and query rules

- Index actual access patterns: localized slugs, publication state, lead status/assignee/follow-up date/created time, foreign keys, and outbox polling. Validate expensive queries rather than indexing blindly.
- Use transactions for dependent writes, including lead creation, initial activity, and notification outbox insertion.
- Document deletion behavior for every relation. Prefer archival for referenced clients/services/projects; restrict deletion that would erase project ownership or lead history. Never cascade-delete business history by accident.
- Account deactivation must preserve attribution. Any approved user erasure must safely handle assignment and historical records.
- Use parameterized Prisma operations. Raw SQL requires clear necessity, parameterization, and review. Never build SQL from user strings.
- Paginate collections and select only needed fields. Do not return credentials, private lead data, or internal notes to public consumers.

## Migrations and access

Commit reviewed Prisma migrations after implementation approval. Test migrations against local/staging MySQL with representative authorized data. Do not use development reset commands or schema push against production. Production migrations run once per serialized deployment with dedicated migration credentials; runtime credentials use least privilege and no schema administration rights.

Before destructive migration, require explicit approval, a verified backup, impact analysis, and a tested recovery strategy. Prefer backward-compatible expansion/contraction so application rollback is possible. Never seed fake business data or default passwords into production. Initial role/permission creation must be repeatable, reviewed, and separate from privileged account bootstrap.

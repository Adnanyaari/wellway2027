# 01 — Project architecture

> Phase update (2026-09-06): The owner has explicitly authorized the initial scaffold, dependency installation, schema generation, and local verification. Earlier documentation-only restrictions below describe the previous phase and no longer block this scope. Full website/dashboard features, fake content, applied database migrations, and production deployment remain unauthorized. Read docs/adr/0001-initial-scaffold.md (relative to repository root) for the current scaffold decisions. Routine reversible scaffold choices are covered by this authorization; production architecture acceptance remains a later gate.

## Required stack and boundaries

Use Next.js App Router with React, strict TypeScript, Tailwind CSS, Prisma, and MySQL. Do not substitute the Pages Router or another production database without explicit requirement approval and an ADR. Select supported, compatible versions at implementation time and record them; this document does not prescribe unverified version numbers.

The application contains public marketing routes and an authenticated dashboard backed by shared business services. Keep these layers explicit:

| Layer | Responsibility |
| --- | --- |
| Route/layout | Locale resolution, metadata, request orchestration, page composition |
| UI components | Reusable presentation, accessible interaction, typed inputs |
| Server entry points | Server Actions/Route Handlers: request validation, identity, permission and scope checks |
| Domain services | Business rules, transaction orchestration, authorized queries and mutations |
| Data access | Server-only Prisma operations, constrained selects, database persistence |
| Integrations | Email, media storage, analytics adapters and operational failure handling |

The scaffold maps these layers to root-level `app/`, `components/`, `features/`, `lib/`, `db/`, `messages/`, `public/`, and `tests/`. Route files may call server services but must not accumulate SQL, permission rules, or repeated business logic. Data access and trusted operations must never enter a client bundle. Return explicit safe DTOs rather than entire database records. See [ADR 0001](adr/0001-initial-scaffold.md).

## Dynamic content control path

Owner-managed content and operational settings follow one complete control path: database record → authorized dashboard management → public or internal rendering. A site section is not complete while its editable content exists only in source code, or while its database fields have no suitable dashboard controls. Each module must define validation, permissions, translation and publication behavior, media references, ordering, activation or archival, and cache invalidation as applicable.

Page composition, component behavior, semantic design tokens, technical limits, security policy, secrets, and deployment configuration remain in code or protected environment configuration unless the owner explicitly classifies a specific value as an editable business setting. See [ADR 0003](adr/0003-dynamic-content-control-path.md).

## Rendering and state

- Prefer Server Components for public content and server data fetching. Use Client Components only for interaction, state, or browser APIs that require them; keep the boundary small.
- Server Actions and Route Handlers are callable security boundaries, not inherently trusted callers. Revalidate every request and enforce the same domain policy.
- Keep URL state for shareable filters where appropriate. Avoid global client state for data already owned by the server.
- Cache only data safe for its audience. Never share user-specific or permission-sensitive responses through public caches. Document invalidation for publication, slug, translation, and permission changes.
- Use reusable layout, form, validation, pagination, media, and localized content patterns. Avoid parallel implementations for each locale or theme.
- Isolate provider-specific code behind interfaces. Choose auth, email, storage, and background-job execution using ADRs before implementation.

## Reliability

Use transactions for related writes and an outbox for lead email delivery, as defined in [09](09-DASHBOARD-CRM.md). Define idempotency, retry, and failure behavior for integrations. Log correlation identifiers with sanitized errors; never expose internal stack traces to public users. Use bounded queries and pagination for collections.

Architecture changes require the [ADR process](adr/README.md), domain documentation updates, and owner acceptance before implementation.

# 09 — Dashboard and CRM

## Management modules

The dashboard is the management surface for every owner-editable content field and operational site setting stored in the database. New dynamic site sections must include the corresponding dashboard controls for all applicable content, translations, media, ordering, publication, activation, archival, and SEO fields. Database fields without a usable management path and dashboard inputs without server persistence are incomplete. Layout structure, design-system tokens, secrets, and infrastructure configuration remain outside ordinary content controls.

The approved dashboard shell is implemented as an independent authenticated layout. Its sidebar is filtered by explicit permissions and covers overview, clients, services, projects, content, leads, media, analytics, SEO, employees, roles, general settings, and audit. The overview reads real aggregate counts from MySQL for authorized users; absent data remains zero and no sample metrics or activity are fabricated. Module workspaces currently expose only protected empty states until each management workflow is implemented and approved.

The clients module now lists and searches up to 50 current database records as expandable accordion rows. The collapsed view shows identity, lifecycle state, and project count; the expanded view contains all remaining details, settings, editing, locale-specific publishing, archival, and restoration controls. Creation and editing include separate light-theme and dark-theme logo selectors backed by active public image records in the media library. New translations and edited translation names return to draft for review. A user with `clients.publish` may publish or unpublish each available locale independently; only active clients with an approved date and a published translation appear in that locale's homepage strip. The public strip reads directly from MySQL and selects the matching light or dark logo, with the approved alternate logo or client name as a fallback. Client removal is intentionally unavailable; archival preserves project relations and history. Each write runs in a transaction with an audit-log record.

Client logo workflow: each light-theme and dark-theme logo field provides direct upload, preview, replacement, removal, and selection from existing eligible media without leaving the client form. A successful direct upload creates one authoritative `media` record and safe storage identifier, assigns it to the current field, and makes it appear automatically in the shared Media library for later reuse. One asset may serve both themes when legible. Replacing or clearing a selection updates the client's media references without duplicating or automatically deleting the file. The Media module displays up to 100 database-backed files with previews, metadata, state, and reference counts. The upload UI and storage/processing adapter require acceptance of [ADR 0004](adr/0004-local-media-storage.md) before uploads can be enabled.

Provide permission-gated client, service, project/portfolio, lead, blog, FAQ, testimonial, user/permission, and analytics modules. Support bounded search/filtering/pagination, explicit empty/error states, and audited writes. Content modules obey translation and publication rules; project editing enforces one client, multiple service associations, and ordered media. Client editing supports both theme logos.

The Pages module is the dashboard home for page-owned content. Its first complete control path is Home → Hero: Arabic and English eyebrow, headline, description, primary action, portfolio action, and light/dark hero images are edited independently, saved as drafts, and published per locale through `pages.update` and `pages.publish`. Each theme image can be selected from the shared Media library or uploaded directly from the Hero form; direct uploads create reusable Media records. The public homepage reads only the published translation and active public media from MySQL and retains the existing approved fallback until a locale is published. General settings remain reserved for site-wide values shared across pages.

User/role management follows [06](06-AUTH-RBAC.md). All dashboard/auth pages are noindex and support both languages, both directions, and both themes. Do not place private records in public caches or analytics payloads.

## Unified lead capture

All public contact/service/project inquiry surfaces must use one shared lead validation and persistence workflow. Context can preselect a service but cannot bypass server verification.

Store contact name and supplied email/phone (require at least one usable contact channel), message, locale, source URL, referrer, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, requested service, status, assigned user, follow-up date, timestamps, and notes/activity history. Attribution may be absent; represent unknown values honestly. Capture consent evidence where required by approved policy.

Validate field lengths and URL schemes; strip secrets/sensitive query parameters from source URLs and referrers while keeping approved attribution. Treat submitted attribution as untrusted marketing context, never identity or authorization. Use a documented first/last-touch policy before adding attribution persistence; do not invent missing data. Accept only public active service IDs for public requests.

## Save and notification contract

1. Apply server validation, abuse controls, and an idempotency strategy for duplicate retries.
2. In one transaction save the lead, initial activity, and a deduplicated pending notification outbox event.
3. Return success only after commit. If persistence fails, report failure and do not send email.
4. A durable worker processes committed outbox events, sending to configured authorized staff through the approved email provider.
5. Record delivery results, retry transient failures with bounded backoff, and expose permanent failures for authorized operational review/retry.

Do not launch email as an untracked in-request fire-and-forget task. Email failure after commit must not remove the saved lead or ask the visitor to resubmit it. Use locking/claiming safe across workers and deduplication/provider idempotency where supported. Delivery is at least once unless the provider offers stronger guarantees; do not promise exactly-once email across crash boundaries. The worker runtime requires an ADR before implementation.

Notifications should contain minimal necessary information and an authenticated dashboard link. Do not include sensitive notes or raw unsanitized user HTML. Sending acknowledgments to visitors is a separate unapproved feature, not implied by staff notifications.

## Lead lifecycle — proposed baseline

Initial status is NEW, initially unassigned with no follow-up date. Proposed states are NEW, IN_PROGRESS, QUALIFIED, WON, LOST, and SPAM. Owners must approve definitions and transitions before implementation; statuses are not permissions.

Assignment requires `leads.assign`; agents with assigned scope can access only their current assignments. Status changes, assignment changes, follow-up changes, and notes produce timestamped activities with actor attribution. Record reasons for closing/reopening where appropriate. Preserve history rather than overwriting it; correction/removal must follow approved retention policy and audit requirements.

Follow-up dates represent an explicit time or documented date-only convention, stored consistently with UTC rules. Automated reminders are not assumed. Apply optimistic concurrency or another documented conflict strategy to avoid silent loss of concurrent edits.

## Analytics

Provide truthful aggregates such as lead counts by status/source/service and approved operational trends. Define event/metric semantics, timezone, date ranges, attribution limits, and freshness. Missing data is an empty/unknown state, never fabricated growth or conversions. Aggregate analytics permission does not grant raw lead access. Any drill-down/export requires its own permission and PII policy.

Select analytics tooling and consent behavior before collection. Do not send names, contact details, message bodies, notes, or raw sensitive URLs to third-party analytics. Verify filters and aggregation without exposing individual lead records to analytics-only users.

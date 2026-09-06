# 09 — Dashboard and CRM

## Management modules

Provide permission-gated client, service, project/portfolio, lead, blog, FAQ, testimonial, user/permission, and analytics modules. Support bounded search/filtering/pagination, explicit empty/error states, and audited writes. Content modules obey translation and publication rules; project editing enforces one client, multiple service associations, and ordered media. Client editing supports both theme logos.

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

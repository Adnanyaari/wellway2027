# 0004 — Local media storage

Date: 2026-09-09. Status: Accepted. Decision owner: project owner. Acceptance evidence: the owner replied "اعتمد" after reviewing the local-storage proposal, then required inline upload controls whose uploads also appear in the shared Media library.

## Context and constraints

The client editor supports separate light and dark logo media references, and the Media module can read database-backed files. The owner requires a direct upload control wherever a dashboard form accepts a logo or image; every successful inline upload must also appear automatically in the shared Media library. Administrative upload still needs a defined durable storage boundary. Deployments replace application releases, so uploaded files cannot live inside a release checkout or Next.js build output. Uploads require `media.upload`, server validation, safe names, bounded sizes, audit records, and reliable backup.

## Proposed decision

Store uploaded public media in a persistent directory on the Well Way VPS configured by a server-only `MEDIA_STORAGE_ROOT` environment variable and mounted outside release directories. Store only generated storage keys and verified metadata in MySQL. Serve approved public assets through a controlled media route; never expose arbitrary filesystem paths.

Initially accept JPEG, PNG, and WebP images up to 5 MB. Verify file signatures rather than trusting extensions or submitted MIME types, read image dimensions, generate collision-resistant names, and reject malformed or oversized images. SVG upload remains disabled until a sanitization strategy is separately approved. Create the file and `media` record as one compensating workflow: remove the file if the database transaction fails, and never publish a record before the file is durable. Audit successful and failed administrative upload attempts without storing file bodies in logs.

Provide one reusable inline media-field component for every logo/image setting. It supports direct upload in context, immediate preview, replacement, removal of the field reference, and selection from existing eligible media. Direct upload creates a single shared `media` record, assigns its ID to the edited field, and exposes the same record in the Media library. The upload must not create a private duplicate outside the library, and removing a field reference must not delete a file that may be reused elsewhere.

## Alternatives considered

- Store uploads under repository `public/`: rejected because releases and rollbacks can overwrite or orphan user uploads.
- Store image bytes in MySQL: rejected because it increases database and backup load and complicates efficient delivery.
- Use object storage now: deferred because no provider or credentials have been selected; the adapter boundary should allow a later migration.

## Consequences and tradeoffs

The VPS persistent directory must be created with least-privilege ownership and included in backups. Multi-server scaling would require shared/object storage. Public delivery must set the verified content type and prevent traversal. Arabic and English alternative text remain database translations. Theme-specific client fields reference the same media library without duplicating files.

## Rollout, rollback, and validation

After owner acceptance, implement the storage adapter, authenticated upload action, controlled public delivery, reusable inline media field, Media upload UI, validation and audit tests, and environment documentation. Verify permission denial, signatures, size limits, traversal resistance, duplicate names, database/file failure cleanup, previews, automatic library registration, reuse, reference removal, and client light/dark logo selection. No database migration is expected because the current `media` model already contains the required metadata.

Rollback disables new uploads while retaining existing database references and persistent files. File deletion remains unavailable until reference checks, retention, and recovery behavior are separately implemented.

Affected documents: architecture, database, security, deployment, dashboard/CRM, environment reference, and operations documentation. Related ADRs: [0001](0001-initial-scaffold.md) and [0003](0003-dynamic-content-control-path.md). Supersedes none.

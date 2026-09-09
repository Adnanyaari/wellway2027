# 0003 — Dynamic content control path

Date: 2026-09-09. Status: Accepted. Decision owner: project owner. Acceptance evidence: the owner explicitly directed that every dynamic site item must have dashboard settings and database persistence, then requested that this rule be documented.

## Context and constraints

The public site and administration dashboard are two surfaces over the same business data. Hard-coded editable content creates conflicting sources of truth, while database fields without dashboard controls make routine changes depend on code edits. Dynamic management must still preserve server authorization, verified content, translations, publication state, media safety, and audit requirements.

## Decision

Every owner-managed business-content field and operational site setting uses one authoritative database record and an appropriate permission-gated dashboard control. Each dynamic feature is delivered as a complete path: database contract, dashboard management, and site rendering through server-owned domain services.

Applicable modules expose the fields needed for Arabic and English content, media, ordering, visibility, publication, activation or archival, SEO, and operational configuration. Validation and authorization run on the server, and meaningful writes are audited according to the affected domain rules.

Page structure, component behavior, design tokens, technical constants, secrets, security policy, and infrastructure configuration stay in source code or protected environment configuration. They become dashboard-editable only when the owner explicitly defines a safe business need and the relevant architecture and security requirements are documented.

## Alternatives considered

- Hard-code changing business content in page components: rejected because it duplicates state and requires code changes for editorial work.
- Store content in the database without dashboard management: rejected because it leaves no complete owner workflow.
- Make all technical values editable: rejected because it exposes implementation and security controls outside their proper boundaries.

## Consequences and tradeoffs

Feature scope includes schema reuse or design, permission-aware dashboard controls, validation, persistence, and rendering. This adds work to each module but provides one source of truth and a consistent owner workflow. Arabic/English, RTL/LTR, light/dark media, publication, SEO, caching, audit, and archival requirements apply where relevant. Secrets and infrastructure values never enter public content APIs or ordinary dashboard forms.

## Rollout, rollback, and validation

Apply the rule incrementally to each approved module. Existing hard-coded placeholders may remain only as clearly identified incomplete states and must not be treated as finished dynamic content. No database migration is authorized by this ADR alone; each schema change still needs its normal review and migration process. Rolling back this decision would require a superseding owner-accepted ADR and updates to all governing documents.

Validate each implemented module from database write through authorized dashboard read/write to final site rendering, including negative permission cases and applicable locale, theme, publication, cache, and SEO behavior.

Affected documents: master rules, project architecture, content model, dashboard/CRM, and the Home implementation prompt. Related ADR: [0001 — Initial scaffold](0001-initial-scaffold.md). Supersedes none.

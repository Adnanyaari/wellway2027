# 0005 — Database-backed UI terminology

Date: 2026-09-20. Status: Accepted. Decision owner: project owner. Acceptance evidence: the owner approved managing interface terminology from General Settings, with database persistence and JSON dictionaries retained as defaults.

## Context and decision

Arabic and English interface labels need owner-controlled terminology without editing immutable production release files. Business content remains in its domain translation tables. The application stores validated UI-message overrides in the non-secret `ui.messages` site setting, audits writes behind `settings.manage`, and merges overrides over the typed `messages/ar.json` and `messages/en.json` defaults at request time.

The settings workspace lists and searches dictionary keys and edits both locales together. New keys may be stored, but they affect the interface only after code references them. Runtime code never writes into source-controlled JSON files.

## Alternatives and consequences

Writing JSON inside a deployed release was rejected because releases are immutable and a later deployment would discard the changes. Sanity was not selected for interface terminology. The database adds a runtime dependency for localized UI; strict validation, safe path handling, default fallbacks, authorization, auditing, and cache revalidation limit that risk.

Business content, SEO publication records, and operational data do not move into this dictionary. Light/dark behavior is unaffected. Arabic/English values are edited together so missing locale text is not silently introduced.

## Rollout, rollback, and validation

No schema migration is required because the accepted `site_settings` JSON model is reused. Removing the `ui.messages` record restores source defaults. Validate permissions, malformed keys, both directions/themes, public metadata, cache invalidation, and fallback behavior.

Affected documents: content model, dashboard rules, ADR index. Related ADR: 0003.

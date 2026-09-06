# 03 — Content model

## Truth and ownership

All public business content must come from approved source material. Record its source, editor, review state, and publication approval. Do not invent business statistics, clients, projects, testimonials, reviews, credentials, awards, service claims, or translations represented as approved. Development fixtures, if later authorized, must be clearly synthetic, excluded from production, and never presented as business evidence.

## Translation and publishing contract

- Separate shared identity/relationships from locale-specific fields. Use translation records with a unique parent ID plus locale; supported locales are `ar` and `en`.
- Localize titles, slugs, body content, summaries, SEO fields, accessible media text, and relevant display labels. UI translations and business content translations are separate concerns.
- Each translation has draft/published/archived state, review information, and publication timestamps. Publishing requires verified mandatory fields and source approval.
- Missing translations remain unpublished. Do not silently fall back to another language on an indexable locale route. UI must explain unavailable translations and locale switching must use only available equivalents.
- Shared record archival prevents all its translations from appearing publicly. Deletion must respect relationships, historical records, and redirects.
- Sanitize rich text using a defined allowlist on the server. Never permit arbitrary scripts or executable embeds.

## Domain contracts

| Domain | Required content rules |
| --- | --- |
| Clients | Verified name and publication permission; separate light-theme and dark-theme logo references; website only if verified |
| Services | Stable shared identity; Arabic/English titles, slugs, descriptions and SEO; active/archive state |
| Projects | Exactly one client; multiple service associations; ordered gallery/media; translated title, slug, description, and SEO; only verified outcomes |
| Blog | Translated article content and SEO, approved author attribution, publication dates and relevant media |
| FAQs | Translated questions/answers, ordering and publication state; no invented claims |
| Testimonials | Verified statement, approved attribution, source/consent evidence and publication approval; no fabricated ratings |
| Shared pages | Approved localized marketing and policy content; use the same translation/publication rules |
| Leads | Private operational records, never public marketing content; see [09](09-DASHBOARD-CRM.md) |

Both logo fields must be supported; clients may have one approved asset reused for both themes if it is legible. Missing assets must use a neutral text treatment, never an invented logo. Store testimonial consent evidence privately.

## Media and editorial integrity

Store media metadata including storage identifier, MIME type, dimensions where applicable, size, ownership/source, purpose, and localized alternative text. Mark decorative images explicitly. Galleries need deterministic ordering. Apply [upload security](07-SECURITY.md) to every media path, including admin uploads.

Preview requires authorization, is noindex, and cannot populate public caches. Publishing, unpublishing, slug changes, and asset replacement must invalidate affected public caches and update sitemap/metadata eligibility. Changes to a published slug require a redirect record. Publishing permissions are distinct from editing permissions.

# 08 — SEO and internationalization

> Phase update (2026-09-06): The owner has explicitly authorized the initial scaffold, dependency installation, schema generation, and local verification. Earlier documentation-only restrictions below describe the previous phase and no longer block this scope. Full website/dashboard features, fake content, applied database migrations, and production deployment remain unauthorized. Read docs/adr/0001-initial-scaffold.md (relative to repository root) for the current scaffold decisions. Routine reversible scaffold choices are covered by this authorization; production architecture acceptance remains a later gate.

## Locale contract

Public routes use `/ar` and `/en`. Set correct document language and direction, translate UI/validation/metadata, and format dates/numbers intentionally. Resolve locale on the server and keep hydration consistent. Both locales and RTL/LTR are mandatory across public and authenticated pages. See [03](03-CONTENT-MODEL.md) for missing-translation behavior.

## Indexable page requirements

- Generate unique, truthful localized titles/descriptions from approved content.
- Use absolute canonical URLs based on a validated production origin. Canonicals normally self-reference each locale's clean URL; never canonicalize all Arabic pages to English or vice versa.
- Add reciprocal `hreflang` links for published Arabic/English equivalents using their real slugs. Use `x-default` only if an approved fallback destination exists. Exclude missing/draft translations.
- Generate sitemaps containing only canonical, published, indexable, successful public URLs. Use genuine modification dates and update on publish/archive/slug changes.
- Maintain robots rules and sitemap discovery for production; prevent staging indexation with access protection and noindex. Robots is not an access control system.
- Provide localized Open Graph and social metadata with approved imagery and absolute URLs.
- Add truthful structured data suited to the actual page content (for example Organization, Service, Article, BreadcrumbList). Never fabricate ratings, review counts, prices, or business facts; validate the output and do not promise rich results.
- Provide visible, accessible breadcrumbs with structured data matching the visible hierarchy.

## Exclusions and response semantics

Dashboard, auth, previews, and internal pages must emit noindex through metadata and/or response headers and never enter sitemaps. Private endpoints still require authorization. Do not rely only on robots disallow to remove indexed URLs: blocked crawlers may not see noindex. Define a removal approach for any already-indexed internal URL.

Return real 404/410 statuses when appropriate, avoid soft 404s, and never send removed pages indiscriminately to home. Use reviewed permanent 301 redirects for legacy or changed URLs. Redirect destinations must be relevant, canonical, published, and accessible; prevent loops and chains. See [12](12-MIGRATION-CURRENT-SITE.md).

Strip tracking parameters from canonical URLs. Decide filter/pagination indexing per route before implementation; do not canonicalize distinct content blindly. Locale navigation must link equivalent entities rather than mechanically replacing path text.

## Performance and verification

Prefer server-rendered crawlable content, semantic headings/links, responsive optimized media, and minimal client JavaScript. Assess layout shift, loading, and interaction performance with representative content; set measurable performance budgets before launch.

Every public route task must review HTTP status, canonical, alternates, metadata, robots/indexability, sitemap eligibility, breadcrumbs, structured data when applicable, internal links, and both locale presentations. Publication and redirect changes must invalidate affected caches. Validate generated HTML and headers, not only metadata source code.

# 12 — Migration from the current site

## Source-of-truth rule

The current website URL, exports, analytics/search access, and approved business assets have not been supplied. Do not invent its route inventory, content, traffic, rankings, or redirects. This document defines the required future migration process; no crawl or import has been performed.

## Inventory before replacement

After source access is provided and migration work authorized, inventory existing public URLs, HTTP status, redirects, canonicals, language, titles/descriptions, headings, internal links, structured data, images/downloads, forms, and indexability. Use approved exports/sitemaps/crawl results and available authorized analytics to prioritize important URLs. Record provenance and review dates; do not assume crawled content is approved to republish.

Inventory clients, services, project ownership and service relationships, galleries, posts, FAQs, testimonials, theme logos, and translation availability. Identify duplicates, missing permissions/rights, unsupported claims, and missing translations for owner review. Do not infer a project's client or fabricate an absent dark logo.

## Redirect mapping contract

Maintain a reviewable migration register with old URL/path, old locale/status, intended action, new canonical URL, redirect code, rationale, source evidence, approval state, and verification result. Create actual mappings only from verified URLs.

- Use 301 for permanent moves with a relevant approved replacement.
- Preserve meaningful locale equivalence and exact path/encoding behavior; review query-sensitive old routes separately from tracking parameters.
- Resolve chains to the final published destination; prevent loops, open redirects, and redirects into auth/internal or draft pages.
- For content without a relevant replacement, choose a reviewed 404/410 or approved replacement strategy. Never blanket-redirect everything to home.
- Choose one authoritative redirect execution layer through an ADR, with a documented relationship to database redirect management and Nginx HTTPS/host normalization.
- Keep redirects active after launch under an approved retention policy and monitor old-URL requests.

## Data migration

Define field mappings to [05](05-DATABASE.md), preserve stable legacy identifiers in the migration register, and validate encoding, dates, slugs, publication approvals, and relationships. Imports must be repeatable or safely resumable and produce discrepancy reports. Use a staging dry run and compare source/target counts and representative records; a matching count alone is insufficient.

Migrate credentials only through a reviewed compatible authentication strategy; never import plaintext passwords. Limit private data access and do not import historical leads/users unless specifically authorized. Preserve source backups and do not modify the current site during inventory.

## Launch and post-launch

Before cutover, approve content and translations, resolve redirect mappings, verify sitemaps/canonicals/hreflang/robots/structured data, exercise forms and notifications, and verify both themes and directions. Define a content freeze or delta-import strategy, a database/media backup, a rollback plan, DNS/SSL ownership, and cutover responsibility.

After authorized deployment, verify redirect status and final destination for each mapping, monitor 404s and application/notification failures, and review index coverage using authorized search tooling. Submit the production sitemap when authorized. Record real findings and remediate regressions without manufacturing traffic or ranking results.

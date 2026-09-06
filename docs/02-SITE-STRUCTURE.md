# 02 — Site structure

## Routing rules

Every public content route must live under `/ar` or `/en`. Resolve `/` to an approved default locale using a deterministic redirect; the default locale is an open decision. Do not vary an indexable page's content language silently by browser settings. Locale switching must navigate to the equivalent translated record, not assume that slugs match.

The following is a proposed route contract; final navigation and wording require approved content. It defines scope without asserting that pages or content exist.

| Route under `/{locale}` | Purpose |
| --- | --- |
| `/` | Home |
| `/about` | Approved company information |
| `/services` and `/services/{slug}` | Services index and detail |
| `/projects` and `/projects/{slug}` | Portfolio index and detail |
| `/clients` | Approved client references |
| `/blog` and `/blog/{slug}` | Blog index and article |
| `/faqs` | Published FAQs |
| `/contact` | Unified contact/lead form |
| `/privacy` and `/terms` | Owner-approved policy content where applicable |

Testimonials may appear as reusable approved sections; a standalone route is not assumed. Do not publish empty, fabricated, or placeholder pages merely to fill navigation.

## Authenticated and internal routes

Use `/{locale}/dashboard` with permission-gated modules for analytics, clients, services, projects, leads, blog, FAQs, testimonials, users, and roles/permissions. Use localized authentication routes such as `/{locale}/auth/login` and the approved recovery flow. Public registration is disabled by default pending approval.

Dashboard, authentication, preview, search/filter variants intended as internal, and internal utility pages must be noindex and excluded from sitemaps. APIs and private downloads require appropriate authentication/permission checks and must not leak private data. URLs, layout guards, or robots rules never replace server authorization.

## Navigation and route behavior

- Keep shared navigation consistent across languages, adapting direction and labels.
- Validate locale and slug parameters. Unknown resources return proper 404 responses; unauthenticated/unauthorized flows must not leak protected records.
- Show only published content for the requested locale. Never expose drafts through direct URLs or alternate APIs.
- Redirect changed published slugs and imported legacy URLs through reviewed 301 mappings. Avoid chains and loops.
- Define canonical behavior for pagination, query parameters, and filters before introducing them.
- Use meaningful error, empty, loading, and success states in both languages.

Public route changes require [SEO review](08-SEO-I18N.md) and, where replacing a legacy route, [migration review](12-MIGRATION-CURRENT-SITE.md).

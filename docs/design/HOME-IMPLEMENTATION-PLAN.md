# WELL WAY — Home Page Implementation Plan

## Status

Approved phased implementation plan.

This file organizes delivery only. It does not replace or weaken the project's design, content, security, database, SEO, localization, testing, or deployment rules. The specialist documents remain authoritative for their domains.

## Primary references

- Visual specification: [`HOME-DESIGN-SPEC.md`](HOME-DESIGN-SPEC.md)
- Implementation requirements: [`HOME-CODEX-PROMPT.md`](HOME-CODEX-PROMPT.md)
- Approved visual reference: [`reference/wellway-home-dark.png`](reference/wellway-home-dark.png)
- Project architecture: [`../01-PROJECT-ARCHITECTURE.md`](../01-PROJECT-ARCHITECTURE.md)
- Content rules: [`../03-CONTENT-MODEL.md`](../03-CONTENT-MODEL.md)
- Design system rules: [`../04-DESIGN-SYSTEM.md`](../04-DESIGN-SYSTEM.md)
- Database rules: [`../05-DATABASE.md`](../05-DATABASE.md)
- Security rules: [`../07-SECURITY.md`](../07-SECURITY.md)
- SEO and localization rules: [`../08-SEO-I18N.md`](../08-SEO-I18N.md)
- Engineering workflow: [`../11-CODEX-WORKFLOW.md`](../11-CODEX-WORKFLOW.md)

## Global delivery rules

- Keep the approved Home Page section order.
- Support Arabic/English, RTL/LTR, and light/dark modes in every completed phase.
- Use verified business content only. Do not publish invented clients, projects, statistics, testimonials, contact details, or claims.
- Read existing data sources before creating interfaces or proposing schema changes.
- Do not create or apply a database migration without explicit approval and a recovery plan.
- Use designed empty and unavailable states when approved content or media is missing.
- Keep the unfinished site noindex until publication is separately approved.
- Complete each phase's validation before treating it as finished.

## Phase 0 — Inputs and asset inventory

### Scope

- Receive and inspect the approved light and dark logos.
- Confirm Changa for Arabic and Rubik for English.
- Record available images and identify missing media.
- Map existing Prisma models and settings to Home Page sections.
- Separate approved content from visual-reference-only content.

### Deliverables

- Reviewed asset inventory.
- Data-source map for Hero, clients, services, statistics, projects, industries, testimonials, and global settings.
- Explicit list of missing data or dashboard capabilities.

### Acceptance

- Logo files have approved proportions and usable formats.
- No visual-reference claim is treated as verified business content without owner approval.
- Missing images have an agreed `No Image` treatment.

## Phase 1 — Visual foundation

### Scope

- Add shared semantic color, surface, border, typography, spacing, radius, elevation, glow, focus, and motion tokens.
- Configure Changa and Rubik using local font files when available.
- Establish responsive containers and section spacing.
- Implement reusable image fallback and empty-state primitives.
- Preserve the existing theme provider and locale routing.

### Deliverables

- Shared Home Page design tokens.
- Localized typography rules.
- Reusable `No Image` and empty-state presentation.
- Dark and light foundations matching the approved visual direction.

### Acceptance

- Arabic/light, Arabic/dark, English/light, and English/dark render correctly.
- Focus states and contrast remain visible.
- Reduced-motion preferences are respected.

## Phase 2 — Header and global controls

### Scope

- Implement the approved main navigation.
- Use the approved light/dark logo variants.
- Add the project CTA, locale switcher, and theme switcher.
- Add an accessible mobile navigation drawer.
- Keep navigation direction-aware and keyboard accessible.

### Deliverables

- Responsive desktop and mobile header.
- Working Arabic/English navigation.
- Persistent light/dark control.

### Acceptance

- Header works with keyboard, pointer, and touch.
- Active locale and current route are clear.
- Logo proportions are unchanged.

## Phase 3 — Hero Slider

### Scope

- Build a real data-driven Hero Slider.
- Implement autoplay, arrows, keyboard control, swipe, and bounded wheel navigation.
- Use transform and opacity transitions.
- Provide a designed visual fallback while Hero media is unavailable.
- Keep the component ready for a future dashboard-managed data source.

### Deliverables

- Responsive interactive Hero.
- Accessible controls and slide announcements.
- Typed Hero data contract that does not require a database migration.

### Acceptance

- Wheel input does not trap normal page scrolling at the logical boundaries.
- Autoplay pauses or reduces appropriately for interaction and reduced motion.
- Missing media does not cause layout shift or a broken image.

## Phase 4 — Clients and Services

### Scope

- Read approved active clients and localized published services from existing models.
- Build the clients marquee with pause-on-hover and touch scrolling.
- Build the required stacked/overlapping services carousel.
- Support any number of returned records.
- Hide or explain sections safely when no approved records exist.

### Deliverables

- Dynamic client strip.
- Dynamic services carousel.
- Theme-aware client logo selection and neutral logo fallback.

### Acceptance

- No client or service is hard-coded as business evidence.
- Archived or unpublished translations are excluded.
- Both interactions work with keyboard, pointer, touch, and reduced motion.

## Phase 5 — Statistics and Selected Work

### Scope

- Build a data-driven statistics presentation without fabricated values.
- Load eligible localized projects with their client, services, and ordered media.
- Apply the approved large-card treatment and image hover behavior.
- Use the shared `No Image` design when project media is absent.

### Deliverables

- Statistics component ready for an approved source.
- Selected Work section backed by existing project data.

### Acceptance

- Statistics remain hidden or explicitly unavailable until verified values exist.
- Only active, approved, locale-valid projects appear.
- Missing project imagery remains visually intentional and accessible.

## Phase 6 — Methodology and Industries

### Scope

- Implement the approved four methodology stages: understand, plan, create, and grow.
- Add the direction-aware process connector and restrained motion.
- Implement the responsive industries presentation.
- Keep industries data-driven and avoid inventing sector claims.

### Deliverables

- Premium methodology section.
- Industries section with typed data input and safe empty behavior.

### Acceptance

- Methodology copy exists in approved Arabic and English forms.
- Industry records are sourced or explicitly approved before publication.

## Phase 7 — Testimonials, Main CTA, and Footer

### Scope

- Load approved testimonial translations and build the single-focus slider.
- Implement the approved final CTA treatment.
- Build the footer using verified site settings and published routes.
- Include only configured contact, social, newsletter, and legal information.

### Deliverables

- Accessible testimonial slider with arrows and dots.
- Responsive main CTA.
- Localized footer.

### Acceptance

- Testimonials have approval and consent evidence in the existing data model.
- No contact or social value is invented.
- Newsletter controls remain non-submitting until a real subscription flow is approved.

## Phase 8 — Dashboard content management

### Scope

- Define missing management requirements for Hero slides, Home Page visibility, ordering, statistics, and industries.
- Reuse existing Media, Client, Service, Project, Testimonial, and SiteSetting models where appropriate.
- Prepare an ADR and schema proposal for any genuinely missing structure.
- Implement server authorization, validation, audit behavior, and dashboard UI only after approval.

### Deliverables

- Approved data model and permission plan.
- Reviewed Prisma migration when required.
- Authorized dashboard management flows.

### Acceptance

- Schema changes have explicit approval, backup, rollout, and rollback plans.
- Runtime and migration database credentials remain separated.
- Every mutation enforces server-side permission checks and validation.

## Phase 9 — Integration and quality review

### Scope

- Review the complete page at desktop, laptop, tablet, and mobile widths.
- Verify Arabic/English, RTL/LTR, light/dark, keyboard, touch, and reduced motion.
- Review server-rendered HTML, metadata, canonical and alternate URLs, status codes, robots, and sitemap eligibility.
- Measure image behavior, layout stability, client JavaScript, and interaction performance.

### Required checks

```bash
npm run db:generate
npm run db:validate
npm run typecheck
npm run lint
npm run test
npm run build
```

### Acceptance

- All required checks pass.
- No unapproved content or secret appears in source, output, logs, or client bundles.
- The page matches the approved visual hierarchy without becoming a generic template.
- Known limitations and intentionally hidden sections are documented.

## Phase 10 — Review and publication

### Scope

- Deploy the reviewed commit through GitHub Actions.
- Verify the production health endpoint and both locale pages.
- Review the production page in all required locale/theme combinations.
- Keep noindex in place until content, legal, SEO, and launch approval are complete.

### Acceptance

- GitHub checks and deployment pass for the exact commit.
- PM2 runs the intended release and the public health check returns success.
- Publication/indexing is enabled only through a separate explicit launch decision.

## Progress tracking

| Phase | Status | Blocking input |
| --- | --- | --- |
| 0 — Inputs and asset inventory | In progress | Logos received; awaiting font files or font-source approval and approved business content |
| 1 — Visual foundation | In progress | Local font files remain unavailable |
| 2 — Header and global controls | In progress | Implemented; final visual/accessibility review remains |
| 3 — Hero Slider | In progress | Implemented with one approved Arabic slide; approved media and English copy remain |
| 4 — Clients and Services | In progress | Database-backed components implemented; final interaction and visual review remains |
| 5 — Statistics and Selected Work | In progress | Database-backed components implemented; no published eligible projects or approved project media currently exist |
| 6 — Methodology and Industries | Not started | Approved translations and industries source |
| 7 — Testimonials, CTA, and Footer | Not started | Approved testimonials and verified site settings |
| 8 — Dashboard content management | Deferred pending approval | Data model, permissions, migration, and recovery decisions |
| 9 — Integration and quality review | Not started | Phases 1–7 |
| 10 — Review and publication | Not started | Quality, launch and content approval |

Update this table as phases are completed. Do not mark a phase complete until its acceptance criteria have been verified.

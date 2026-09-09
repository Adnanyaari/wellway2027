# WELL WAY — Home Page Implementation

## Mission

Implement the approved WELL WAY Home Page.

Before writing code, read:

- `docs/design/home/HOME-DESIGN-SPEC.md`
- `docs/design/reference/wellway-home-dark.png`

The visual reference is approved.

Do not redesign the page from scratch.

Your task is to reproduce the approved visual direction using clean, maintainable code and the project's existing architecture.

---

# 1. First Step — Inspect the Existing Project

Before creating or modifying code, inspect:

- Project framework
- Current frontend structure
- Existing backend/API structure
- Database schema
- Existing models/entities
- Existing routes/endpoints
- Existing CMS/admin modules
- Existing theme system
- Existing localization/i18n system
- Existing media/file handling
- Existing reusable components
- Existing animation/carousel libraries

Do not assume React, Next.js, Laravel, or any other framework until you inspect the project.

Do not create duplicate solutions if equivalent structures already exist.

---

# 2. Report Before Implementation

Before making major implementation changes, report briefly:

1. Which framework/architecture the project currently uses
2. Which existing data sources can be reused
3. Which Home Page sections already have backend/database support
4. Which required content sources are missing
5. Which files/components you intend to create or modify

Do not create database migrations for missing content structures without approval.

---

# 3. Dynamic Content / Database Integration

The Home Page must NOT hard-code business content that already exists or should exist in the database.

The design reference defines:

- Layout
- Visual hierarchy
- Typography
- Spacing
- Gradients
- Card styles
- Slider behavior
- Animations
- Interactions

The backend/database defines the actual content.

---

# 4. Hero Slides

Inspect whether the project already has any of the following:

- Banners
- Sliders
- Hero sections
- CMS blocks
- Homepage sections
- Marketing banners

If an appropriate existing data source exists, reuse it.

Preferred Hero slide data may include:

- id
- title_ar
- title_en
- subtitle_ar
- subtitle_en
- image
- mobile_image
- primary_cta_label_ar
- primary_cta_label_en
- primary_cta_url
- secondary_cta_label_ar
- secondary_cta_label_en
- secondary_cta_url
- sort_order
- is_active
- show_on_home

Do not create a new `home_slides` table if an equivalent structure already exists.

If no suitable source exists, report the missing structure and recommend the minimum fields required.

Do not create a migration without approval.

---

# 5. Services

Do not hard-code the services list inside the frontend.

Inspect the existing service model/table/API and reuse it.

Preferred Home Page logic:

- Active services only
- Home-visible services only if such a field exists
- Ordered using the existing sort/order mechanism

Potential fields:

- id
- title_ar
- title_en
- slug
- short_description_ar
- short_description_en
- icon
- image
- sort_order
- is_active
- show_on_home

Do not assume these exact field names.

Map the existing schema to the component.

The Services Stacked Carousel must render dynamically from the returned data.

Do not assume a fixed number of services.

---

# 6. Clients / Companies

The client/company logo strip must be dynamic.

Inspect existing:

- Clients
- Companies
- Brands
- Partners
- Customers
- Portfolio clients

Reuse the most appropriate existing data source.

Potential data:

- id
- name
- logo
- website_url
- sort_order
- is_active
- show_on_home

Do not hard-code company names or logos if a suitable backend source exists.

If no source exists, report the missing structure before proposing a migration.

---

# 7. Portfolio / Selected Work

Selected Work must come from the existing projects/portfolio/case-studies data source.

Preferred behavior:

- Active/approved projects only
- Featured/Home-visible projects only if supported
- Ordered by existing sort logic

Potential data:

- id
- title
- slug
- client
- cover_image
- summary
- services
- category
- is_featured
- is_active
- sort_order

Again, do not invent duplicate fields if the existing structure differs.

Map the existing data to the UI.

---

# 8. Testimonials

Inspect whether a testimonials/reviews/client-feedback data source already exists.

If it exists, render it dynamically.

Potential data:

- client_name
- company_name
- quote
- image
- rating
- sort_order
- is_active
- show_on_home

If it does not exist, build only the frontend component shell if useful, and report the missing backend requirement.

Do not invent testimonials.

---

# 9. Statistics

Do not invent statistics.

Never add fake numbers such as:

- +200 clients
- +50 projects
- +15 sectors

unless these values already exist in the project or are explicitly supplied.

If statistics are managed in the database/settings, load them dynamically.

If no source exists:

- create the UI in a data-driven way
- leave it connected to a clearly defined data interface
- report the missing source
- do not fabricate numbers

---

# 10. Industries

Inspect whether the project has:

- industries
- sectors
- categories
- business types

If a suitable source exists, reuse it.

Otherwise report what is missing before proposing a new backend structure.

---

# 11. Footer / Contact / Global Settings

Do not hard-code contact information if the project already has global settings or company settings.

Reuse existing sources for:

- Phone
- Email
- Address
- Social links
- Company description
- Newsletter settings
- Legal links

---

# 12. Language / Localization

The Header must visibly include language switching.

Required UI:

- `AR / EN` or equivalent
- Clear active state

Before implementing localization logic:

Inspect whether the project already uses:

- i18n
- locale routes
- translation files
- localized database columns
- CMS translations

Reuse the existing localization approach.

Do not create a second localization system.

Arabic:
- RTL

English:
- LTR

---

# 13. Dark / Light Theme

The Header must include a visible theme switcher.

Default:
- Dark

Required:

- Moon/Sun icon
- Smooth 300–500ms transition
- Shared theme tokens
- Persistent preference if the project architecture supports it cleanly

Before implementing, inspect whether a theme provider/system already exists.

Reuse it if available.

Do not introduce a duplicate theme implementation.

---

# 14. Hero Interaction

The Hero must be a true interactive slider.

Required:

- Autoplay every 6–8 seconds
- Previous / Next arrows
- Smooth 700–1200ms transition
- Mouse-wheel navigation
- Touch/swipe on mobile/tablet
- Keyboard support while focused

Mouse wheel:

- Down → next slide
- Up → previous slide

Use throttle/debounce.

Recommended interaction lock:
- 700–1000ms

Do not trap normal page scrolling.

At the first/last logical boundary, continued wheel input must allow the page to scroll normally.

---

# 15. Clients Interaction

Clients/Companies strip:

- Slow horizontal animated movement
- Approx. 20–35 second full cycle
- Pause on hover
- Touch-friendly on mobile
- Dynamic content

---

# 16. Services Stacked Carousel

This is a core requirement.

Do NOT implement the services as a standard grid.

Use overlapping/stacked cards.

Active card:

- Larger emphasis
- Full opacity
- Highest z-index
- Purple glow/border

Adjacent cards:

- Reduced scale
- Reduced opacity
- Depth/perspective
- Visually layered

Use transforms, not width/height animation.

Required interaction:

- Autoplay every 4–6 seconds
- Previous/Next arrows
- Mouse wheel
- Hover
- Touch/swipe
- Keyboard navigation

Suggested transition:
- 600–900ms
- `cubic-bezier(0.22, 1, 0.36, 1)`

Wheel behavior:

- Down → next service
- Up → previous service
- one transition per wheel gesture
- no scroll trapping at the carousel boundaries

Hover on non-active card:

- subtle lift
- slight scale
- border/glow emphasis
- CTA/arrow reveal if appropriate

---

# 17. Arrow Interaction

Previous / Next controls must be minimal and premium.

On hover:

- Background/border shifts toward brand purple
- Icon translates slightly in the direction of travel
- Subtle glow
- About 250ms transition

Respect RTL direction.

---

# 18. Motion

Motion must remain:

- Smooth
- Calm
- Premium
- Cinematic
- Controlled

Prefer:

- transform
- opacity

Avoid:

- excessive blur
- bouncing
- aggressive spring
- layout-shifting animation

Implement `prefers-reduced-motion`.

If the user prefers reduced motion:

- disable autoplay where appropriate
- reduce or remove large transitions

---

# 19. Remaining Sections

Implement the remaining sections according to:

`docs/design/home/HOME-DESIGN-SPEC.md`

These include:

- Statistics
- Selected Work
- WELL WAY Methodology
- Industries
- Testimonials
- Main CTA
- Footer

Do not invent backend content.

---

# 20. Component Architecture

Do not place the entire Home Page in a single file.

Follow the project’s existing structure.

If the project architecture permits, separate the Home Page into components such as:

- Header
- Hero
- Clients
- Services
- Statistics
- Work
- Methodology
- Industries
- Testimonials
- FinalCTA
- Footer

Use smaller subcomponents where useful.

Do not force this exact folder structure if the project already has a better established convention.

---

# 21. Performance

Required:

- Lazy-load non-critical imagery
- Use the framework’s image optimization if available
- Prefer WebP/AVIF
- Avoid oversized first-load video
- Transform/opacity animation
- Avoid layout shift
- Avoid unnecessary frontend libraries

If an existing carousel/animation library already exists and fits the requirement, reuse it.

Do not add a new dependency unless justified.

---

# 22. Accessibility

Required:

- ARIA labels on carousel controls
- Keyboard navigation
- Visible focus states
- Logical headings
- Correct contrast
- `prefers-reduced-motion`
- Theme and language controls must be keyboard accessible

---

# 23. Important No-Guessing Rule

Do not guess or fabricate:

- Database tables
- API endpoints
- Field names
- Statistics
- Client names
- Testimonials
- Contact details
- Service records

Inspect the project first.

If a required backend structure does not exist, report:

1. What is missing
2. Why it is needed
3. Minimum recommended fields
4. Whether a migration/API/admin change would be required

Wait for approval before making structural database changes.

---

# 24. Final Visual Rule

The final page must remain visually close to:

`docs/design/home/reference/wellway-home-dark.png`

Match its:

- Visual hierarchy
- Section rhythm
- Premium dark feeling
- White/light contrast sections
- Purple gradients
- Card depth
- Large typography
- Imagery balance
- Spacing
- Motion quality

Do not turn it into a generic SaaS template.

This is a premium Saudi marketing agency website.

---

# 25. Implementation Priority

Implement in this order:

1. Inspect current project/database/API architecture
2. Report reusable/missing content sources
3. Header + Language + Dark/Light
4. Hero Slider
5. Clients / Companies Strip
6. Services Stacked Carousel
7. Statistics + Selected Work
8. Methodology + Industries
9. Testimonials + CTA + Footer
10. Responsive
11. Performance/accessibility review

The three interactions that must not be simplified are:

1. Hero:
   - autoplay
   - arrows
   - wheel
   - swipe
   - smooth transition

2. Services:
   - stacked overlapping cards
   - autoplay
   - arrows
   - hover
   - mouse wheel
   - swipe

3. Header:
   - visible Language Switcher
   - visible Dark / Light Switcher

# WELL WAY — Home Page Design Specification

## Status
Approved visual direction.

## Reference
Use the visual reference below as the primary design reference:

`docs/design/home/reference/wellway-home-dark.png`

## Purpose
This document defines the approved visual direction and implementation rules for the WELL WAY Home Page.

Codex must not redesign the page from scratch.  
The reference image defines the visual hierarchy, spacing, proportions, section order, premium dark look, gradients, card treatment, imagery placement, and overall visual feeling.

The actual business content must come from the project's backend/database whenever an existing data source is available.

---

# 1. Brand Identity

Official WELL WAY colors:

- `#4E1B8B`
- `#461480`
- `#310963`
- `#0F083A`
- `#7834C6`
- `#F2F2F2`
- White

Typography:

- Arabic: `Changa`
- English: `Rubik`

Default direction:

- Arabic: RTL
- English: LTR

Brand personality:

- Strong
- Contemporary
- Elegant
- Premium
- Unconventional
- Minimal
- High-end

The logo must be used without changing its proportions, composition, direction, or approved visual treatment.

---

# 2. Home Page Section Order

The approved section order is:

1. Header
2. Hero Slider
3. Clients / Companies Strip
4. Services Interactive Stacked Slider
5. Statistics
6. Selected Work / Portfolio
7. WELL WAY Methodology
8. Industries
9. Testimonials
10. Main CTA
11. Footer

Do not change this order without approval.

---

# 3. Header

The Header must include:

- Main navigation
- "ابدأ مشروعك" CTA
- Language switcher
- Dark / Light theme switcher

Owner-approved behavior (2026-09-09): the Header remains fixed at the top of the viewport while the page scrolls. Its dark translucent surface and readable controls remain consistent over both light and dark sections without adding space above the Hero.
- Search icon if required by the final UI

Arabic navigation:

- الرئيسية
- خدماتنا
- أعمالنا
- من نحن
- المدونة
- تواصل معنا

## Language Switcher

The language control must be clearly visible.

Preferred forms:

- `AR / EN`
- Globe icon + active language

The UI must be ready to support real Arabic/English switching.

## Theme Switcher

The Header must include a visible Dark / Light control.

Preferred icon:

- Moon / Sun

Default:
- Dark Mode

Dark and Light modes must use shared theme tokens, not duplicated hard-coded colors.

Owner update (2026-09-09): the Home Hero, overlaid header, success-partners strip, and footer retain their dark appearance in both modes. Sections between the partners strip and footer, including service cards and achievements, follow the selected light/dark palette. The footer uses the logo intended for its fixed dark surface.

## Approved Section-Heading Scale

Owner-approved on 2026-09-09 after visual review:

- Small section labels used above a primary heading: `clamp(1rem, 1.3vw, 1.2rem)`, with `letter-spacing: .06em`.
- The success-partners strip heading: `clamp(1.05rem, 1.35vw, 1.25rem)`, with `line-height: 1.5`.
- The standalone statistics heading (`أرقامنا` / its English equivalent): `clamp(1.4rem, 2vw, 1.9rem)`, with `line-height: 1.35` and `letter-spacing: .02em`.
- Supporting status text beneath a standalone section heading, such as the preview-data label: `clamp(.7rem, .8vw, .8rem)`, with `line-height: 1.5`.
- These sizes apply to section labels only. They do not alter the Hero title or its eyebrow.

---

# 4. Hero Slider

The Hero must visually match the approved reference.

Required visual direction:

- Deep dark-purple background
- Purple light and glow
- Large premium visual
- Saudi/local market visual direction
- Geometric shapes inspired by the WELL WAY "WW" identity
- Strong Arabic typography
- Cinematic but controlled motion

The Hero is a real slider, not a static banner.

Recommended:
- 3 slides
- Autoplay every 6–8 seconds
- Smooth transition 700–1200ms
- Opacity + transform-based transition
- No aggressive or bouncing motion

Required controls:

- Previous arrow
- Next arrow
- Mouse-wheel navigation
- Touch/swipe navigation on mobile/tablet
- Keyboard support when focused

## Mouse Wheel Rules

When the pointer is inside the Hero Slider:

- Wheel down → next slide
- Wheel up → previous slide

Use debounce/throttle to prevent multiple slide jumps from one wheel gesture.

Recommended lock:
- 700–1000ms

Do not trap normal page scrolling.

When the user reaches the first or last slide and continues scrolling, normal page scrolling must remain possible.

---

# 5. Clients / Companies Strip

This section comes immediately after the Hero and should feel visually connected to it.

The section must support:

- Dynamic logos from backend/database
- Slow horizontal movement / marquee
- Pause on hover
- Touch scroll on mobile
- Light and Dark theme support

Recommended marquee duration:
- 20–35 seconds per full cycle

Do not hard-code client/company names or logos if a backend source exists.

---

# 6. Services Section

The services section must visually follow the approved reference.

It must NOT be a standard static card grid.

The approved interaction is a premium stacked / overlapping carousel.

## Stacked Card Behaviour

Active card:

- Largest visual emphasis
- Highest z-index
- Full opacity
- Purple glow/border treatment

Adjacent cards:

- Slightly smaller
- Lower opacity
- Slight perspective/depth
- Visually layered behind or beside the active card

Use `transform` and `opacity` for smoothness.

Suggested states:

- Active: `scale(1)`
- Next: `scale(.94)`
- Next + 2: `scale(.88)`

The component must support any number of services returned from the backend.

## Services Carousel Controls

Required:

- Autoplay every 4–6 seconds
- Previous / Next arrows
- Mouse-wheel navigation
- Hover interaction
- Touch/swipe support
- Keyboard navigation

Hover on a non-active card:

- Slight lift
- Subtle scale
- Border/glow emphasis
- CTA/arrow reveal if appropriate

Suggested hover:
- `translateY(-6px)`
- `scale(1.01)`

Transition:
- 600–900ms
- Smooth easing such as `cubic-bezier(0.22, 1, 0.36, 1)`

Do not trap normal page scrolling at the start/end of the services carousel.

---

# 7. Statistics

Statistics must support:

- Dynamic data when a source exists
- Count-up animation on first viewport entry only

Do not invent statistics.

If no statistics data source exists, create only the component structure and report what backend structure is missing.

---

# 8. Selected Work / Portfolio

Selected projects must come from the project/portfolio source.

The visual treatment should include:

- Large project cards
- Strong imagery
- Client/project name
- Services/categories
- CTA
- Subtle image zoom on hover

Suggested image hover:
- `scale(1.03)`
- 500ms transition

Only featured/approved work should appear on the Home Page.

---

# 9. WELL WAY Methodology

Dark premium section.

Core concept:

**التسويق ليس خدمات منفصلة. إنه طريق واحد.**

Approved process:

- نفهم
- نخطط
- نصنع
- ننمي

Each stage can contain:

- Icon
- Title
- Short description

Use a subtle visual connector or animated line between stages.

---

# 10. Industries

Industries must be presented in a clean horizontal or responsive row/grid treatment.

Hover can highlight:

- Icon
- Text
- Purple accent

If an industries data source exists, use it dynamically.

---

# 11. Testimonials

Use a premium single-focus testimonial slider rather than many small cards.

Required:

- Autoplay
- Arrows
- Dots
- Dynamic data if a testimonials source exists

---

# 12. Main CTA

Premium dark-gradient CTA.

Approved direction:

**عندك هدف؟  
نعرف الطريق إليه.**

Primary CTA:

**ابدأ مشروعك الآن**

---

# 13. Footer

The Footer should include:

- About
- Quick Links
- Services
- Contact
- Social Media
- Newsletter
- Legal links

All dynamic/contact content should reuse existing project settings/data sources where available.

---

# 14. Dark / Light Theme Architecture

Use shared design tokens.

Recommended variables:

- `--bg-primary`
- `--bg-secondary`
- `--surface`
- `--text-primary`
- `--text-secondary`
- `--brand-primary`
- `--brand-accent`
- `--border-color`
- `--glow`

Default:
- Dark

Dark example:

- Main background: `#0F083A`
- Secondary surfaces: dark violet variants
- White primary typography
- Purple glow accents

Light example:

- Background: `#F7F7F9` or `#F2F2F2`
- Cards: white
- Titles: `#310963`
- Accent: `#7834C6`
- Borders: subtle violet transparency

Theme transition:
- 300–500ms

Do not hard-code duplicate theme colors inside individual components.

---

# 15. Motion Principles

All motion must feel:

- Smooth
- Premium
- Calm
- Cinematic
- Controlled

Prefer:

- `transform`
- `opacity`

Avoid:

- Continuous heavy blur
- Layout-shifting animation
- Bounce-heavy motion
- Unnecessary animation libraries

Scroll reveal:

- opacity 0 → 1
- translateY 20px → 0
- duration 600–900ms
- stagger 50–100ms

Support `prefers-reduced-motion`.

---

# 16. Responsive Behaviour

Required breakpoints:

- Desktop: 1440+
- Laptop: 1024–1439
- Tablet: 768–1023
- Mobile: <768

Mobile must be deliberately redesigned for the viewport, not simply shrunk from desktop.

Required mobile behaviour:

- Hero content reorganized vertically
- Mobile drawer navigation
- Language/theme controls remain accessible
- Services become a touch-friendly stacked/swipe carousel
- Hero supports swipe
- Horizontal logo strip remains usable

---

# 17. Performance

Required:

- Lazy loading for non-critical images
- WebP / AVIF where appropriate
- `next/image` if the project is Next.js
- Avoid oversized initial videos
- Transform/opacity-based animation
- Avoid layout shift
- Keep Lighthouse performance in mind

---

# 18. Accessibility

Required:

- `prefers-reduced-motion`
- ARIA labels for controls
- Keyboard carousel control
- Correct focus handling
- Logical heading hierarchy
- Adequate contrast in both themes

---

# 19. Dynamic Content Rule

The visual reference defines the UI and interaction.

It does NOT define which business records are hard-coded into the frontend.

Business data must come from the existing backend/database whenever possible.

Dynamic sections include, where supported by the current project:

- Hero slides
- Clients / companies
- Services
- Statistics
- Portfolio / selected work
- Industries
- Testimonials
- Footer/contact/settings

Before creating any new backend structure, Codex must inspect the existing schema/models/routes first.

No duplicate entities/tables should be created.

No migration should be created without approval if a required structure is missing.

---

# 20. Implementation Priority

Priority order:

1. Hero Slider
2. Clients / Companies Strip
3. Services Stacked Carousel
4. Dark / Light + Arabic / English controls
5. Remaining sections
6. Responsive refinement
7. Performance and accessibility review

The Home Page must not end up as a generic SaaS template.

It must look and behave like a premium Saudi marketing agency website aligned with the WELL WAY identity.

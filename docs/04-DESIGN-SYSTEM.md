# 04 — Design system

## Foundation

Use a reusable Tailwind-based design system with semantic tokens for color, typography, spacing, radii, elevation, borders, focus, and motion. Centralize tokens; avoid scattered arbitrary values and duplicate components. Brand colors, logos, fonts, and imagery need approved sources. Do not invent brand assets or business copy.

Define reusable buttons, links, inputs, validation messages, dialogs, tables, cards, navigation, breadcrumbs, pagination, media, and status indicators. Each component must document variants and loading, empty, error, success, focus, and disabled states where applicable. Share presentation patterns across the public site and dashboard while respecting their different information needs.

## Language and direction

- Arabic pages use `lang=ar` and RTL; English pages use `lang=en` and LTR at the document root.
- Prefer logical spacing/alignment properties and direction-aware layouts over duplicated styles.
- Mirror directional navigation icons where meaningful, but do not mirror logos or nondirectional imagery.
- Isolate mixed-direction text such as email, URLs, numbers, and identifiers. Check punctuation, truncation, wrapping, table alignment, and input caret behavior.
- Use approved fonts with adequate Arabic and Latin coverage. Allow for translation expansion and Arabic line-height needs.

## Themes and accessibility

- Light and dark themes are mandatory for every component and page state. Support system preference plus a persistent explicit user choice; avoid theme flashes and hydration mismatch.
- Select each client's light or dark logo for the active theme. Verify legibility and safe fallback behavior.
- Target WCAG 2.2 AA accessibility, including keyboard operation, visible focus, labels, semantic landmarks, contrast, error associations, and reduced-motion preferences. Treat this as a testing target, not a claim of certification.
- Never communicate status only by color. Dialogs must manage focus and tables must preserve accessible relationships on small screens.
- Form feedback must be localized, screen-reader accessible, and preserve entered values after recoverable errors.

## Acceptance

Check the four locale/theme combinations (Arabic/light, Arabic/dark, English/light, English/dark), RTL/LTR, narrow and wide viewports, keyboard navigation, long text, and loading/error states. Public imagery must have appropriate dimensions and responsive loading to avoid unnecessary layout shift and transfer size.

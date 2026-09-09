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

- Owner direction (2026-09-09): keep the Home Hero, its overlaid header, the success-partners strip, and the footer visually dark in both themes. Between the partners strip and footer, sections such as services, cards, and achievements must use the selected theme's backgrounds, text, and borders. The footer uses the logo intended for its fixed dark surface.
- Owner direction (2026-09-09): the public Header is fixed to the viewport top, uses a dark translucent backdrop for contrast across both themes, and continues to overlay the Hero without changing its layout height.
- Owner direction (2026-09-09): authentication uses a full-page split layout inspired by the approved reference, with the active sign-in form and a branded purple visual panel. It must not appear as a modal. Google and Apple options may be shown only as clearly disabled controls until their authentication logic is separately approved and implemented.

- Light and dark themes are mandatory for every component and page state. Support system preference plus a persistent explicit user choice; avoid theme flashes and hydration mismatch.
- Select each client's light or dark logo for the active theme. Verify legibility and safe fallback behavior.
- Target WCAG 2.2 AA accessibility, including keyboard operation, visible focus, labels, semantic landmarks, contrast, error associations, and reduced-motion preferences. Treat this as a testing target, not a claim of certification.
- Never communicate status only by color. Dialogs must manage focus and tables must preserve accessible relationships on small screens.
- Form feedback must be localized, screen-reader accessible, and preserve entered values after recoverable errors.

## Acceptance

Check the four locale/theme combinations (Arabic/light, Arabic/dark, English/light, English/dark), RTL/LTR, narrow and wide viewports, keyboard navigation, long text, and loading/error states. Public imagery must have appropriate dimensions and responsive loading to avoid unnecessary layout shift and transfer size.

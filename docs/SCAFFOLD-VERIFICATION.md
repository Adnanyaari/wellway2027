# Initial scaffold verification

Verified locally on 2026-09-06 using Node.js 22.17.1 on Windows. This report is scoped to the scaffold, not production readiness.

| Check | Result |
| --- | --- |
| Stable dependency inspection before install | Registry versions, engines and peers checked; no direct prerelease dependencies |
| npm install | Passed using local npm 11.19.1 after the installed npm 11.4.0 resolver crashed; no global npm change |
| Dependency audit | Zero reported vulnerabilities after reviewed transitive overrides |
| Prisma generate | Passed with Prisma 7.10.0; generated client ignored by Git |
| Prisma validate | Passed; schema targets MySQL |
| Lint | Passed with zero warnings allowed |
| Strict typecheck | Passed, including generated Next.js route types |
| Tests | 16 tests passed across locale/SEO/configuration, permission policy, session/account status, revocation and route guards |
| Production build | Passed with Next.js 16.3.4; no database credentials or live connection required |
| Production HTTP smoke checks | 13 routes passed: root redirect; ar/en shells; invalid locale 404; three protected dashboard entries; two unavailable login shells; health; absent auth mutation route; robots; sitemap |

Rendered Arabic/English HTML was checked for root language/direction, canonical and alternate links, all theme choices, matching CSP script nonces, and noindex headers. Production CSP disallows eval. Sitemap contains no unpublished URLs. Health returns only a minimal liveness response.

Dependency overrides pin `deepmerge-ts@8.0.2`, `mariadb@3.5.4`, and `mysql2@3.24.3` to address audit findings in the upstream Prisma dependency graph. Prisma generation/configuration, typechecking, tests and build passed after those overrides. Revisit overrides with upstream releases and perform live MySQL integration before database activation. ESLint 9 is retained for the Next.js lint plugin peer compatibility; its upstream deprecation notice is a tooling maintenance item, not a suppressed audit result.

## Deliberate limits

- No database provisioned, connected, migrated or seeded. No live DB constraints or authentic issued-session integration were tested. Schema relations and mock-based authorization tests do not replace those checks.
- No sign-in, registration, recovery, MFA, account bootstrap, uploads, CRM, lead writes/email, business publishing or deployment implemented.
- Browser setup failed inside the available browser integration before a page could be opened. Interactive theme persistence/system-theme response, keyboard behavior and visual layout remain unverified in a real browser. Server-rendered locale/theme markup and HTTP behavior were verified separately; do not claim visual QA passed.
- No business content, clients, statistics, reviews, testimonials, portfolio data, branding or migration mappings were invented.

All further feature work and production activation await approval.

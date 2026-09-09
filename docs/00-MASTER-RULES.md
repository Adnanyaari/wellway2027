# 00 — Master rules

> Phase update (2026-09-06): The owner has explicitly authorized the initial scaffold, dependency installation, schema generation, and local verification. Earlier documentation-only restrictions below describe the previous phase and no longer block this scope. Full website/dashboard features, fake content, applied database migrations, and production deployment remain unauthorized. Read docs/adr/0001-initial-scaffold.md (relative to repository root) for the current scaffold decisions. Routine reversible scaffold choices are covered by this authorization; production architecture acceptance remains a later gate.

## Authority and scope

These rules govern the Well Way 2027 rebuild. Read [AGENTS.md](../AGENTS.md) first. Explicit owner instructions govern project scope; this master document defines baseline requirements, domain documents define details, and accepted ADRs record decisions. Flag conflicts before changing affected behavior. Do not silently override a requirement using an ADR.

Current authorization covers the initial scaffold, dependency installation, schema/client generation and local checks. Full business features, fake content, applied database migrations and deployment remain outside scope. See [ADR 0001](adr/0001-initial-scaffold.md).

## Required product and stack

- Next.js App Router, React, TypeScript strict mode, Tailwind CSS, MySQL, and Prisma ORM.
- An Arabic and English public marketing site plus an authenticated administration dashboard.
- RTL and LTR layouts and light and dark themes across public, authentication, and dashboard experiences.
- Management of clients, services, projects/portfolio, leads, blog, FAQs, testimonials, users, and permissions; an analytics dashboard.
- Authentication and permission-based RBAC, initially grouped into ADMIN, SEO, ADS, and CUSTOMER_SERVICE roles.
- Unified contact/lead forms, persistent MySQL leads, and reliable email notification after successful save.
- Strong technical SEO, locale routes, canonical and alternate links, sitemaps, robots, social metadata, structured data, breadcrumbs, and verified legacy redirects.
- VS Code and GitHub workflow; local MySQL may use XAMPP only as a database service. Next.js runs using Node.js.
- Approved production code deploys through GitHub Actions to Hostinger VPS. PM2 runs Next.js; CloudPanel/Nginx terminates SSL and reverse proxies requests.

## Mandatory engineering behavior

1. Read repository and domain rules before edits.
2. Use verified business content only; do not manufacture proof, numbers, clients, reviews, or testimonials.
3. Enforce authorization and validation on the server. Deny by default, with resource scope checks.
4. Never expose credentials; application secrets belong in environment variables provided through protected secret storage.
5. Treat locale, direction, theme, accessibility, and public SEO as acceptance criteria rather than optional polish.
6. Prefer Server Components and reusable architecture. Keep database operations and access policy in server-only layers.
7. Require an accepted ADR for architecture changes, including significant dependencies, infrastructure, and cross-domain data contracts.
8. Use reviewed Prisma migrations and least-privilege database access. Do not perform destructive data changes without approval and a recovery plan.
9. Validate coding work with lint, strict typecheck, and relevant tests; never claim unrun checks passed.
10. Preserve unrelated changes, update documentation, and disclose blockers before declaring work complete.
11. Every business-content field or owner-managed operational setting shown by the site must have one authoritative database source and a permission-gated dashboard control. Implement each dynamic feature as one complete path: database contract, dashboard management, then site rendering. Keep layout structure, design tokens, technical constants, secrets, and deployment configuration in their appropriate code or environment boundaries rather than treating them as editable business content.

## Definition of done after build approval

A task meets documented requirements, handles errors and authorization failures, preserves translation/theme/direction contracts, and passes relevant checks. Public route work includes SEO review. Schema changes include migration and recovery review. Security-sensitive work includes negative authorization/validation checks. Deployment additionally requires the release gates in [10](10-DEVOPS-DEPLOYMENT.md).

Missing source content or an unresolved provider choice must be reported; it is not permission to invent data or choose an undocumented architecture.

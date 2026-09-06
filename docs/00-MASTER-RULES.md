# 00 — Master rules

## Authority and scope

These rules govern the Well Way 2027 rebuild. Read [AGENTS.md](../AGENTS.md) first. Explicit owner instructions govern project scope; this master document defines baseline requirements, domain documents define details, and accepted ADRs record decisions. Flag conflicts before changing affected behavior. Do not silently override a requirement using an ADR.

Current authorization is documentation only: no installation, scaffolding, application code, database modification, or deployment. Future implementation requires explicit approval.

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

## Definition of done after build approval

A task meets documented requirements, handles errors and authorization failures, preserves translation/theme/direction contracts, and passes relevant checks. Public route work includes SEO review. Schema changes include migration and recovery review. Security-sensitive work includes negative authorization/validation checks. Deployment additionally requires the release gates in [10](10-DEVOPS-DEPLOYMENT.md).

Missing source content or an unresolved provider choice must be reported; it is not permission to invent data or choose an undocumented architecture.

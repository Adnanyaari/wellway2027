# Architecture decision records

> Phase update (2026-09-06): The owner has explicitly authorized the initial scaffold, dependency installation, schema generation, and local verification. Earlier documentation-only restrictions below describe the previous phase and no longer block this scope. Full website/dashboard features, fake content, applied database migrations, and production deployment remain unauthorized. Read docs/adr/0001-initial-scaffold.md (relative to repository root) for the current scaffold decisions. Routine reversible scaffold choices are covered by this authorization; production architecture acceptance remains a later gate.

Architecture changes require an ADR and explicit owner/maintainer acceptance before implementation. An ADR cannot silently replace a mandatory project requirement; obtain explicit approval to change that requirement and update the governing documents.

## Process

1. Read master rules and affected domain documents.
2. Create `NNNN-short-decision-title.md` using the next unused sequential number.
3. Record status as Proposed, explain context and alternatives, and request review before dependent implementation.
4. Record acceptance authority/date when accepted; update relevant domain documents and this index.
5. Preserve historical decisions. Supersede them with a linked new ADR rather than rewriting accepted history to conceal a change.

Allowed statuses: Proposed, Accepted, Rejected, Superseded. An agent may draft a proposal but must not self-declare owner acceptance.

## Required ADR sections

- Title, identifier, status, date, decision owner/reviewer, and acceptance evidence.
- Context, constraints, and the concrete decision.
- Alternatives considered and reasons for selection/rejection.
- Consequences and tradeoffs, including security, data integrity, permissions, Arabic/English, RTL/LTR, light/dark, SEO, and operations where relevant.
- Migration/rollout and rollback implications.
- Validation criteria, affected documents, and related/superseded ADRs.

## Decision index

The user-specified stack is the baseline requirement in [master rules](../00-MASTER-RULES.md).

| ADR | Status |
| --- | --- |
| [0001 — Initial scaffold](0001-initial-scaffold.md) | Technical selections proposed for owner review; reversible scaffold implementation directly authorized by the owner, not production acceptance |
| [0002 — GitHub Actions deployment to the CloudPanel VPS](0002-github-actions-vps-deployment.md) | Accepted by the project owner on 2026-09-08 |
| [0003 — Dynamic content control path](0003-dynamic-content-control-path.md) | Accepted by the project owner on 2026-09-09 |
| [0004 — Local media storage](0004-local-media-storage.md) | Accepted by the project owner on 2026-09-09 |

Decisions to record before dependent implementation include authentication/session strategy, exact stack/runtime compatibility, identifier conventions, media storage/upload processing, outbox worker execution, email provider, analytics/consent, redirect execution, and deployment/recovery architecture. Proposals must be based on verified requirements and current compatibility evidence when implementation begins.

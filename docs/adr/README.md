# Architecture decision records

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

No ADRs have been accepted or fabricated during the documentation-only phase. The user-specified stack is the baseline requirement in [master rules](../00-MASTER-RULES.md).

Decisions to record before dependent implementation include authentication/session strategy, exact stack/runtime compatibility, identifier conventions, media storage/upload processing, outbox worker execution, email provider, analytics/consent, redirect execution, and deployment/recovery architecture. Proposals must be based on verified requirements and current compatibility evidence when implementation begins.

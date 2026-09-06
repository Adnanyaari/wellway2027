# Database foundation

`schema.prisma` is the initial MySQL model contract; `client.ts` is the only shared Prisma runtime factory. `generated/` is ignored and recreated with `npm run db:generate`. Import the client only in server-owned domain code.

No migration has been generated/applied and no records have been seeded. Configure an actual compatible MySQL service before migration work. XAMPP Apache does not run this application. Target MySQL 8.4 and utf8mb4; select/review the exact collation with case and Arabic slug tests when creating the initial migration.

Client light/dark logo fields reference media directly; a separate logo table would duplicate those relationships. Projects require a client; join tables support multiple services and ordered gallery media. Translation slugs are unique per locale and content type. Referenced content/history uses restricted deletion; transient auth and membership records use intentional cascade behavior. Use archival in future services.

Application-level publication rules (approved content, complete translations, project service count), lead contact-channel validation, normalized emails, immutable audit history, and JSON setting allowlists must be enforced by future services; schema validation alone does not prove these business rules. Site settings must never hold secrets. Provider sessions/accounts are private security records. No login issuer or auth endpoint exists yet.

See [ADR 0001](../docs/adr/0001-initial-scaffold.md) for decisions, limitations, and activation gates.

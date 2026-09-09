# Database foundation

`schema.prisma` is the initial MySQL model contract; `client.ts` is the only shared Prisma runtime factory. `generated/` is ignored and recreated with `npm run db:generate`. Import the client only in server-owned domain code.

The initial migration exists under `db/migrations/`. The idempotent `db/seed.mjs` command loads only owner-approved foundation data into the selected local database: public brand media, non-secret site settings, services, and clients with available translations. Running the seed against production requires a separate reviewed release action. XAMPP Apache does not run this application.

Client light/dark logo fields reference media directly; a separate logo table would duplicate those relationships. Projects require a client; join tables support multiple services and ordered gallery media. Translation slugs are unique per locale and content type. Referenced content/history uses restricted deletion; transient auth and membership records use intentional cascade behavior. Use archival in future services.

Application-level publication rules (approved content, complete translations, project service count), lead contact-channel validation, normalized emails, immutable audit history, and JSON setting allowlists must be enforced by future services; schema validation alone does not prove these business rules. Site settings must never hold secrets. Provider sessions/accounts are private security records. Credential sign-in is available only for pre-provisioned users; registration and recovery remain disabled.

See [ADR 0001](../docs/adr/0001-initial-scaffold.md) for decisions, limitations, and activation gates.

## Protected administrator bootstrap

`npm run db:bootstrap-admin` is an explicit, repeatable local bootstrap command. It requires
`INITIAL_ADMIN_EMAIL`, `INITIAL_ADMIN_PHONE`, and `INITIAL_ADMIN_PASSWORD` in the process environment.
The password is hashed with Better Auth's scrypt implementation before it reaches MySQL and is never
logged or committed. The resulting owner account remains active, carries the explicit `ADMIN` role and
current permission catalog, and has `mustChangePassword` enabled. A restrictive database foreign key prevents
deletion; server administration policy must also prevent deactivation or removal of the protected flag. The localized authentication flow enforces the first-login password change before dashboard access.

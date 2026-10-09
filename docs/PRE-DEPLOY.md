# Before Deploying

## Must do

1. **Create and commit the first database migration.**
   The migration files were not generated during development (the build sandbox could not download Prisma's migration engine). On your machine:

   ```sh
   cd server
   npx prisma migrate dev --name init
   git add prisma/migrations
   git commit -m "feat(server): add initial database migration"
   ```

   Production uses `npx prisma migrate deploy`, which only applies committed migrations.

2. **Pick hosting for the API and the database.** Any Node host plus a PostgreSQL provider works (for example Render, Railway, Fly.io, Neon or Supabase). Settings for the API service:

   | Setting | Value |
   |---|---|
   | Root directory | `server` |
   | Node version | 22.18 or newer (set `NODE_VERSION` or rely on `engines` in package.json) |
   | Build command | `npm install` (also runs `prisma generate`) |
   | Start command | `npx prisma migrate deploy && npm start` |
   | Health check path | `/api/health` |

3. **Set production environment variables** on the API host:
   - `DATABASE_URL`: from your database provider. Many hosted databases need `?sslmode=require` at the end.
   - `JWT_SECRET`: a new long random value. Do not reuse the development one.
   - `TRUST_PROXY=1`, so rate limiting sees real client IPs behind the host's proxy.
   - `CORS_ORIGIN`: `*` works; or list your web app's URL.
   - `NODE_ENV=production`.

4. **Real email.** Fill `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` and `MAIL_FROM` with an email provider's SMTP details. Without them, codes are only printed in the server log and nobody can verify their account. Use a sender address on a domain the provider has verified, or emails may land in spam.

5. **Point the web app at the deployed API**, then deploy `client/` as a static site:

   ```sh
   cd client
   VITE_API_URL=https://your-api.example.com npm run build   # output: client/dist
   ```

   Because the app uses HashRouter, no rewrite rules are needed on the static host.

6. **Build the desktop app against the deployed API**:

   ```sh
   cd desktop
   VITE_API_URL=https://your-api.example.com npm run dist
   ```

## Not tested yet: needs your eyes

- **Prisma migrations** (see step 1). All API endpoints were tested against PostgreSQL 16 with tables created by hand to match `schema.prisma`; the schema itself passes `prisma validate`.
- **Real Hyprland session.** The desktop app was tested under a virtual X11 display. Still to check on your machine: transparency, the window rules (the rule names changed in Hyprland 0.53), and the window growing upward when the bubble opens. On Wayland, apps cannot set their own position, so YODA may shift when the window grows; the `move` rule sets where it starts.
- **System notifications and the tray** depend on your notification daemon and your bar.
- **AppImage.** It builds and the packaged app starts; not yet launched on a real desktop.

## Known limitations (fine for MVP, worth knowing)

- No automated tests in the repo yet; the API, client build and desktop flows were checked with throwaway scripts during development. Adding `vitest` + `supertest` is a good next ticket.
- No "forgot password" and no account deletion.
- Reminders only arrive while the desktop app is running and logged in. The web app alone does not remind you.
- A task due in less than 3 hours gets no reminders (every scheduled time is already past). Consider adding an "at the deadline" reminder.
- The login token lives in `localStorage`; a cross-site scripting bug could read it. React escapes output by default, and no HTML from users is rendered.
- The rate limiter keeps counts in memory, so they reset on restart and are per server instance.
- Fonts come from Google Fonts; without internet, fallback fonts are used.
- The AppImage is unsigned and has no auto-update.
- Keep `prisma` and `@prisma/client` on the same version. At the time of writing, npm's `latest` tag for the `prisma` CLI pointed to an 8.0 release candidate, so both are pinned to 7.10.0.
- "Yoda" is also a Star Wars character name. Fine for a portfolio; consider another name before a public release. The pet design itself is original.

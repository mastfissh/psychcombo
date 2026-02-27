# Payload CMS Admin Panel

The native Payload CMS admin panel is now working with SQLite!

## Quick Start

1. **Start the dev server:**
   ```bash
   npm run dev --workspace cms
   ```

2. **Access the admin:**
   ```
   http://localhost:3000/admin
   ```

3. **Create your first admin user:**
   - The first time you visit `/admin`, you'll be redirected to create the first user
   - Enter an email and password
   - Click "Create"

## Features

- ✅ Full Payload CMS admin interface
- ✅ User authentication and management
- ✅ Content editing for Psychoactives, Combos, and Risks
- ✅ REST API at `/api/*`
- ✅ GraphQL API at `/graphql`
- ✅ SQLite database (stored in `data.db`)

## Architecture

- **Next.js 16**: App router with server-side rendering
- **Payload CMS 3.77**: Headless CMS framework
- **SQLite**: Lightweight database (via @payloadcms/db-sqlite)

## Database Migrations

If you need to update the database schema:

```bash
# Create a new migration
npm run payload migrate:create my-migration --workspace cms

# Run pending migrations
npm run payload migrate --workspace cms
```

## API Access

The Payload REST API is available at:

- **Psychoactives:** `GET/POST /api/psychoactives`
- **Combos:** `GET/POST /api/combos`
- **Risks:** `GET/POST /api/risks`
- **Users:** `GET/POST /api/users`

Example:
```bash
curl http://localhost:3000/api/psychoactives
```

## Production Deployment

For production:

```bash
# Build
npm run build --workspace cms

# Start
npm run start --workspace cms
```

## Troubleshooting

**Issue:** Admin page is blank
- **Solution:** Check browser console for errors, ensure database migrations have run

**Issue:** "No such table" errors
- **Solution:** Run migrations with `npm run payload migrate --workspace cms`

**Issue:** Can't log in
- **Solution:** Create first user at `/admin/create-first-user`

## Configuration

Admin settings are in `src/payload.config.ts`:

- Collections (Psychoactives, Combos, Risks, Users)
- Database adapter (SQLite)
- Admin routes
- CORS settings

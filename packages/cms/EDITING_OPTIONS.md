# Editing Content - Admin Interface Options

This document explains the options for editing content in the PsychCombo CMS and the current technical limitations.

## Current Status

The CMS uses **Payload CMS 3.77** with a **SQLite database adapter**. While this combination works perfectly for the REST API, there's a known compatibility issue with the admin interface:

### The Challenge

Payload CMS 3.x requires Next.js to render its admin panel. However, there's currently an incompatibility between:
- Next.js 16 Turbopack (default bundler)
- SQLite database adapters  
- Development mode

This causes the admin panel to fail with 500 errors when trying to load.

### Why This Happens

Turbopack (Next.js's new bundler) attempts to parse non-JavaScript files (README.md, LICENSE, binary files) from SQLite dependencies, which causes build failures. This is a known issue in the Payload/Next.js ecosystem that is being actively addressed.

## Solutions & Workarounds

You have several options for editing content:

### Option 1: Use REST API Tools (Recommended for Now)

The Payload REST API is fully functional and provides complete CRUD operations. Use API clients to edit content:

#### Recommended Tools:

**1. Postman (Most Popular)**
- Download: https://www.postman.com/downloads/
- GUI-based, user-friendly
- Great for testing and debugging
- Can save request collections

**2. Insomnia**
- Download: https://insomnia.rest/download
- Similar to Postman
- Clean interface

**3. VS Code REST Client**
- Install extension: "REST Client" by Huachao Mao  
- Edit content directly in VS Code
- Great for developers

**4. curl (Command Line)**
- Built into most systems
- Quick and scriptable
- Good for automation

#### API Endpoints for Editing:

```bash
# Create new psychoactive
POST http://localhost:3000/api/psychoactives
Content-Type: application/json

{
  "title": "New Substance",
  "slug": "new-substance",
  "aka": [{"alias": "Alternative Name"}],
  ...
}

# Update existing psychoactive
PATCH http://localhost:3000/api/psychoactives/:id
Content-Type: application/json

{
  "title": "Updated Title"
}

# Delete psychoactive
DELETE http://localhost:3000/api/psychoactives/:id

# Same for combos and risks
POST/PATCH/DELETE http://localhost:3000/api/combos/:id
POST/PATCH/DELETE http://localhost:3000/api/risks/:id
```

See [API_EDITING_GUIDE.md](./API_EDITING_GUIDE.md) for complete examples.

### Option 2: Switch to PostgreSQL

PostgreSQL works better with Turbopack than SQLite:

1. Install PostgreSQL locally or use a hosted service
2. Update `packages/cms/src/payload.config.ts` to use `@payloadcms/db-postgres`
3. Update connection string in `.env`
4. Run migrations
5. The Next.js admin panel should work

**Pros:**
- Full Payload admin UI with editing
- Better production scalability
- No Turbopack issues

**Cons:**
- Requires PostgreSQL setup
- More complex than SQLite
- Additional infrastructure

### Option 3: Use Payload 2.x

Payload 2.x had a built-in Express-based admin panel that worked with SQLite:

1. Downgrade to `payload@2.x`
2. Update configurations for v2 API
3. Admin panel will work out of the box

**Pros:**
- Simple setup
- Works with SQLite
- Built-in admin UI

**Cons:**
- Older version
- Missing Payload 3 features
- Migration effort required

### Option 4: Custom Admin UI (Future Enhancement)

Build a custom admin interface using React/Vue that calls the REST API:

**Pros:**
- Complete control over UI/UX
- Works with current setup
- Can be tailored to specific needs

**Cons:**
- Development time required
- Need to maintain separately

### Option 5: Wait for Fix

The Payload and Next.js teams are aware of these compatibility issues:

- Turbopack is still evolving
- SQLite adapter improvements ongoing
- Future versions may resolve this

## Current Recommendation

**For immediate editing needs:** Use Option 1 (REST API tools)

**Why:**
- Works today with zero changes
- Full editing capabilities
- No infrastructure changes
- Industry-standard tools
- Good developer experience

The API provides everything needed for content management:
- ✅ Create new entries
- ✅ Read existing data
- ✅ Update fields
- ✅ Delete entries
- ✅ Relationships
- ✅ Validation

## Next Steps

1. **Set up Postman or Insomnia** (5 minutes)
2. **Review API documentation** (see ADMIN_GUIDE.md)
3. **Import example requests** (coming soon)
4. **Start editing content** through the API

## Future Plans

We're tracking these options:

- [ ] Monitor Payload/Next.js compatibility updates
- [ ] Consider PostgreSQL migration for production
- [ ] Evaluate custom admin UI development
- [ ] Create Postman collection for easy editing
- [ ] Build simplified editing forms

## Getting Help

- API Documentation: [ADMIN_GUIDE.md](./ADMIN_GUIDE.md)
- Payload REST API Docs: https://payloadcms.com/docs/rest-api/overview
- Issues with API: Open a GitHub issue
- Questions: Check discussions

## Technical Details

For those interested in the technical specifics:

**Error Pattern:**
```
./node_modules/@esbuild/linux-x64/README.md
Unknown module type
```

**Root Cause:**
- Turbopack tries to parse all imported files
- SQLite adapter dependencies include non-JS files
- Turbopack doesn't handle these gracefully in dev mode

**Workarounds Attempted:**
- ❌ Custom webpack config (conflicts with Turbopack)
- ❌ Disabling Turbopack (not fully supported in Next.js 16)
- ❌ Externalizing dependencies (insufficient for Turbopack)
- ✅ Using Express-only setup (REST API works perfectly)

## Conclusion

While we can't currently use Payload's built-in admin UI due to technical limitations, the REST API provides full editing capabilities through professional API tools. This is a temporary limitation that will likely be resolved in future Payload/Next.js versions.

For most use cases, API-based editing with tools like Postman provides an excellent development experience.

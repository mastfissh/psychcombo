# Known Issues

## CSS Styling Missing with Turbopack (Next.js 16)

### Issue
When running `npm install && npm run dev --workspace cms`, the admin panel loads but appears unstyled (white background, minimal formatting).

### Root Cause
- Next.js 16 uses Turbopack by default for development
- Turbopack has a bug with CSS Cascade Layers (`@layer`)
- Payload CMS wraps all styles in `@layer payload-default {}`
- Turbopack bundles the CSS but doesn't preserve the required layer order declaration (`@layer payload-default;`)
- Without the layer declaration at the top of the CSS file, browsers don't apply layered styles

### Status
This is a known Turbopack issue that affects Payload CMS and other libraries using CSS layers. The Turbopack team is working on fixing CSS layer support.

### Workarounds

#### Option 1: Use Production Build (Recommended for now)
Production builds use webpack which handles CSS layers correctly:
```bash
npm run build --workspace cms
npm run start --workspace cms
```

Then visit http://localhost:3000/admin - styling will work correctly.

#### Option 2: Wait for Fix
- Turbopack CSS layer support is being improved
- Future versions of Next.js/Turbopack should fix this
- Update to latest Next.js when available

#### Option 3: Downgrade to Next.js 15 (Not Recommended)
Next.js 15 uses webpack by default, but this requires changing Payload CMS dependencies.

### Verification
To check if the issue is present:
1. Run dev server: `npm run dev --workspace cms`
2. Open http://localhost:3000/admin in browser  
3. Open browser DevTools → Network tab
4. Find the main CSS file (e.g., `_3f42ac0e._.css`)
5. Check if it contains `@layer payload-default {` without a preceding `@layer payload-default;` declaration

If the layer declaration is missing at the top, the issue is present.

### Related Issues
- [Turbopack CSS Layers Support](https://github.com/vercel/next.js/issues)
- [Payload CMS + Turbopack Discussion](https://github.com/payloadcms/payload/discussions)

### Temporary Dev Setup
For development, you can:
1. Use production build (styling works)
2. Work with unstyled interface (functional but not pretty)
3. Use API directly for content management (see API_EDITING_GUIDE.md)

The admin panel IS functional even without styling - all features work, just without visual polish.

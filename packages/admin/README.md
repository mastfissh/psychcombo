# PsychCombo Admin Panel

PayloadCMS-based admin panel for managing PsychCombo content.

## Tech Stack

- **Next.js 15.4.11** - React framework
- **PayloadCMS 3.x** - Headless CMS
- **SQLite** - Database (via @payloadcms/db-sqlite)
- **TypeScript** - Type safety

## Getting Started

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
PAYLOAD_SECRET=your-secret-key-change-in-production
DATABASE_URL=file:./psychcombo.db
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### Development

```bash
npm run dev
```

Visit http://localhost:3000/admin to access the admin panel.

### Build

```bash
npm run build
```

### Production

```bash
npm run start
```

## Collections

The admin panel manages the following collections:

- **Users** - Admin users with authentication
- **Psychoactives** - Individual psychoactive substances with detailed information
- **Combos** - Combination interactions between substances
- **Media** - Image uploads and media assets

## Testing

```bash
npm test
```

Tests verify:
- Admin panel boots successfully
- Server responds to requests
- CSS loads properly

## Project Structure

```
src/
├── app/
│   ├── (payload)/          # PayloadCMS admin UI routes
│   │   ├── admin/          # Admin panel pages
│   │   │   ├── [[...segments]]/  # Dynamic routing
│   │   │   └── importMap.js      # RSC import map
│   │   ├── layout.tsx      # Payload layout with server functions
│   │   └── custom.css      # Custom admin styles
│   ├── api/                # API routes
│   │   └── [[...slug]]/    # PayloadCMS REST API
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page (redirects to admin)
├── collections/            # PayloadCMS collection definitions
│   ├── Combos.ts
│   ├── Media.ts
│   └── Psychoactives.ts
├── test/                   # Test files
│   └── admin.test.ts
└── payload.config.ts       # PayloadCMS configuration
```

## Features

✅ User authentication
✅ Rich text editor (Lexical)
✅ Image uploads with automatic resizing
✅ SQLite database (portable, no external dependencies)
✅ REST API
✅ TypeScript type generation
✅ Responsive admin UI

## Notes

- First time setup: Visit `/admin` to create your first user
- The SQLite database file (`psychcombo.db`) is created automatically
- Media files are stored in the `media/` directory (excluded from git)
- Generated TypeScript types are in `src/payload-types.ts`

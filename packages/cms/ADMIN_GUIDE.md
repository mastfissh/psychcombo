# Admin Interface Guide

Complete guide to using the Payload CMS admin interface.

## Overview

The PsychCombo CMS provides a full-featured admin panel powered by Payload CMS. This interface allows you to manage all content through an intuitive web interface.

## Accessing the Admin Interface

### Starting the Server

```bash
# From repository root
npm run dev --workspace cms

# Or from packages/cms directory
npm run dev
```

The server starts on port 3000.

### Admin URL

**http://localhost:3000/admin**

### First Time Setup

On your first visit, you'll be prompted to create an admin user:

1. Navigate to http://localhost:3000/admin
2. You'll be redirected to the "Create First User" page
3. Enter your email and password
4. Click "Create"
5. You're now logged in!

## Admin Interface Features

### Dashboard

The main dashboard shows:
- Navigation to all collections
- Quick stats
- Recent activity

### Collections

#### Psychoactives

Manage substance information including:
- Title and slug
- Aliases (aka names)
- Family members
- Duration charts
- Effects (positive, negative, neutral)
- Dosage tables
- Images and captions
- Safety warnings
- Rich text content

**Actions:**
- Create new psychoactive
- Edit existing entries
- Delete entries
- Search and filter
- Bulk operations

#### Combos

Manage drug combination information:
- Title and slug
- Drug 1 and Drug 2 (relationships)
- Rich text content describing the combination
- Reports and research

**Actions:**
- Create new combo
- Edit content
- Link to psychoactives
- Rich text editing
- Version history

#### Risks

Manage risk ratings:
- Drug pairs
- Risk level (SR, GR, MR, LRS, LRD, LR, ND)
- Confidence level (HC, MC, LC, NC)

**Actions:**
- Create risk ratings
- Update confidence levels
- Filter by risk level
- Search by drug names

#### Users

Manage admin users:
- Create new users
- Update permissions
- Manage sessions
- Reset passwords

### Rich Text Editor

The admin includes a powerful rich text editor (Lexical) with:
- Headings (H1-H6)
- Paragraphs
- Bold, italic, underline
- Lists (bulleted and numbered)
- Links
- Code blocks
- Block quotes
- And more

### Search and Filter

Each collection includes:
- Full-text search
- Field-specific filters
- Sorting options
- Pagination

### Version History

Track changes to documents:
- See all previous versions
- Compare changes
- Restore old versions
- View who made changes

## Common Tasks

### Creating a New Psychoactive

1. Click "Psychoactives" in the sidebar
2. Click "Create New"
3. Fill in required fields:
   - Title
   - Slug (URL-friendly identifier)
4. Add optional information:
   - Aliases
   - Duration chart
   - Effects
   - Dosage information
   - Warnings
5. Click "Save"

### Creating a Combo

1. Click "Combos" in the sidebar
2. Click "Create New"
3. Fill in:
   - Title (e.g., "LSD + MDMA")
   - Slug (e.g., "lsd_mdma")
   - Drug 1 (select from dropdown)
   - Drug 2 (select from dropdown)
4. Add rich text content
5. Click "Save"

### Creating a Risk Rating

1. Click "Risks" in the sidebar
2. Click "Create New"
3. Fill in:
   - Drug 1
   - Drug 2
   - Risk level
   - Confidence level
4. Click "Save"

### Editing Content

1. Navigate to the collection
2. Find the entry you want to edit
3. Click on it to open
4. Make changes
5. Click "Save"

### Deleting Content

1. Navigate to the collection
2. Find the entry to delete
3. Click on it to open
4. Scroll to bottom
5. Click "Delete"
6. Confirm deletion

### Bulk Operations

1. Navigate to a collection list
2. Select multiple entries using checkboxes
3. Choose bulk action from dropdown
4. Confirm action

## User Management

### Creating Additional Admin Users

1. Go to Users collection
2. Click "Create New"
3. Enter email and password
4. Assign permissions
5. Click "Save"

### Changing Your Password

1. Click your email in top-right
2. Select "Account"
3. Enter current password
4. Enter new password
5. Click "Save"

### Logging Out

1. Click your email in top-right
2. Select "Logout"

## Best Practices

### Content Organization

1. **Use consistent naming** - Follow existing patterns for titles and slugs
2. **Fill in metadata** - Add as much information as possible
3. **Verify relationships** - Ensure combos link to correct drugs
4. **Add warnings** - Important safety information should be prominent
5. **Use rich text wisely** - Structure content with headings and paragraphs

### Data Quality

1. **Check spelling** - Use spell check before saving
2. **Verify dosages** - Double-check all dosage information
3. **Cite sources** - Add references where applicable
4. **Review before saving** - Preview content
5. **Test links** - Ensure all URLs work

### Database Management

1. **Backup regularly** - Copy `data.db` file periodically
2. **Test in development** - Don't experiment in production
3. **Version control** - Keep database backups in git (with caution)
4. **Monitor size** - SQLite works best under 2GB

## Keyboard Shortcuts

- `Ctrl/Cmd + S` - Save document
- `Ctrl/Cmd + K` - Insert link
- `Esc` - Close modal
- `Alt + T` - Toggle notifications

## Troubleshooting

### Can't Log In

1. Verify email and password
2. Check server is running
3. Clear browser cache
4. Try password reset
5. Check server logs

### Content Not Saving

1. Check for validation errors (shown in red)
2. Ensure required fields are filled
3. Check server logs for errors
4. Verify database is writable
5. Try refreshing the page

### Admin Panel Won't Load

1. Verify server is running on port 3000
2. Check for errors in server logs
3. Try clearing browser cache
4. Check database file exists
5. Restart the server

### Slow Performance

1. Check database size
2. Optimize queries
3. Add database indexes
4. Consider pagination settings
5. Monitor server resources

## Advanced Features

### Database Migrations

When schema changes occur:

```bash
# Create migration
npm run payload migrate:create <name> --workspace cms

# Run migrations
npm run payload migrate --workspace cms
```

### GraphQL API

The admin also enables GraphQL at `/graphql`:

```graphql
query {
  Psychoactives {
    docs {
      title
      slug
      aka {
        alias
      }
    }
  }
}
```

### Webhooks

Configure webhooks to notify external services of changes:

1. Add webhook in payload.config.ts
2. Specify events to trigger on
3. Define endpoint URL
4. Test webhook delivery

## Security

### Best Practices

1. **Strong passwords** - Use unique, complex passwords
2. **Limit users** - Only create necessary admin accounts
3. **Regular audits** - Review user list periodically
4. **HTTPS in production** - Always use SSL
5. **Environment variables** - Keep secrets out of code

### Production Considerations

1. Change `PAYLOAD_SECRET` from default
2. Enable authentication for all routes
3. Set up proper CORS headers
4. Use environment-based configuration
5. Monitor access logs

## Getting Help

- **Payload Documentation**: https://payloadcms.com/docs
- **API Documentation**: [API_EDITING_GUIDE.md](./API_EDITING_GUIDE.md)
- **Admin Documentation**: [PAYLOAD_ADMIN.md](./PAYLOAD_ADMIN.md)
- **GitHub Issues**: Report bugs and ask questions

## Next Steps

1. Create your first admin user
2. Explore the collections
3. Create some test content
4. Try editing and deleting
5. Learn the rich text editor
6. Set up additional users if needed
7. Configure backups

Enjoy managing your PsychCombo content! 🎉

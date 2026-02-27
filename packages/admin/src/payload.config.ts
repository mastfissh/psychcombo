import path from 'path'
import { fileURLToPath } from 'url'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'

import { Psychoactives } from './collections/Psychoactives'
import { Combos } from './collections/Combos'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Validate required environment variables
if (!process.env.PAYLOAD_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('PAYLOAD_SECRET environment variable is required in production')
  }
  console.warn('⚠️  PAYLOAD_SECRET not set. Using development default. DO NOT use in production!')
}

if (!process.env.DATABASE_URL) {
  console.warn('⚠️  DATABASE_URL not set. Using default: file:./psychcombo.db')
}

export default buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    {
      slug: 'users',
      auth: true,
      access: {
        read: () => true,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
    Psychoactives,
    Combos,
    Media,
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-in-production-12345',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./psychcombo.db',
    },
  }),
})

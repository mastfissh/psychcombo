import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import matter from 'gray-matter'

dotenv.config()

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Path to content directories
const WEBSITE_PATH = path.resolve(dirname, '../../website/src/content')
const PSYCHOACTIVES_PATH = path.join(WEBSITE_PATH, 'psychoactives')
const COMBOS_PATH = path.join(WEBSITE_PATH, 'combos')
const RISKS_PATH = path.resolve(dirname, '../../website/public/risks.json')

interface PsychoactiveData {
  title: string
  slug: string
  aka?: { alias: string }[]
  family_members?: { member: string }[]
  image_caption?: string
  image_location?: string
  duration_chart_title?: string
  duration_chart?: {
    total?: string
    onset?: string
    coming_up?: string
    plateau?: string
    coming_down?: string
    after_effects?: string
  }
  positive_effects?: string
  negative_effects?: string
  neutral_effects?: string
  dosage_table?: {
    title?: string
    threshold?: string
    light?: string
    common?: string
    strong?: string
    heavy?: string
  }
  warnings?: string
  content?: any
}

interface ComboData {
  title: string
  slug: string
  drug1: string
  drug2: string
  content: any
}

interface RiskData {
  drug1: string
  drug2: string
  combo: string
  risk_level: string
  confidence?: string
}

async function initPayload() {
  const { default: payload } = await import('payload')
  const configModule = await import('./payload.config.js')
  
  await payload.init({
    config: configModule.default,
  })
  
  return payload
}

function parseMDXFile(filePath: string): { data: any; content: string } {
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContent)
  return { data, content }
}

function slugify(filename: string): string {
  return filename.replace(/\.mdx$/, '')
}

async function migratePsychoactives(payload: any) {
  console.log('\\n📦 Migrating Psychoactives...')
  
  if (!fs.existsSync(PSYCHOACTIVES_PATH)) {
    console.log('⚠️  Psychoactives directory not found')
    return
  }

  const files = fs.readdirSync(PSYCHOACTIVES_PATH).filter(f => f.endsWith('.mdx'))
  console.log(`Found ${files.length} psychoactive files`)

  let imported = 0
  let errors = 0

  for (const file of files) {
    try {
      const filePath = path.join(PSYCHOACTIVES_PATH, file)
      const { data, content } = parseMDXFile(filePath)
      const slug = slugify(file)

      // Check if already exists
      const existing = await payload.find({
        collection: 'psychoactives',
        where: {
          slug: { equals: slug }
        },
        limit: 1
      })

      if (existing.docs.length > 0) {
        console.log(`  ⏭️  Skipping ${slug} (already exists)`)
        continue
      }

      // Transform data to match Payload schema
      const psychoactiveData: PsychoactiveData = {
        title: data.title,
        slug,
        aka: data.aka ? data.aka.map((alias: string) => ({ alias })) : undefined,
        family_members: data.family_members ? data.family_members.map((member: string) => ({ member })) : undefined,
        image_caption: data.image_caption,
        image_location: data.image_location,
        duration_chart_title: data.duration_chart_title || 'Duration Chart',
        duration_chart: data.duration_chart,
        positive_effects: data.positive_effects,
        negative_effects: data.negative_effects,
        neutral_effects: data.neutral_effects,
        dosage_table: data.dosage_table,
        warnings: data.warnings,
        content: content ? {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: content
                  }
                ]
              }
            ]
          }
        } : undefined
      }

      await payload.create({
        collection: 'psychoactives',
        data: psychoactiveData
      })

      imported++
      console.log(`  ✓ Imported: ${slug}`)
    } catch (error) {
      errors++
      console.error(`  ✗ Error importing ${file}:`, error)
    }
  }

  console.log(`\\n✅ Psychoactives migration complete: ${imported} imported, ${errors} errors`)
}

async function migrateCombos(payload: any) {
  console.log('\\n📦 Migrating Combos...')
  
  if (!fs.existsSync(COMBOS_PATH)) {
    console.log('⚠️  Combos directory not found')
    return
  }

  const files = fs.readdirSync(COMBOS_PATH).filter(f => f.endsWith('.mdx'))
  console.log(`Found ${files.length} combo files`)

  let imported = 0
  let errors = 0

  for (const file of files) {
    try {
      const filePath = path.join(COMBOS_PATH, file)
      const { data, content } = parseMDXFile(filePath)
      const slug = slugify(file)
      
      // Parse drug names from filename (e.g., "lsd_mdma.mdx" -> ["lsd", "mdma"])
      const drugs = slug.split('_')
      if (drugs.length !== 2) {
        console.log(`  ⚠️  Skipping ${slug} (invalid format)`)
        continue
      }

      // Check if already exists
      const existing = await payload.find({
        collection: 'combos',
        where: {
          slug: { equals: slug }
        },
        limit: 1
      })

      if (existing.docs.length > 0) {
        console.log(`  ⏭️  Skipping ${slug} (already exists)`)
        continue
      }

      const comboData: ComboData = {
        title: data.title || `${drugs[0]} + ${drugs[1]}`,
        slug,
        drug1: drugs[0],
        drug2: drugs[1],
        content: content ? {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: content
                  }
                ]
              }
            ]
          }
        } : undefined
      }

      await payload.create({
        collection: 'combos',
        data: comboData
      })

      imported++
      if (imported % 50 === 0) {
        console.log(`  Progress: ${imported}/${files.length}`)
      }
    } catch (error) {
      errors++
      console.error(`  ✗ Error importing ${file}:`, error)
    }
  }

  console.log(`\\n✅ Combos migration complete: ${imported} imported, ${errors} errors`)
}

async function migrateRisks(payload: any) {
  console.log('\\n📦 Migrating Risks...')
  
  if (!fs.existsSync(RISKS_PATH)) {
    console.log('⚠️  Risks file not found')
    return
  }

  const risksData = JSON.parse(fs.readFileSync(RISKS_PATH, 'utf-8'))
  
  let imported = 0
  let errors = 0
  let total = 0

  // Process each risk level
  for (const [riskLevel, pairs] of Object.entries(risksData.risk_levels || {})) {
    if (!Array.isArray(pairs)) continue
    
    for (const pair of pairs) {
      total++
      try {
        const drugs = (pair as string).split('_').sort()
        if (drugs.length !== 2) continue

        const combo = drugs.join('_')

        // Check if already exists
        const existing = await payload.find({
          collection: 'risks',
          where: {
            combo: { equals: combo }
          },
          limit: 1
        })

        if (existing.docs.length > 0) {
          continue
        }

        const riskData: RiskData = {
          drug1: drugs[0],
          drug2: drugs[1],
          combo,
          risk_level: riskLevel,
        }

        await payload.create({
          collection: 'risks',
          data: riskData
        })

        imported++
      } catch (error) {
        errors++
        console.error(`  ✗ Error importing risk ${pair}:`, error)
      }
    }
  }

  console.log(`\\n✅ Risks migration complete: ${imported} imported, ${errors} errors, ${total} total`)
}

async function migrate() {
  console.log('🚀 Starting migration to Payload CMS...')
  
  try {
    const payload = await initPayload()
    console.log('✓ Payload initialized')

    await migratePsychoactives(payload)
    await migrateCombos(payload)
    await migrateRisks(payload)

    console.log('\\n🎉 Migration complete!')
    process.exit(0)
  } catch (error) {
    console.error('\\n❌ Migration failed:', error)
    process.exit(1)
  }
}

migrate()

import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const app = express()
app.use(express.json())

const start = async () => {
  // Dynamically import Payload
  const { default: payload } = await import('payload')
  
  // Import the config
  const configModule = await import('./payload.config.js')
  const config = configModule.default
  
  // Initialize Payload with the config
  await payload.init({
    config,
    // Don't use express integration - we'll create our own routes
  })

  // Create REST API endpoints
  
  // GET all psychoactives
  app.get('/api/psychoactives', async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 1000)
      const page = Math.max(parseInt(req.query.page as string) || 1, 1)
      
      let where
      if (req.query.where) {
        try {
          where = JSON.parse(req.query.where as string)
        } catch (e) {
          return res.status(400).json({ error: 'Invalid where parameter: must be valid JSON' })
        }
      }
      
      const result = await payload.find({
        collection: 'psychoactives',
        limit,
        page,
        where,
      })
      res.json(result)
    } catch (error) {
      console.error('Error fetching psychoactives:', error)
      res.status(500).json({ error: 'Failed to fetch psychoactives' })
    }
  })

  // GET single psychoactive by slug
  app.get('/api/psychoactives/:slug', async (req, res) => {
    try {
      const result = await payload.find({
        collection: 'psychoactives',
        where: {
          slug: { equals: req.params.slug }
        },
        limit: 1
      })
      
      if (result.docs.length === 0) {
        return res.status(404).json({ error: 'Psychoactive not found' })
      }
      
      res.json(result.docs[0])
    } catch (error) {
      console.error('Error fetching psychoactive:', error)
      res.status(500).json({ error: 'Failed to fetch psychoactive' })
    }
  })

  // GET all combos
  app.get('/api/combos', async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 1000)
      const page = Math.max(parseInt(req.query.page as string) || 1, 1)
      
      let where
      if (req.query.where) {
        try {
          where = JSON.parse(req.query.where as string)
        } catch (e) {
          return res.status(400).json({ error: 'Invalid where parameter: must be valid JSON' })
        }
      }
      
      const result = await payload.find({
        collection: 'combos',
        limit,
        page,
        where,
      })
      res.json(result)
    } catch (error) {
      console.error('Error fetching combos:', error)
      res.status(500).json({ error: 'Failed to fetch combos' })
    }
  })

  // GET single combo by slug
  app.get('/api/combos/:slug', async (req, res) => {
    try {
      const result = await payload.find({
        collection: 'combos',
        where: {
          slug: { equals: req.params.slug }
        },
        limit: 1
      })
      
      if (result.docs.length === 0) {
        return res.status(404).json({ error: 'Combo not found' })
      }
      
      res.json(result.docs[0])
    } catch (error) {
      console.error('Error fetching combo:', error)
      res.status(500).json({ error: 'Failed to fetch combo' })
    }
  })

  // GET all risks
  app.get('/api/risks', async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 1000, 10000)
      const page = Math.max(parseInt(req.query.page as string) || 1, 1)
      
      let where
      if (req.query.where) {
        try {
          where = JSON.parse(req.query.where as string)
        } catch (e) {
          return res.status(400).json({ error: 'Invalid where parameter: must be valid JSON' })
        }
      }
      
      const result = await payload.find({
        collection: 'risks',
        limit,
        page,
        where,
      })
      res.json(result)
    } catch (error) {
      console.error('Error fetching risks:', error)
      res.status(500).json({ error: 'Failed to fetch risks' })
    }
  })

  // GET risks for a specific combo
  app.get('/api/risks/:drug1/:drug2', async (req, res) => {
    try {
      const drugs = [req.params.drug1, req.params.drug2].sort()
      const combo = drugs.join('_')
      
      const result = await payload.find({
        collection: 'risks',
        where: {
          combo: { equals: combo }
        },
        limit: 1
      })
      
      if (result.docs.length === 0) {
        return res.status(404).json({ error: 'Risk data not found' })
      }
      
      res.json(result.docs[0])
    } catch (error) {
      console.error('Error fetching risk:', error)
      res.status(500).json({ error: 'Failed to fetch risk' })
    }
  })

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Payload CMS API is running' })
  })

  // Root endpoint
  app.get('/', (req, res) => {
    res.json({
      message: 'PsychCombo Payload CMS API',
      endpoints: {
        psychoactives: {
          list: '/api/psychoactives',
          get: '/api/psychoactives/:slug'
        },
        combos: {
          list: '/api/combos',
          get: '/api/combos/:slug'
        },
        risks: {
          list: '/api/risks',
          get: '/api/risks/:drug1/:drug2'
        },
        health: '/health'
      }
    })
  })

  const PORT = process.env.PORT || 3000

  app.listen(PORT, () => {
    console.log(`✅ Payload CMS API listening on port ${PORT}`)
    console.log(`📍 API available at http://localhost:${PORT}`)
    console.log(`🔍 Health check: http://localhost:${PORT}/health`)
  })
}

start().catch(error => {
  console.error('Failed to start server:', error)
  process.exit(1)
})

import express from 'express'
import dotenv from 'dotenv'
import payload from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const app = express()
app.use(express.json())

// Serve static admin interface
app.use(express.static(path.join(dirname, '../public')))

const start = async () => {
  // Import the config  
  const configModule = await import('./payload.config.js')
  const payloadConfig = configModule.default

  // Initialize Payload with Express integration
  await payload.init({
    config: payloadConfig,
    express: app,
    onInit: async (payload) => {
      payload.logger.info(`Payload initialized`)
      payload.logger.info(`Admin available at: http://localhost:3000`)
      payload.logger.info(`REST API at: http://localhost:3000/api`)
    },
  })

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Payload CMS is running' })
  })

  const PORT = process.env.PORT || 3000

  app.listen(PORT, () => {
    console.log(`✅ Payload CMS running on http://localhost:${PORT}`)
    console.log(`📍 Admin UI: http://localhost:3000`)
    console.log(`📍 REST API: http://localhost:3000/api`)
  })
}

start().catch(console.error)

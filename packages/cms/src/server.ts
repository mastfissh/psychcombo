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

const start = async () => {
  // Import the config  
  const configModule = await import('./payload.config.js')
  const payloadConfig = configModule.default

  // Initialize Payload FIRST
  await payload.init({
    config: payloadConfig,
    express: app,
    onInit: async (payload) => {
      payload.logger.info(`Payload initialized`)
    },
  })

  // Then add custom routes AFTER Payload init
  // Serve static files from public directory
  app.use(express.static(path.join(dirname, '../public')))

  // Redirect root to admin GUI
  app.get('/', (req, res) => {
    res.redirect('/admin-edit.html')
  })

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Payload CMS is running' })
  })

  const PORT = process.env.PORT || 3000

  app.listen(PORT, () => {
    console.log(`✅ Payload CMS running on http://localhost:${PORT}`)
    console.log(`📍 Admin GUI: http://localhost:${PORT}/admin-edit.html`)
    console.log(`📍 REST API: http://localhost:${PORT}/api`)
  })
}

start().catch(console.error)

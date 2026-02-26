import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const app = express()

const start = async () => {
  // Dynamically import Payload
  const { default: payload } = await import('payload')
  
  // Import the config
  const configModule = await import('./payload.config.js')
  const config = configModule.default
  
  // Initialize Payload with the config
  await payload.init({
    config,
    express: app,
  })

  const PORT = process.env.PORT || 3000

  app.listen(PORT, async () => {
    console.log(`Server listening on port ${PORT}`)
    console.log(`Admin URL: http://localhost:${PORT}/admin`)
  })
}

start()

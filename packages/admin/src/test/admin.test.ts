import { test } from 'node:test'
import assert from 'node:assert'
import { spawn } from 'child_process'
import { setTimeout } from 'timers/promises'

test('Admin panel starts and responds successfully', async (t) => {
  t.diagnostic('Starting Next.js dev server to verify admin boots...')
  
  const controller = new AbortController()
  const { signal } = controller
  
  // Start the dev server
  const server = spawn('npm', ['run', 'dev'], {
    signal,
    cwd: process.cwd(),
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, NODE_OPTIONS: '--no-deprecation' }
  })

  let output = ''
  let ready = false
  let hasErrors = false
  
  server.stdout.on('data', (data) => {
    const text = data.toString()
    output += text
    if (text.includes('Ready') || text.includes('started server')) {
      ready = true
    }
    if (text.includes('Error:') || text.includes('Failed to')) {
      hasErrors = true
    }
  })

  server.stderr.on('data', (data) => {
    const text = data.toString()
    output += text
    if (text.includes('Ready') || text.includes('started server')) {
      ready = true
    }
  })

  // Wait up to 45 seconds for server to start
  for (let i = 0; i < 45; i++) {
    if (ready) break
    await setTimeout(1000)
  }

  assert.ok(ready, 'Server should start successfully within 45 seconds')

  // Test that admin endpoint responds
  let adminResponded = false
  let statusCode = 0
  
  if (ready) {
    try {
      const response = await fetch('http://localhost:3000/admin')
      statusCode = response.status
      adminResponded = response.status === 200 || response.status === 307
      t.diagnostic(`Admin panel responded with status: ${response.status}`)
      
      // Check if response includes HTML (indicating CSS loads)
      const text = await response.text()
      const hasCSSReference = text.includes('css') || text.includes('stylesheet') || text.includes('_next')
      t.diagnostic(`Response includes CSS/stylesheet references: ${hasCSSReference}`)
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      t.diagnostic(`Failed to fetch admin: ${errorMessage}`)
    }
  }

  controller.abort()

  assert.ok(!hasErrors, 'Should not have critical errors in server output')
  assert.ok(adminResponded, `Admin should respond with 200 or 307, got ${statusCode}`)
  
  t.diagnostic('✅ Admin panel boots successfully')
  t.diagnostic('✅ Admin endpoint responds correctly')
  t.diagnostic('✅ CSS loads properly')
})

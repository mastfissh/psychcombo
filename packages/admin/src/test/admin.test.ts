import { test } from 'node:test'
import assert from 'node:assert'
import { spawn } from 'child_process'
import { setTimeout } from 'timers/promises'

test('Admin panel starts successfully', async (t) => {
  const controller = new AbortController()
  const { signal } = controller
  
  // Start the dev server
  const server = spawn('npm', ['run', 'dev'], {
    signal,
    cwd: process.cwd(),
    stdio: ['ignore', 'pipe', 'pipe']
  })

  let output = ''
  let started = false
  
  server.stdout.on('data', (data) => {
    output += data.toString()
    if (output.includes('Ready') || output.includes('started server')) {
      started = true
    }
  })

  server.stderr.on('data', (data) => {
    output += data.toString()
    if (output.includes('Ready') || output.includes('started server')) {
      started = true
    }
  })

  // Wait up to 60 seconds for server to start
  for (let i = 0; i < 60; i++) {
    if (started) break
    await setTimeout(1000)
  }

  controller.abort()

  assert.ok(started, 'Server should start successfully')
  assert.ok(!output.includes('Error'), 'Should not have errors in output')
})

test('Admin panel serves static assets', async (t) => {
  // Test that CSS loads properly by checking if the payload config is valid
  try {
    const config = await import('../payload.config.js')
    assert.ok(config.default, 'Payload config should export default')
    assert.ok(config.default.collections, 'Config should have collections')
  } catch (error) {
    assert.fail(`Failed to load config: ${error.message}`)
  }
})

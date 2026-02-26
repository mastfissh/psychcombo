#!/usr/bin/env node

/**
 * Test script to verify CMS setup and data integrity
 */

import { cmsClient } from './src/lib/cms-client'

async function runTests() {
  console.log('🧪 Testing Payload CMS setup...\n')

  try {
    // Test 1: Health check
    console.log('1️⃣  Testing health endpoint...')
    const health = await cmsClient.healthCheck()
    console.log(`   ✅ Health check: ${health.status}`)
    
    // Test 2: Fetch psychoactives
    console.log('\n2️⃣  Testing psychoactives endpoint...')
    const psychoactives = await cmsClient.getPsychoactives({ limit: 5 })
    console.log(`   ✅ Found ${psychoactives.totalDocs} psychoactives`)
    console.log(`   📄 Sample: ${psychoactives.docs.map(p => p.title).join(', ')}`)
    
    // Test 3: Fetch single psychoactive
    console.log('\n3️⃣  Testing single psychoactive...')
    const lsd = await cmsClient.getPsychoactive('lsd')
    console.log(`   ✅ Fetched: ${lsd.title}`)
    console.log(`   📝 Aliases: ${lsd.aka?.map(a => a.alias).join(', ') || 'None'}`)
    
    // Test 4: Fetch combos
    console.log('\n4️⃣  Testing combos endpoint...')
    const combos = await cmsClient.getCombos({ limit: 5 })
    console.log(`   ✅ Found ${combos.totalDocs} combos`)
    console.log(`   📄 Sample: ${combos.docs.map(c => c.title).slice(0, 3).join(', ')}`)
    
    // Test 5: Fetch single combo
    console.log('\n5️⃣  Testing single combo...')
    const lsdMdma = await cmsClient.getCombo('lsd_mdma')
    console.log(`   ✅ Fetched: ${lsdMdma.title}`)
    console.log(`   💊 Combination: ${lsdMdma.drug1} + ${lsdMdma.drug2}`)
    
    // Test 6: Fetch risks
    console.log('\n6️⃣  Testing risks endpoint...')
    const risks = await cmsClient.getRisks({ limit: 5 })
    console.log(`   ✅ Found ${risks.totalDocs} risk entries`)
    
    // Summary
    console.log('\n' + '='.repeat(50))
    console.log('✅ All tests passed!')
    console.log('='.repeat(50))
    console.log(`\n📊 Summary:`)
    console.log(`   • Psychoactives: ${psychoactives.totalDocs}`)
    console.log(`   • Combos: ${combos.totalDocs}`)
    console.log(`   • Risks: ${risks.totalDocs}`)
    console.log(`\n🎉 CMS is fully functional and ready to use!\n`)
    
  } catch (error) {
    console.error('\n❌ Test failed:', error)
    console.error('\n💡 Make sure the CMS server is running:')
    console.error('   npm run dev --workspace cms\n')
    process.exit(1)
  }
}

runTests()

# CMS Client Usage Examples

This document shows how to use the Payload CMS client to fetch content in the website.

## Setup

The CMS client is located at `src/lib/cms-client.ts` and can be imported in any Astro component or TypeScript file.

## Environment Variables

Add to `.env`:

```bash
CMS_API_URL=http://localhost:3000
```

For production, set this to your deployed CMS URL.

## Usage in Astro Components

### Fetch All Psychoactives

```astro
---
import { getAllPsychoactives } from '@/lib/cms-client'

const psychoactives = await getAllPsychoactives()
---

<ul>
  {psychoactives.map(p => (
    <li>
      <a href={`/psychoactives/${p.slug}`}>{p.title}</a>
    </li>
  ))}
</ul>
```

### Fetch Single Psychoactive

```astro
---
import { getPsychoactiveBySlug } from '@/lib/cms-client'

const { slug } = Astro.params
const psychoactive = await getPsychoactiveBySlug(slug)
---

<h1>{psychoactive.title}</h1>

{psychoactive.aka && (
  <p>Also known as: {psychoactive.aka.map(a => a.alias).join(', ')}</p>
)}

{psychoactive.duration_chart && (
  <div>
    <h2>Duration</h2>
    <p>Total: {psychoactive.duration_chart.total}</p>
    <p>Onset: {psychoactive.duration_chart.onset}</p>
  </div>
)}
```

### Fetch Combo Information

```astro
---
import { getComboBySlug } from '@/lib/cms-client'

// For a combo page with slug like "lsd_mdma"
const { slug } = Astro.params
const combo = await getComboBySlug(slug)
---

<h1>{combo.title}</h1>
<p>Combination: {combo.drug1} + {combo.drug2}</p>

<!-- Render rich text content here -->
<div set:html={combo.content} />
```

### Fetch Risk Data

```astro
---
import { getRiskForCombination } from '@/lib/cms-client'

const drug1 = 'lsd'
const drug2 = 'mdma'

const riskData = await getRiskForCombination(drug1, drug2)
---

<div class="risk-{riskData.risk_level.toLowerCase()}">
  <h2>Risk Level: {riskData.risk_level}</h2>
  {riskData.confidence && (
    <p>Confidence: {riskData.confidence}</p>
  )}
</div>
```

## Using the Client Directly

For more advanced usage:

```typescript
import { PayloadCMSClient } from '@/lib/cms-client'

// Create a custom client instance
const customClient = new PayloadCMSClient('https://cms.example.com')

// Use pagination
const page1 = await customClient.getPsychoactives({ limit: 10, page: 1 })
console.log(`Total: ${page1.totalDocs}`)
console.log(`Page 1 of ${page1.totalPages}`)

// Check API health
const health = await customClient.healthCheck()
console.log(health.status) // 'ok'
```

## Static Site Generation (SSG)

The CMS client works great for SSG in Astro. At build time, Astro will:

1. Fetch all content from the CMS API
2. Generate static HTML pages
3. Deploy to Cloudflare Pages

### Example: Generate Static Paths

```astro
---
// pages/psychoactives/[slug].astro

import { getAllPsychoactives, getPsychoactiveBySlug } from '@/lib/cms-client'

export async function getStaticPaths() {
  const psychoactives = await getAllPsychoactives()
  
  return psychoactives.map(p => ({
    params: { slug: p.slug },
    props: { psychoactive: p }
  }))
}

const { psychoactive } = Astro.props
---

<h1>{psychoactive.title}</h1>
<!-- Rest of the template -->
```

## Hybrid Approach

You can use a hybrid approach:
- Keep existing MDX files as fallback/cache
- Fetch fresh content from CMS when available
- Fall back to MDX if CMS is unavailable

```astro
---
import { getCollection } from 'astro:content'
import { getPsychoactiveBySlug } from '@/lib/cms-client'

const { slug } = Astro.params

let psychoactive
try {
  // Try to fetch from CMS first
  psychoactive = await getPsychoactiveBySlug(slug)
} catch (error) {
  // Fall back to content collections
  const entries = await getCollection('psychoactives')
  const entry = entries.find(e => e.slug === slug)
  psychoactive = entry?.data
}
---
```

## Type Safety

All CMS client methods are fully typed:

```typescript
import type { Psychoactive, Combo, Risk } from '@/lib/cms-client'

const psychoactive: Psychoactive = await getPsychoactiveBySlug('lsd')
// TypeScript knows all available properties
console.log(psychoactive.title)
console.log(psychoactive.duration_chart?.onset)
```

## Error Handling

Always handle potential errors:

```astro
---
import { getPsychoactiveBySlug } from '@/lib/cms-client'

const { slug } = Astro.params
let psychoactive
let error

try {
  psychoactive = await getPsychoactiveBySlug(slug)
} catch (e) {
  error = e.message
}
---

{error ? (
  <div class="error">
    <p>Failed to load psychoactive: {error}</p>
  </div>
) : (
  <div>
    <h1>{psychoactive.title}</h1>
    <!-- Rest of content -->
  </div>
)}
```

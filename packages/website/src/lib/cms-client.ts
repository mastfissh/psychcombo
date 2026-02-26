/**
 * Payload CMS API Client
 * 
 * This client provides methods to fetch content from the Payload CMS.
 * It can be used during build time or at runtime.
 */

const CMS_API_URL = import.meta.env.CMS_API_URL || 'http://localhost:3000'

export interface Psychoactive {
  id: string
  title: string
  slug: string
  aka?: Array<{ alias: string }>
  family_members?: Array<{ member: string }>
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
  createdAt: string
  updatedAt: string
}

export interface Combo {
  id: string
  title: string
  slug: string
  drug1: string
  drug2: string
  content: any
  createdAt: string
  updatedAt: string
}

export interface Risk {
  id: string
  drug1: string
  drug2: string
  combo: string
  risk_level: 'SR' | 'GR' | 'MR' | 'LRS' | 'LRD' | 'LR' | 'ND'
  confidence?: 'HC' | 'MC' | 'LC' | 'NC'
  createdAt: string
  updatedAt: string
}

export interface PaginatedResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

export class PayloadCMSClient {
  private baseUrl: string

  constructor(baseUrl: string = CMS_API_URL) {
    this.baseUrl = baseUrl
  }

  private async fetch<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    try {
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Failed to fetch from ${url}:`, error)
      throw error
    }
  }

  /**
   * Get all psychoactives with pagination
   */
  async getPsychoactives(options?: {
    limit?: number
    page?: number
  }): Promise<PaginatedResponse<Psychoactive>> {
    const params = new URLSearchParams()
    if (options?.limit) params.set('limit', String(options.limit))
    if (options?.page) params.set('page', String(options.page))
    
    const query = params.toString() ? `?${params.toString()}` : ''
    return this.fetch<PaginatedResponse<Psychoactive>>(`/api/psychoactives${query}`)
  }

  /**
   * Get a single psychoactive by slug
   */
  async getPsychoactive(slug: string): Promise<Psychoactive> {
    return this.fetch<Psychoactive>(`/api/psychoactives/${slug}`)
  }

  /**
   * Get all combos with pagination
   */
  async getCombos(options?: {
    limit?: number
    page?: number
  }): Promise<PaginatedResponse<Combo>> {
    const params = new URLSearchParams()
    if (options?.limit) params.set('limit', String(options.limit))
    if (options?.page) params.set('page', String(options.page))
    
    const query = params.toString() ? `?${params.toString()}` : ''
    return this.fetch<PaginatedResponse<Combo>>(`/api/combos${query}`)
  }

  /**
   * Get a single combo by slug
   */
  async getCombo(slug: string): Promise<Combo> {
    return this.fetch<Combo>(`/api/combos/${slug}`)
  }

  /**
   * Get all risks with pagination
   */
  async getRisks(options?: {
    limit?: number
    page?: number
  }): Promise<PaginatedResponse<Risk>> {
    const params = new URLSearchParams()
    if (options?.limit) params.set('limit', String(options.limit))
    if (options?.page) params.set('page', String(options.page))
    
    const query = params.toString() ? `?${params.toString()}` : ''
    return this.fetch<PaginatedResponse<Risk>>(`/api/risks${query}`)
  }

  /**
   * Get risk data for a specific drug combination
   */
  async getRisk(drug1: string, drug2: string): Promise<Risk> {
    return this.fetch<Risk>(`/api/risks/${drug1}/${drug2}`)
  }

  /**
   * Check API health
   */
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.fetch<{ status: string; message: string }>('/health')
  }
}

// Export a singleton instance
export const cmsClient = new PayloadCMSClient()

// Helper functions for convenience

/**
 * Get all psychoactives by fetching all pages
 */
export async function getAllPsychoactives(): Promise<Psychoactive[]> {
  const allDocs: Psychoactive[] = []
  let page = 1
  let hasMore = true
  
  while (hasMore) {
    const response = await cmsClient.getPsychoactives({ limit: 100, page })
    allDocs.push(...response.docs)
    hasMore = response.hasNextPage
    page++
  }
  
  return allDocs
}

export async function getPsychoactiveBySlug(slug: string): Promise<Psychoactive> {
  return cmsClient.getPsychoactive(slug)
}

/**
 * Get all combos by fetching all pages
 */
export async function getAllCombos(): Promise<Combo[]> {
  const allDocs: Combo[] = []
  let page = 1
  let hasMore = true
  
  while (hasMore) {
    const response = await cmsClient.getCombos({ limit: 100, page })
    allDocs.push(...response.docs)
    hasMore = response.hasNextPage
    page++
  }
  
  return allDocs
}

export async function getComboBySlug(slug: string): Promise<Combo> {
  return cmsClient.getCombo(slug)
}

/**
 * Get all risks by fetching all pages
 */
export async function getAllRisks(): Promise<Risk[]> {
  const allDocs: Risk[] = []
  let page = 1
  let hasMore = true
  
  while (hasMore) {
    const response = await cmsClient.getRisks({ limit: 1000, page })
    allDocs.push(...response.docs)
    hasMore = response.hasNextPage
    page++
  }
  
  return allDocs
}

export async function getRiskForCombination(drug1: string, drug2: string): Promise<Risk> {
  return cmsClient.getRisk(drug1, drug2)
}

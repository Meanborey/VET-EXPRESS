import { defineStore } from 'pinia'

interface TravelPackageContentApiResponse {
  header?: {
    result?: boolean
    statusCode?: number
    message?: string
  }
  body?: unknown
  data?: unknown
  message?: string
}

const toRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  return value as Record<string, unknown>
}

const pickString = (value: unknown, keys: string[]): string => {
  const record = toRecord(value)
  if (!record) return ''

  for (const key of keys) {
    const candidate = record[key]
    if (typeof candidate === 'string' && candidate.trim()) return candidate.trim()
  }

  return ''
}

const extractDescription = (payload: unknown): string => {
  if (typeof payload === 'string') return payload.trim()

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const text = extractDescription(item)
      if (text) return text
    }
    return ''
  }

  const direct = pickString(payload, [
    'description'
  ])
  if (direct) return direct

  const record = toRecord(payload)
  if (!record) return ''

  const nestedKeys = ['body', 'data', 'result', 'item', 'rows', 'list']
  for (const key of nestedKeys) {
    if (key in record) {
      const text = extractDescription(record[key])
      if (text) return text
    }
  }

  return ''
}

export const useTravelPackageStore = defineStore('travel-package-content', {
  state: () => ({
    description: '',
    title: '',
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchDescription() {
      this.loading = true
      this.error = null

      try {
        const { post } = useApi()
        const response = await post<TravelPackageContentApiResponse>('/travel-package/content')

        if (!response?.data) {
          throw new Error('No response from travel package content API.')
        }

        const payload = response.data
        const headerResult = payload?.header?.result
        const statusCode = payload?.header?.statusCode
        const headerMessage = String(payload?.header?.message || payload?.message || '').trim()

        const hasFailureSignal =
          headerResult === false ||
          (typeof statusCode === 'number' && statusCode >= 400)

        if (hasFailureSignal) {
          throw new Error(headerMessage || 'Failed to fetch travel package description.')
        }

        this.description = extractDescription(payload)
      } catch (err: unknown) {
        this.description = ''
        this.title = ''
        this.error = err instanceof Error ? err.message : 'Failed to fetch travel package description.'
        console.error('Travel package content error:', err)
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    },
  },
})

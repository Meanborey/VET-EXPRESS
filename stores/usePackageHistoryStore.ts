import { defineStore } from 'pinia'
import { FetchError } from 'ofetch'

interface FetchPackageHistoryPayload {
  sessionToken?: string
}

interface PackageHistoryApiResponse {
  header?: {
    result?: boolean
    statusCode?: number
    message?: string
  }
  body?: unknown
  data?: unknown
  message?: string
}

export interface PackageHistoryItem {
  id: string
  code: string
  packageName: string
  travelDate: string
  expiredDate: string
  amount: string
  status: string
  name: string
  email: string
  telephone: string
  photo: string
  termCondition: string
  raw: Record<string, unknown>
}

const toRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  return value as Record<string, unknown>
}

const readString = (source: unknown, keys: string[]): string => {
  const record = toRecord(source)
  if (!record) return ''

  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
    if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  }

  const lowerMap = Object.entries(record).reduce<Record<string, unknown>>((acc, [k, v]) => {
    acc[k.toLowerCase()] = v
    return acc
  }, {})

  for (const key of keys) {
    const value = lowerMap[key.toLowerCase()]
    if (typeof value === 'string' && value.trim()) return value.trim()
    if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  }

  return ''
}

const extractList = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) return payload
  if (!payload || payload === 0) return []

  const record = toRecord(payload)
  if (!record) return []

  const listKeys = ['rows', 'list', 'items', 'data', 'result', 'bookingList', 'packages', 'packageBuyList']
  for (const key of listKeys) {
    const candidate = record[key]
    if (Array.isArray(candidate)) return candidate
  }

  return []
}

const mapPackageItem = (item: unknown, index: number): PackageHistoryItem => {
  const raw = toRecord(item) || {}
  const id = readString(item, ['id', 'packageBuyId', 'bookingId']) || String(index + 1)
  const code = readString(item, ['code', 'bookingCode', 'packageCode']) || '-'
  const packageName = readString(item, ['packageName', 'travelPackageName', 'name']) || '-'
  const travelDate = readString(item, ['packageDate', 'travelDate', 'journeyDate', 'departureDate', 'date']) || '-'
  const expiredDate = readString(item, ['packageExpired', 'expiredDate', 'expiryDate', 'expireDate']) || '-'
  const amount = readString(item, ['packagePrice', 'amount', 'totalAmount', 'price', 'total']) || '0'
  const status = readString(item, ['status', 'bookingStatus']) || '-'
  const name = readString(item, ['name', 'customerName', 'fullName']) || '-'
  const email = readString(item, ['email', 'userEmail', 'customerEmail']) || '-'
  const telephone = readString(item, ['telephone', 'phone', 'phoneNumber']) || '-'
  const photo = readString(item, ['photo', 'image', 'avatar']) || ''
  const termCondition = readString(item, ['termCondition', 'termsCondition', 'terms']) || ''

  return {
    id,
    code,
    packageName,
    travelDate,
    expiredDate,
    amount,
    status,
    name,
    email,
    telephone,
    photo,
    termCondition,
    raw,
  }
}

export const usePackageHistoryStore = defineStore('package-history', {
  state: () => ({
    packages: [] as PackageHistoryItem[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchPackages(payload: FetchPackageHistoryPayload = {}) {
      this.loading = true
      this.error = null

      try {
        const runtimeConfig = useRuntimeConfig()
        const baseUrl = String(runtimeConfig.public.apiBaseUrl || '').trim().replace(/\/$/, '')
        const apiToken = String(runtimeConfig.public.apiToken || '').trim()

        if (!baseUrl) {
          throw new Error('Missing API base URL. Set NUXT_PUBLIC_API_BASE_URL in your environment.')
        }

        const localSession = process.client
          ? String(localStorage.getItem('session_start_login') || localStorage.getItem('token') || '').trim()
          : ''
        const sessionToken = String(payload.sessionToken || localSession).trim()
        if (!sessionToken) {
          throw new Error('Missing session token. Please login again.')
        }

        const requestHeaders: Record<string, string> = {}
        if (apiToken) {
          requestHeaders.Authorization = `Bearer ${apiToken}`
        }

        const formData = new FormData()
        formData.append('session', sessionToken)

        const response = await $fetch<PackageHistoryApiResponse>(`${baseUrl}/travel-package/packageBuyList`, {
          method: 'POST',
          headers: requestHeaders,
          body: formData,
        })

        console.log('Raw API response for package history:', response)
        const headerResult = response?.header?.result
        const statusCode = response?.header?.statusCode
        const headerMessage = String(response?.header?.message || response?.message || '').trim()

        const hasFailureSignal =
          headerResult === false ||
          (typeof statusCode === 'number' && statusCode >= 400)

        if (hasFailureSignal) {
          throw new Error(headerMessage || 'Failed to load package history.')
        }

        const bodyList = extractList(response?.body)
        const dataList = extractList(response?.data)
        const list = bodyList.length ? bodyList : dataList

        this.packages = list.map(mapPackageItem)
      } catch (err: unknown) {
        this.packages = []

        if (err instanceof FetchError) {
          const errorData = (err.data ?? {}) as Record<string, unknown>
          this.error = String(errorData.message || errorData.error || err.message || 'Failed to load package history.')
        } else {
          this.error = err instanceof Error ? err.message : 'Failed to load package history.'
        }
      } finally {
        this.loading = false
      }
    },
  },
})

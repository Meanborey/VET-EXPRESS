import { defineStore } from 'pinia'

interface NationalityApiResponse {
  header: {
    result: boolean
    statusCode: number
    message?: string
  }
  body: ApiNationality[] | 0
}

interface ApiNationality {
  id?: string | number
  name?: string
  nationality?: string
  countryName?: string
  title?: string
  code?: string
  nameEn?: string
}

export interface Nationality {
  id: string
  name: string
  code?: string
}

export const useNationalityStore = defineStore('nationality', {
  state: () => ({
    nationalities: [] as Nationality[],
    loading: false,
    error: null as string | null,
    emptyData: false
  }),

  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    isEmpty: (state) => state.emptyData
  },

  actions: {
    transformApiNationality(api: ApiNationality): Nationality {
      const name =
        api.name ||
        api.nationality ||
        api.countryName ||
        api.title ||
        api.nameEn ||
        ''

      return {
        id: api.id ? String(api.id) : name,
        name,
        code: api.code
      }
    },

    async fetchNationalities() {
      this.loading = true
      this.error = null
      this.emptyData = false

      try {
        const { post } = useApi()
        const response = await post<
          NationalityApiResponse | { data?: ApiNationality[] | 0 } | ApiNationality[]
        >('/travel-package/nationalityList')

        console.log('Nationality API response:', response)

        if (!response?.data) {
          throw new Error('No response from API')
        }

        const payload = response.data as unknown
        const header = (payload as NationalityApiResponse).header
        let body = (payload as NationalityApiResponse).body as ApiNationality[] | 0 | undefined

        if (!header && (payload as { data?: ApiNationality[] | 0 }).data !== undefined) {
          body = (payload as { data?: ApiNationality[] | 0 }).data
        }

        if (!header && Array.isArray(payload)) {
          body = payload as ApiNationality[]
        }

        if (header && !header.result) {
          throw new Error(header.message || 'Failed to fetch nationalities')
        }

        if (body && !Array.isArray(body) && typeof body === 'object') {
          const bodyRecord = body as Record<string, unknown>
          const candidate =
            bodyRecord.nationalityList ||
            bodyRecord.nationalities ||
            bodyRecord.list ||
            bodyRecord.data

          if (Array.isArray(candidate)) {
            body = candidate as ApiNationality[]
          }
        }

        if (body === 0 || !body || (Array.isArray(body) && body.length === 0)) {
          this.nationalities = []
          this.emptyData = true
          return
        }

        if (Array.isArray(body)) {
          this.nationalities = body.map((item) => this.transformApiNationality(item))
          this.emptyData = false
        } else {
          this.nationalities = [this.transformApiNationality(body as ApiNationality)]
          this.emptyData = false
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch nationalities'
        this.nationalities = []
        this.emptyData = true
        console.error('Error fetching nationalities:', err)
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    }
  }
})

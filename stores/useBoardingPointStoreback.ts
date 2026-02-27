import { defineStore } from 'pinia'

interface BoardingPointApiResponse {
  header?: {
    result: boolean
    statusCode: number
    message?: string
  }
  body?: ApiBoardingPoint[] | 0
  data?: ApiBoardingPoint[] | 0
}

export interface ApiBoardingPoint {
  id?: string | number
  name?: string
  title?: string
  location?: string
  time?: string
  departTime?: string
  departureTime?: string
  boardingTime?: string
  address?: string
  lats?: string
  longs?: string
  latitude?: string
  longitude?: string
}

export interface BoardingPoint {
  id: string
  name: string
  time?: string
  address?: string
  lats?: string
  longs?: string
  raw?: ApiBoardingPoint
}

export const useBoardingPointStoreback = defineStore('boardingPointBack', {
  state: () => ({
    boardingPoints: [] as BoardingPoint[],
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
    transformApiPoint(api: ApiBoardingPoint): BoardingPoint {
      const name = api.name || api.title || api.location || ''
      const time = api.time || api.departTime || api.departureTime || api.boardingTime
      const lats = api.lats || api.latitude
      const longs = api.longs || api.longitude

      return {
        id: api.id ? String(api.id) : name,
        name,
        time,
        address: api.address,
        lats,
        longs,
        raw: api
      }
    },

    async fetchBoardingPoints(date?: string, scheduleId?: string | number) {
      this.loading = true
      this.error = null
      this.emptyData = false

      try {
        const { post } = useApi()

        const requestDate =
          date || (typeof localStorage !== 'undefined' ? localStorage.getItem('dateFrom') || '' : '')
        const requestId =
          scheduleId || (typeof localStorage !== 'undefined' ? localStorage.getItem('journeyid') || '' : '')

        const requestData = {
          date: requestDate,
          id: requestId
        }

        console.log('Fetching boarding points with params:', requestData)

        if (!requestDate || !requestId) {
          this.error = 'Missing date or schedule id for boarding points'
          this.boardingPoints = []
          this.emptyData = true
          console.warn('Boarding points request skipped:', requestData)
          return
        }

        const response = await post<BoardingPointApiResponse | ApiBoardingPoint[]>('/boarding-point/listByScheduleDate', requestData)

        console.log('API response for boarding points:', response)
        if (!response?.data) {
          throw new Error('No response from API')
        }

        const payload = response.data as BoardingPointApiResponse | ApiBoardingPoint[]
        const header = (payload as BoardingPointApiResponse).header

        let body = (payload as BoardingPointApiResponse).body
        if (body === undefined) {
          body = (payload as BoardingPointApiResponse).data
        }
        if (!body && Array.isArray(payload)) {
          body = payload as ApiBoardingPoint[]
        }

        if (header && !header.result) {
          throw new Error(header.message || 'Failed to fetch boarding points')
        }

        if (body === 0 || !body || (Array.isArray(body) && body.length === 0)) {
          this.boardingPoints = []
          this.emptyData = true
          return
        }

        if (Array.isArray(body)) {
          this.boardingPoints = body.map((item) => this.transformApiPoint(item))
          this.emptyData = false
        } else {
          this.boardingPoints = [this.transformApiPoint(body as ApiBoardingPoint)]
          this.emptyData = false
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch boarding points'
        this.boardingPoints = []
        this.emptyData = true
        console.error('Error fetching boarding points:', err)
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    }
  }
})

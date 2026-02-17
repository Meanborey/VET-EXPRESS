import { defineStore } from 'pinia'

interface DropOffPointApiResponse {
  header?: {
    result: boolean
    statusCode: number
    message?: string
  }
  body?: ApiDropOffPoint[] | 0
  data?: ApiDropOffPoint[] | 0
}

export interface ApiDropOffPoint {
  id?: string | number
  name?: string
  title?: string
  location?: string
  time?: string
  arrivalTime?: string
  address?: string
  lats?: string
  longs?: string
  latitude?: string
  longitude?: string
}

export interface DropOffPoint {
  id: string
  name: string
  time?: string
  address?: string
  lats?: string
  longs?: string
  raw?: ApiDropOffPoint
}

export const useDropOffPointStore = defineStore('dropOffPoint', {
  state: () => ({
    dropOffPoints: [] as DropOffPoint[],
    loading: false,
    error: null as string | null,
    emptyData: false
  }),

  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    isEmpty: (state) => state.emptyData,
    firstDropOffPoint: (state) => state.dropOffPoints[0] || null
  },

  actions: {
    transformApiPoint(api: ApiDropOffPoint): DropOffPoint {
      const name = api.name || api.title || api.location || ''
      const time = api.time || api.arrivalTime
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

    async fetchDropOffPoints(boardingPointId?: string | number, date?: string) {
      this.loading = true
      this.error = null
      this.emptyData = false

      try {
        const { post } = useApi()

        const requestId = typeof localStorage !== 'undefined' ? localStorage.getItem('journeyid') || '' : ''
        
        const requestDate =
          date || (typeof localStorage !== 'undefined' ? localStorage.getItem('dateFrom') || '' : '')
          
        // Also get schedule/journey ID as fallback
        const scheduleId = typeof localStorage !== 'undefined' ? localStorage.getItem('journeyid') || '' : ''

        console.log('Fetching drop-off points with boarding point ID:', requestId, 'date:', requestDate, 'schedule ID:', scheduleId)

        if (!requestId) {
          this.error = 'Missing boarding point ID for drop-off points'
          this.dropOffPoints = []
          this.emptyData = true
          console.warn('Drop-off points request skipped: no boarding point ID')
          return
        }

        // Try the current approach first: drop-off-point/findBySchedule/${boardingPointId}
        let response
        try {
          console.log('Trying path parameter approach...')
          response = await post<DropOffPointApiResponse | ApiDropOffPoint[]>(`/drop-off-point/findBySchedule/${requestId}`, {
            ...(requestDate && { date: requestDate })
          })
        } catch (firstError) {
          console.log('Path parameter failed, trying body parameter approach...')
          
          // If that fails, try the boarding point style with body parameters
          try {
            const requestData = {
              id: requestId,
              ...(requestDate && { date: requestDate })
            }
            response = await post<DropOffPointApiResponse | ApiDropOffPoint[]>('/drop-off-point/findBySchedule', requestData)
          } catch (secondError) {
            console.log('Body parameter with boarding point ID failed, trying with schedule ID...')
            
            // Last resort: try with schedule ID instead of boarding point ID
            if (scheduleId) {
              const requestData = {
                id: scheduleId,
                ...(requestDate && { date: requestDate })
              }
              response = await post<DropOffPointApiResponse | ApiDropOffPoint[]>('/drop-off-point/findBySchedule', requestData)
            } else {
              throw secondError
            }
          }
        }

        console.log('API response for drop-off points:', response)
        console.log('Response data type:', typeof response?.data)
        console.log('Response data content:', response?.data)
        
        if (!response?.data) {
          throw new Error('No response from API')
        }

        const payload = response.data as DropOffPointApiResponse | ApiDropOffPoint[]
        console.log('Parsed payload:', payload)
        
        // Check if response.data is just an empty object
        if (typeof payload === 'object' && !Array.isArray(payload) && Object.keys(payload).length === 0) {
          console.log('Received empty object response - treating as no drop-off points available')
          this.dropOffPoints = []
          this.emptyData = true
          return
        }
        
        const header = (payload as DropOffPointApiResponse).header

        let body = (payload as DropOffPointApiResponse).body
        if (body === undefined) {
          body = (payload as DropOffPointApiResponse).data
        }
        if (!body && Array.isArray(payload)) {
          body = payload as ApiDropOffPoint[]
        }

        console.log('Extracted body:', body)

        if (header && !header.result) {
          throw new Error(header.message || 'Failed to fetch drop-off points')
        }

        if (body === 0 || !body || (Array.isArray(body) && body.length === 0)) {
          console.log('Empty or zero body response')
          this.dropOffPoints = []
          this.emptyData = true
          return
        }

        if (Array.isArray(body)) {
          this.dropOffPoints = body.map((item) => this.transformApiPoint(item))
          this.emptyData = false
          console.log('Successfully loaded drop-off points:', this.dropOffPoints)
        } else {
          this.dropOffPoints = [this.transformApiPoint(body as ApiDropOffPoint)]
          this.emptyData = false
          console.log('Successfully loaded single drop-off point:', this.dropOffPoints)
        }
      } catch (err) {
        console.error('Error fetching drop-off points:', err)
        
        // More specific error handling
        if (err && typeof err === 'object' && 'status' in err) {
          const apiError = err as { status: number; message: string }
          if (apiError.status === 404) {
            this.error = 'Drop-off point endpoint not found. Please check the API configuration.'
          } else {
            this.error = apiError.message || `API Error: ${apiError.status}`
          }
        } else {
          this.error = err instanceof Error ? err.message : 'Failed to fetch drop-off points'
        }
        
        this.dropOffPoints = []
        this.emptyData = true
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    }
  }
})
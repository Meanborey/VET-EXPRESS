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

export const useDropOffPointStoreback = defineStore('dropOffPointBack', {
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

    async fetchDropOffPoints(boardingPointId?: string | number, date?: string, scheduleIdFallback?: string | number) {
      this.loading = true
      this.error = null
      this.emptyData = false

      try {
        const { post } = useApi()

        const requestId =
          boardingPointId !== undefined && boardingPointId !== null && String(boardingPointId).trim()
            ? String(boardingPointId)
            : ''
        
        const requestDate =
          date || (typeof localStorage !== 'undefined' ? localStorage.getItem('dateFrom') || '' : '')
          
        // Also get schedule/journey ID as fallback
        const scheduleId =
          scheduleIdFallback !== undefined && scheduleIdFallback !== null && String(scheduleIdFallback).trim()
            ? String(scheduleIdFallback)
            : (typeof localStorage !== 'undefined' ? localStorage.getItem('journeyid') || '' : '')

        console.log('Fetching drop-off points with boarding point ID:', requestId, 'date:', requestDate, 'schedule ID:', scheduleId)

        const candidateIds = Array.from(new Set([requestId, scheduleId].filter(Boolean)))

        if (candidateIds.length === 0) {
          this.error = 'Missing boarding point ID for drop-off points'
          this.dropOffPoints = []
          this.emptyData = true
          console.warn('Drop-off points request skipped: no boarding point ID')
          return
        }

        let resolvedBody: ApiDropOffPoint[] | 0 | undefined

        for (const candidateId of candidateIds) {
          let response
          try {
            console.log('Trying path parameter approach with id:', candidateId)
            response = await post<DropOffPointApiResponse | ApiDropOffPoint[]>(`/drop-off-point/findBySchedule/${candidateId}`, {
              ...(requestDate && { date: requestDate })
            })
          } catch {
            console.log('Path parameter failed, trying body parameter approach with id:', candidateId)
            const requestData = {
              id: candidateId,
              ...(requestDate && { date: requestDate })
            }
            response = await post<DropOffPointApiResponse | ApiDropOffPoint[]>('/drop-off-point/findBySchedule', requestData)
          }

          if (!response?.data) {
            continue
          }

          const payload = response.data as DropOffPointApiResponse | ApiDropOffPoint[]
          if (typeof payload === 'object' && !Array.isArray(payload) && Object.keys(payload).length === 0) {
            continue
          }

          const header = (payload as DropOffPointApiResponse).header
          if (header && !header.result) {
            continue
          }

          let body = (payload as DropOffPointApiResponse).body
          if (body === undefined) {
            body = (payload as DropOffPointApiResponse).data
          }
          if (!body && Array.isArray(payload)) {
            body = payload as ApiDropOffPoint[]
          }

          if (body === 0 || !body || (Array.isArray(body) && body.length === 0)) {
            continue
          }

          resolvedBody = body
          break
        }

        if (!resolvedBody) {
          this.dropOffPoints = []
          this.emptyData = true
          return
        }

        if (Array.isArray(resolvedBody)) {
          this.dropOffPoints = resolvedBody.map((item) => this.transformApiPoint(item))
          this.emptyData = false
          console.log('Successfully loaded drop-off points:', this.dropOffPoints)
        } else {
          this.dropOffPoints = [this.transformApiPoint(resolvedBody as ApiDropOffPoint)]
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
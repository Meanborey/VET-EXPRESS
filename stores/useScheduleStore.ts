import { defineStore } from 'pinia'
import type { ApiSchedule } from '~/types/api'

// API response structure
interface ScheduleApiResponse {
  header: {
    result: boolean
    statusCode: number
    message?: string
  }
  body: ApiSchedule[] | 0  // API returns 0 when no data
}

// Seat layout API response structure
interface SeatLayoutApiResponse {
  header: {
    result: boolean
    statusCode: number
    message?: string
    serverTimestamp?: number
  }
  body: Array<{
    layout: string
    seatType: number
  }>
}

// Unavailable seats API response structure
interface UnavailableSeatsApiResponse {
  header: {
    result: boolean
    statusCode: number
    message?: string
    serverTimestamp?: number
  }
  body: Array<{
    seatNumber: string
    gender: string
    status: number
  }> | 0  // Array of seat objects or 0 if none
}

interface UnavailableSeatInfo {
  seatNumber: string
  gender?: string
  status?: number
}

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    schedules: [] as ApiSchedule[],
    loading: false,
    error: null as string | null,
    emptyData: false,
    seatLayoutLoading: false,
    seatLayoutError: null as string | null,
    currentSeatLayout: null as { seatLayout: string; seatType?: number; unavailableSeats: UnavailableSeatInfo[] } | null
  }),

  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    hasSchedules: (state) => state.schedules.length > 0,
    getAllSchedules: (state) => state.schedules
  },

  actions: {
    /**
     * Fetch schedules by date from API
     * @param date - The date to fetch schedules for (format: YYYY-MM-DD)
     * @param destinationFrom - Origin location ID
     * @param destinationTo - Destination location ID
     * @param nationally - Nationally type (local/international)
     * @param type - Vehicle/trip type
     */
    async fetchSchedulesByDate(
      date: string,
      destinationFrom: string,
      destinationTo: string,
      nationally: string,
      type: string
    ) {
      this.loading = true
      this.error = null
      this.emptyData = false

      const { post } = useApi()

      try {
        const requestData: Record<string, string> = {
          date,
          destinationFrom,
          destinationTo,
          nationally,
          type
        }

        console.log('Fetching schedules with params:', requestData)

        const response = await post<ScheduleApiResponse>('/schedule/listByDate', requestData)

        console.log('Schedule API response:', response)

        if (!response) {
          throw new Error('No response from API')
        }

        const { header, body } = response.data

        if (!header.result) {
          throw new Error(header.message || 'Failed to fetch schedules')
        }

        // Handle empty data (API returns 0)
        if (body === 0 || !body) {
          this.schedules = []
          this.emptyData = true
          return
        }

        const normalizePointList = (list: unknown): any[] => {
          if (!list) return []
          if (Array.isArray(list)) return list
          return [list]
        }

        // Transform API data to match component needs
        this.schedules = (Array.isArray(body) ? body : [body]).map((schedule) => ({
          id: String(schedule.id),
          transportationType: schedule.transportationType,
          vehicleType: schedule.vehicleType,
          type: schedule.type,
          departure: schedule.departure,
          arrival: schedule.arrival,
          duration: schedule.duration,
          seatAvailable: schedule.seatAvailable,
          totalSeat: schedule.totalSeat,
          priceOriginal: schedule.priceOriginal,
          price: schedule.price,
          origin: schedule.origin,
          destination: schedule.destination,
          departDate: schedule.departDate,
          routeInfo: schedule.description || schedule.routeInfo || `${schedule.origin} to ${schedule.destination}`,
          boardingPoint: schedule.boardingPoint || schedule.origin,
          boardingPointAddress: schedule.boardingPointAddress,
          dropOffPoint: schedule.dropOffPoint || schedule.destination,
          dropOffPointAddress: schedule.dropOffPointAddress,
          seatLayout: schedule.seatLayout,
          unavailableSeats: schedule.unavailableSeats || [],
          note: schedule.note,
          description: schedule.description,
          transportationPhoto: schedule.transportationPhoto,
          boardingPointId: schedule.boardingPointId,
          boardingPointLats: schedule.boardingPointLats,
          boardingPointLongs: schedule.boardingPointLongs,
          boardingPointLists: normalizePointList(schedule.boardingPointLists ?? schedule.boardingPointList),
          dropOffPointId: schedule.dropOffPointId,
          dropOffPointLats: schedule.dropOffPointLats,
          dropOffPointLongs: schedule.dropOffPointLongs,
          dropOffPointLists: normalizePointList(
            schedule.dropOffPointLists ?? (schedule as unknown as { dropOffPointList?: unknown }).dropOffPointList
          ),
          priceForeigner: schedule.priceForeigner,
          nationRoad: schedule.nationRoad,
          scheduleType: schedule.scheduleType,
          slidePhoto: schedule.slidePhoto,
          snack: schedule.snack,
          status: schedule.status,
          steward: schedule.steward,
          discount: schedule.discount,
          disPercent: schedule.disPercent,
          airCon: schedule.airCon,
          allowPricePeriod: schedule.allowPricePeriod,
          amenities: schedule.amenities,
          wct: schedule.wct,
          wifi: schedule.wifi,
          transportRouteDisplay: schedule.transportRouteDisplay
        }))

        this.emptyData = false
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch schedules'
        this.schedules = []
        this.emptyData = true
        console.error('Error fetching schedules:', err)
      } finally {
        this.loading = false
      }
    },

    /**
     * Format time to HH:mm format (removes seconds if present)
     */
    formatTime(time: string): string {
      if (!time) return ''
      
      // If already in HH:mm format, return as is
      if (/^\d{2}:\d{2}$/.test(time)) {
        return time
      }
      
      // If it's HH:mm:ss format, remove seconds
      if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
        return time.substring(0, 5)
      }
      
      // If it's a full date-time string, extract time
      try {
        const date = new Date(time)
        if (!isNaN(date.getTime())) {
          const hours = date.getHours().toString().padStart(2, '0')
          const minutes = date.getMinutes().toString().padStart(2, '0')
          return `${hours}:${minutes}`
        }
      } catch (e) {
        // If parsing fails, try to extract time pattern
      }
      
      // Try to extract HH:mm pattern from string
      const timeMatch = time.match(/(\d{1,2}):(\d{2})/)
      if (timeMatch && typeof timeMatch[1] !== 'undefined' && typeof timeMatch[2] !== 'undefined') {
        const hours = timeMatch[1].padStart(2, '0')
        const minutes = timeMatch[2]
        return `${hours}:${minutes}`
      }
      
      return time
    },

    /**
     * Format duration to readable format
     */
    formatDuration(duration: string): string {
      if (!duration) return ''
      
      // If it's in HH:mm:ss or HH:mm format
      const timeMatch = duration.match(/(\d{1,2}):(\d{2})/)
      if (timeMatch) {
        const hours = parseInt(timeMatch[1] ?? '0')
        const minutes = parseInt(timeMatch[2] ?? '0')
        
        if (hours > 0 && minutes > 0) {
          return `${hours}h ${minutes}m`
        } else if (hours > 0) {
          return `${hours}h`
        } else if (minutes > 0) {
          return `${minutes}m`
        }
      }
      
      return duration
    },

    /**
     * Calculate duration between two times
     */
    calculateDuration(departureTime: string, arrivalTime: string): string {
      try {
        const depParts = departureTime.split(':').map(Number)
        const arrParts = arrivalTime.split(':').map(Number)

        if (depParts.length < 2 || arrParts.length < 2) {
          return 'N/A'
        }

        const [depHour, depMin] = depParts
        const [arrHour, arrMin] = arrParts

        if (depHour === undefined || depMin === undefined || arrHour === undefined || arrMin === undefined) {
          return 'N/A'
        }

        let totalMinutes = (arrHour * 60 + arrMin) - (depHour * 60 + depMin)

        // Handle overnight trips
        if (totalMinutes < 0) {
          totalMinutes += 24 * 60
        }

        const hours = Math.floor(totalMinutes / 60)
        const minutes = totalMinutes % 60

        return `${hours}h ${minutes}m`
      } catch {
        return 'N/A'
      }
    },

    /**
     * Clear schedules
     */
    clearSchedules() {
      this.schedules = []
      this.error = null
      this.emptyData = false
    },

    /**
     * Get schedule by ID
     */
    getScheduleById(id: string | number) {
      return this.schedules.find(s => s.id === String(id))
    },

    /**
     * Fetch seat layout by date and journey ID
     * @param date - The date from localStorage (format: YYYY-MM-DD)
     * @param journeyId - The journey ID from localStorage
     */
    async fetchSeatLayout(date: string, journeyId: string) {
      const { post } = useApi()

      try {
        const requestData = {
          date,
          journey: journeyId
        }

        console.log('Fetching seat layout with params:', requestData)

        const response = await post<SeatLayoutApiResponse>('/seat/layout', requestData)

        console.log('Seat layout API response:', response)

        if (!response) {
          throw new Error('No response from API')
        }

        const { header, body } = response.data

        if (!header.result) {
          throw new Error(header.message || 'Failed to fetch seat layout')
        }

        // Check if body has data
        if (!body || body.length === 0) {
          console.warn('No seat layout data in response')
          this.currentSeatLayout = {
            seatLayout: '[]',
            seatType: undefined,
            unavailableSeats: []
          }
          return this.currentSeatLayout
        }

        // Extract layout from first element (body is an array)
        const layoutData = body[0]
        
        if (!layoutData || !layoutData.layout) {
          throw new Error('Invalid seat layout data structure')
        }
        
        // Store the seat layout data
        this.currentSeatLayout = {
          seatLayout: layoutData.layout,
          seatType: layoutData.seatType,
          unavailableSeats: []
        }

        console.log('Parsed seat layout:', this.currentSeatLayout)

        return this.currentSeatLayout
      } catch (err) {
        this.seatLayoutError = err instanceof Error ? err.message : 'Failed to fetch seat layout'
        console.error('Error fetching seat layout:', err)
        return null
      }
    },

    /**
     * Fetch unavailable seats by date and journey ID
     * @param date - The date from localStorage (format: YYYY-MM-DD)
     * @param journeyId - The journey ID from localStorage
     */
    async fetchUnavailableSeats(date: string, journeyId: string) {
      const { post } = useApi()

      try {
        const requestData = {
          date,
          journey: journeyId
        }

        console.log('Fetching unavailable seats with params:', requestData)

        const response = await post<UnavailableSeatsApiResponse>('/seat/unavailable', requestData)

        console.log('Unavailable seats API response:', response)

        if (!response) {
          throw new Error('No response from API')
        }

        const { header, body } = response.data

        if (!header.result) {
          throw new Error(header.message || 'Failed to fetch unavailable seats')
        }

        // Handle empty data (API returns 0 when no unavailable seats)
        if (body === 0 || !body || !Array.isArray(body)) {
          console.log('No unavailable seats found')
          return []
        }

        const normalizeGender = (value: string | number | undefined | null) => {
          const strValue = value === undefined || value === null ? '' : String(value).trim()
          if (strValue === '1') return 'M'
          if (strValue === '2') return 'F'
          if (strValue.toLowerCase() === 'm') return 'M'
          if (strValue.toLowerCase() === 'f') return 'F'
          return strValue || undefined
        }

        // Extract seatNumber and gender from each object
        let unavailableSeats = body.map(seat => ({
          seatNumber: String(seat.seatNumber).trim(),
          gender: normalizeGender(seat.gender),
          status: seat.status
        }))
        
        console.log('Unavailable seats parsed:', unavailableSeats)
        console.log('Unavailable seats count:', unavailableSeats.length)
        console.log('Raw API body:', body)
        
        return unavailableSeats
      } catch (err) {
        console.error('Error fetching unavailable seats:', err)
        return []
      }
    },

    /**
     * Fetch both seat layout and unavailable seats
     * @param date - The date from localStorage (format: YYYY-MM-DD)
     * @param journeyId - The journey ID from localStorage
     */
    async fetchSeatLayoutWithUnavailableSeats(date: string, journeyId: string) {
      this.seatLayoutLoading = true
      this.seatLayoutError = null

      try {
        // Fetch both layout and unavailable seats in parallel
        const [layoutResult, unavailableSeats] = await Promise.all([
          this.fetchSeatLayout(date, journeyId),
          this.fetchUnavailableSeats(date, journeyId)
        ])

        // Update unavailable seats if we got layout result
        if (layoutResult && this.currentSeatLayout) {
          this.currentSeatLayout.unavailableSeats = unavailableSeats
        }

        return this.currentSeatLayout
      } catch (err) {
        this.seatLayoutError = err instanceof Error ? err.message : 'Failed to fetch seat data'
        console.error('Error fetching seat data:', err)
        return null
      } finally {
        this.seatLayoutLoading = false
      }
    },
    /**
     * Clear seat layout data
     */
    clearSeatLayout() {
      this.currentSeatLayout = null
      this.seatLayoutError = null
    }
  }
})

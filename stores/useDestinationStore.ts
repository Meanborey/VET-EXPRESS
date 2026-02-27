import { defineStore } from 'pinia'
import type { ApiDestination } from '~/types/api'

// API response structure matching old code: response.data.header + response.data.body
interface LegacyApiResponse<T> {
    header: {
        result: boolean
        statusCode: number
        message?: string
    }
    body: T | 0  // API returns 0 when no data
}

export interface Destination {
    id: string
    name: string
    nameEn?: string
    nameCn?: string
    code?: string
}

export interface SearchParams {
    origin: string
    destinationFrom: string  // Changed from originId
    destination: string
    destinationTo: string    // Changed from destinationId
    departDate: string
    returnDate: string
    nationally: string       // Added for API
    type: string
}

export const useDestinationStore = defineStore('destination', {
    state: () => ({
        origins: [] as Destination[],
        destinations: [] as Destination[],
        loading: false,
        error: null as string | null,
        emptyData: false,
        // Store current vehicle type
        currentType: '' as string,
        // Search parameters
        searchParams: {
            origin: '',
            destinationFrom: '',
            destination: '',
            destinationTo: '',
            departDate: '',
            returnDate: '',
            nationally: 'local',
            type: ''
        } as SearchParams
    }),

    getters: {
        isLoading: (state) => state.loading,
        hasError: (state) => state.error !== null,
        isEmpty: (state) => state.emptyData,

        // Get origin names for dropdown
        originNames: (state) => state.origins.map(o => o.name),

        // Get destination names for dropdown
        destinationNames: (state) => state.destinations.map(d => d.name),

        // Get origin by name
        getOriginByName: (state) => (name: string) =>
            state.origins.find(o => o.name.toLowerCase() === name.toLowerCase()),

        // Get destination by name
        getDestinationByName: (state) => (name: string) =>
            state.destinations.find(d => d.name.toLowerCase() === name.toLowerCase())
    },

    actions: {
        // Transform API response to Destination interface
        transformApiDestination(apiDest: ApiDestination): Destination {
            // Handle various field name formats the API might return
            const name = apiDest.name
                || apiDest.nameEn
                || apiDest.destinationName
                || apiDest.destination_name
                || apiDest.title
                || apiDest.nameKh
                || ''

            return {
                id: String(apiDest.id),
                name: name,
                nameEn: apiDest.nameEn,
                nameCn: apiDest.nameCn,
                code: apiDest.code
            }
        },

        // Get vehicle type from localStorage or default
        getType(): number {
            const defaultType = 1 // Default vehicle type
            return defaultType;
        },

        // Set search parameters
        setSearchParams(params: Partial<SearchParams>) {
            this.searchParams = { ...this.searchParams, ...params }
            // Store IDs in localStorage for API calls
            if (typeof localStorage !== 'undefined') {
                if (params.destinationFrom) localStorage.setItem('departureFromId', params.destinationFrom)
                if (params.destinationTo) localStorage.setItem('destinationToId', params.destinationTo)
                if (params.returnDate !== undefined) localStorage.setItem('returnDate', params.returnDate || '')
                if (params.type) localStorage.setItem('types', params.type)
                if (params.nationally) localStorage.setItem('nationally', params.nationally)
            }
        },



        // Set vehicle type
        setType(type: string) {
            this.currentType = type
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('types', type)
            }
        },

        /**
         * Fetch departure locations (origins) from API
         * POST to /destination/from with searchText and type
         */
        async fetchOrigins(searchText: string = '') {
            this.loading = true
            this.error = null
            this.emptyData = false

            try {
                const { post } = useApi()
                const response = await post<LegacyApiResponse<ApiDestination[]>>('/destination/from', {
                    searchText: searchText,
                    type: this.getType()
                })

                console.log('Fetch origins response:', response)

                if (response?.data) {
                    const result = response.data
                    // Match old code pattern: header.result && header.statusCode === 200
                    if (result.header?.result === true && result.header?.statusCode === 200) {
                        const body = result.body as unknown
                        // body can be 0 or empty array when no data
                        if (!body || body === 0 || (Array.isArray(body) && body.length === 0)) {
                            this.emptyData = true
                            this.origins = []
                        } else if (Array.isArray(body)) {
                            this.emptyData = false
                            this.origins = (body as ApiDestination[]).map((d: ApiDestination) => this.transformApiDestination(d))
                            console.log('Parsed origins:', this.origins)
                        } else {
                            this.emptyData = true
                            this.origins = []
                        }
                    } else {
                        this.error = result.header?.message || 'Failed to fetch origins'
                        this.emptyData = true
                    }
                }
            } catch (err) {
                this.error = err instanceof Error ? err.message : 'Failed to fetch origins'
                console.error('Fetch origins error:', err)
            } finally {
                this.loading = false
            }
        },

        /**
         * Fetch arrival locations (destinations) from API
         * POST to /destination/to with searchText, departureId, and type
         */
        async fetchDestinations(searchText: string = '', departureId?: string) {
            this.loading = true
            this.error = null
            this.emptyData = false

            try {
                const { post } = useApi()

                // Build request body
                const requestBody: Record<string, unknown> = {
                    searchText: searchText,
                    type: this.getType()
                }

                // Add fromId if provided (to get destinations for specific origin)
                if (departureId) {
                    requestBody.fromId = departureId
                }

                console.log('Fetching destinations with params:', requestBody)

                const response = await post<LegacyApiResponse<ApiDestination[]>>('/destination/to', requestBody)

                console.log('Fetch destinations response:', response)

                if (response?.data) {
                    const result = response.data
                    // Match old code pattern: header.result && header.statusCode === 200
                    if (result.header?.result === true && result.header?.statusCode === 200) {
                        const body = result.body as unknown
                        // body can be 0 or empty array when no data
                        if (!body || body === 0 || (Array.isArray(body) && body.length === 0)) {
                            this.emptyData = true
                            this.destinations = []
                        } else if (Array.isArray(body)) {
                            this.emptyData = false
                            this.destinations = (body as ApiDestination[]).map((d: ApiDestination) => this.transformApiDestination(d))
                            console.log('Parsed destinations:', this.destinations)
                        } else {
                            this.emptyData = true
                            this.destinations = []
                        }
                    } else {
                        this.error = result.header?.message || 'Failed to fetch destinations'
                        this.emptyData = true
                    }
                }
            } catch (err) {
                this.error = err instanceof Error ? err.message : 'Failed to fetch destinations'
                console.error('Fetch destinations error:', err)
            } finally {
                this.loading = false
            }
        },

        // Clear all data
        clearAll() {
            this.origins = []
            this.destinations = []
            this.error = null
            this.emptyData = false
        },

        // Clear error
        clearError() {
            this.error = null
        }
    }
})

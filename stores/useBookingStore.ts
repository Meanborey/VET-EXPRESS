import { defineStore } from 'pinia'
import type { Booking, BookingForm, BookingState, Destination } from '~/types/booking'
import type { BaseApiResponse } from '~/types/api'

export const useBookingStore = defineStore('booking', {
    state: (): BookingState => ({
        bookings: [
            {
                id: 'BK001',
                fullName: 'John Smith',
                phoneNumber: '+855 12 345 678',
                journeyType: 'round-trip',
                departure: 'phnom-penh',
                arrival: 'siem-reap',
                departureDate: '2026-02-15',
                amountOfCar: 1,
                remark: 'Need English speaking driver',
                vehicleId: 'luxury-van-h350',
                vehicleName: 'Hyundai Solati H-350',
                status: 'confirmed',
                createdAt: '2026-01-20T10:30:00Z',
                totalPrice: 180
            },
            {
                id: 'BK002',
                fullName: 'Sarah Johnson',
                phoneNumber: '+855 98 765 432',
                journeyType: 'one-way',
                departure: 'siem-reap',
                arrival: 'sihanoukville',
                departureDate: '2026-02-20',
                amountOfCar: 2,
                remark: 'Pickup from hotel at 8 AM',
                vehicleId: 'luxury-van-hiace',
                vehicleName: 'Luxury Van Hiace',
                status: 'pending',
                createdAt: '2026-01-21T14:20:00Z',
                totalPrice: 300
            },
            {
                id: 'BK003',
                fullName: 'Michael Chen',
                phoneNumber: '+855 77 888 999',
                journeyType: 'trip',
                departure: 'phnom-penh',
                arrival: 'battambang',
                departureDate: '2026-03-01',
                amountOfCar: 1,
                remark: 'Full day tour with stops at temples',
                vehicleId: 'luxury-coaster',
                vehicleName: 'Luxury Coaster',
                status: 'confirmed',
                createdAt: '2026-01-22T09:15:00Z',
                totalPrice: 250
            }
        ],
        currentBooking: null,
        destinations: [
            {
                id: 'phnom-penh',
                name: 'Phnom Penh',
                nameEn: 'Phnom Penh',
                nameCn: '金边'
            },
            {
                id: 'siem-reap',
                name: 'Siem Reap',
                nameEn: 'Siem Reap',
                nameCn: '暹粒'
            },
            {
                id: 'sihanoukville',
                name: 'Sihanoukville',
                nameEn: 'Sihanoukville',
                nameCn: '西哈努克市'
            },
            {
                id: 'battambang',
                name: 'Battambang',
                nameEn: 'Battambang',
                nameCn: '马德望'
            },
            {
                id: 'kampot',
                name: 'Kampot',
                nameEn: 'Kampot',
                nameCn: '贡布'
            },
            {
                id: 'kep',
                name: 'Kep',
                nameEn: 'Kep',
                nameCn: '白马'
            }
        ]
    }),

    getters: {
        getBookingById: (state) => {
            return (id: string): Booking | undefined => {
                return state.bookings.find(b => b.id === id)
            }
        },

        confirmedBookings: (state): Booking[] => {
            return state.bookings.filter(b => b.status === 'confirmed')
        },

        pendingBookings: (state): Booking[] => {
            return state.bookings.filter(b => b.status === 'pending')
        },

        totalBookings: (state): number => {
            return state.bookings.length
        },

        getDestinationById: (state) => {
            return (id: string): Destination | undefined => {
                return state.destinations.find(d => d.id === id)
            }
        }
    },

    actions: {
        // Step 4 & 5: Pinia action → API call (POST form-urlencoded + Bearer)
        async createBooking(bookingData: BookingForm, vehicleId: string, vehicleName: string): Promise<Booking> {
            try {
                const { post } = useApi()
                const response = await post<BaseApiResponse<Booking>>('/bookings', {
                    ...bookingData,
                    vehicleId,
                    vehicleName
                })
                
                // Step 6: State updated → Step 7: UI reactive
                if (response?.data?.data) {
                    this.bookings.push(response.data.data)
                    this.currentBooking = null
                    return response.data.data
                }
            } catch (err) {
                console.error('API Error, creating locally:', err)
            }
            
            // Fallback: create locally
            const newBooking: Booking = {
                id: `BK${String(this.bookings.length + 1).padStart(3, '0')}`,
                ...bookingData,
                vehicleId,
                vehicleName,
                status: 'pending',
                createdAt: new Date().toISOString()
            }

            this.bookings.push(newBooking)
            this.currentBooking = null
            return newBooking
        },

        async updateBookingStatus(bookingId: string, status: 'pending' | 'confirmed' | 'cancelled') {
            try {
                const { post } = useApi()
                await post<BaseApiResponse<Booking>>(`/bookings/${bookingId}/status`, { status })
            } catch (err) {
                console.error('API Error updating status:', err)
            }
            
            // Always update locally for UI reactivity
            const booking = this.bookings.find(b => b.id === bookingId)
            if (booking) {
                booking.status = status
            }
        },

        setCurrentBooking(booking: BookingForm) {
            this.currentBooking = booking
        },

        clearCurrentBooking() {
            this.currentBooking = null
        },

        deleteBooking(bookingId: string) {
            const index = this.bookings.findIndex(b => b.id === bookingId)
            if (index !== -1) {
                this.bookings.splice(index, 1)
            }
        },

        getBookingsByVehicle(vehicleId: string): Booking[] {
            return this.bookings.filter(b => b.vehicleId === vehicleId)
        }
    }
})

import { defineStore } from 'pinia'
import type { ConfirmBookingRequest, ConfirmBookingResponse } from '~/types/booking'

interface ConfirmSuccessInput {
    payload: ConfirmBookingRequest
    routeTitle: string
    vehicleType: string
    departDate: string
    departureTime: string
    seatNo: string
    totalFare: number
    tripType?: 'one-way' | 'round-trip'
    outboundRouteTitle?: string
    returnRouteTitle?: string
    outboundVehicleType?: string
    returnVehicleType?: string
    outboundDepartDate?: string
    returnDepartDate?: string
    outboundDepartureTime?: string
    returnDepartureTime?: string
    outboundSeats?: string
    returnSeats?: string
    outboundSeatCount?: number
    returnSeatCount?: number
    outboundGenders?: string[]
    returnGenders?: string[]
    outboundNationalities?: string[]
    returnNationalities?: string[]
    email?: string
    genders?: string[]
    nationalities?: string[]
    firstGender?: string
    firstNationality?: string
}

interface PaymentNavigateTarget {
    path: '/payment'
    query: Record<string, string>
}

const getResponseString = (response: Record<string, unknown>, keys: string[]): string => {
    for (const key of keys) {
        const value = response[key]
        if (typeof value === 'string' && value.trim()) return value.trim()
        if (typeof value === 'number' && Number.isFinite(value)) return String(value)
    }
    return ''
}

export const usePassengerPaymentStore = defineStore('passengerPayment', {
    state: () => ({
        isSubmitting: false,
        paymentError: '',
        paymentSuccess: ''
    }),

    actions: {
        clearMessages() {
            this.paymentError = ''
            this.paymentSuccess = ''
        },

        setPaymentError(message: string) {
            this.paymentError = message
        },

        async confirmBookingAndBuildPaymentTarget(input: ConfirmSuccessInput): Promise<PaymentNavigateTarget | null> {
            this.isSubmitting = true
            this.clearMessages()

            try {
                const bookingStore = useBookingStore()
                const response = await bookingStore.confirmBooking(input.payload)

                if (!response) {
                    this.paymentError = 'Booking confirmation failed. Please try again.'
                    return null
                }

                if (Number(response.status) !== 1) {
                    this.paymentSuccess = response.message || 'Booking confirmed successfully.'
                    return null
                }

                const responseRecord = response as unknown as Record<string, unknown>
                const resolvedOrderId = getResponseString(responseRecord, [
                    'transactionId',
                    'transaction_id',
                    'bookingCode',
                    'orderId',
                    'bookingId',
                    'booking_code',
                    'order_id'
                ])

                const paymentQuery: Record<string, string> = {
                    routeTitle: input.routeTitle,
                    vehicleType: input.vehicleType,
                    departDate: input.departDate,
                    departureTime: input.departureTime,
                    seatNo: input.seatNo,
                    totalFare: String(input.totalFare)
                }

                if (resolvedOrderId) {
                    paymentQuery.orderId = resolvedOrderId
                    paymentQuery.bookingCode = resolvedOrderId

                    if (typeof localStorage !== 'undefined') {
                        localStorage.setItem('lastOrderId', resolvedOrderId)
                    }
                }

                if (input.email?.trim()) paymentQuery.email = input.email.trim()
                if (input.tripType) paymentQuery.tripType = input.tripType
                if (input.outboundRouteTitle) paymentQuery.outboundRouteTitle = input.outboundRouteTitle
                if (input.returnRouteTitle) paymentQuery.returnRouteTitle = input.returnRouteTitle
                if (input.outboundVehicleType) paymentQuery.outboundVehicleType = input.outboundVehicleType
                if (input.returnVehicleType) paymentQuery.returnVehicleType = input.returnVehicleType
                if (input.outboundDepartDate) paymentQuery.outboundDepartDate = input.outboundDepartDate
                if (input.returnDepartDate) paymentQuery.returnDepartDate = input.returnDepartDate
                if (input.outboundDepartureTime) paymentQuery.outboundDepartureTime = input.outboundDepartureTime
                if (input.returnDepartureTime) paymentQuery.returnDepartureTime = input.returnDepartureTime
                if (input.outboundSeats) paymentQuery.outboundSeats = input.outboundSeats
                if (input.returnSeats) paymentQuery.returnSeats = input.returnSeats
                if (typeof input.outboundSeatCount === 'number') paymentQuery.outboundSeatCount = String(input.outboundSeatCount)
                if (typeof input.returnSeatCount === 'number') paymentQuery.returnSeatCount = String(input.returnSeatCount)
                if (input.outboundGenders && input.outboundGenders.length > 0) paymentQuery.outboundGenders = input.outboundGenders.join(',')
                if (input.returnGenders && input.returnGenders.length > 0) paymentQuery.returnGenders = input.returnGenders.join(',')
                if (input.outboundNationalities && input.outboundNationalities.length > 0) paymentQuery.outboundNationalities = input.outboundNationalities.join(',')
                if (input.returnNationalities && input.returnNationalities.length > 0) paymentQuery.returnNationalities = input.returnNationalities.join(',')
                if (input.genders && input.genders.length > 0) paymentQuery.genders = input.genders.join(',')
                if (input.nationalities && input.nationalities.length > 0) paymentQuery.nationalities = input.nationalities.join(',')
                if (input.firstGender) paymentQuery.gender = input.firstGender
                if (input.firstNationality) paymentQuery.nationality = input.firstNationality

                return {
                    path: '/payment',
                    query: paymentQuery
                }
            } catch (error) {
                this.paymentError = error instanceof Error ? error.message : 'Booking confirmation failed.'
                return null
            } finally {
                this.isSubmitting = false
            }
        }
    }
})

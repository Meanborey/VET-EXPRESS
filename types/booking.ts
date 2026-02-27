export interface BookingForm {
  fullName: string
  phoneNumber: string
  journeyType: 'one-way' | 'round-trip' | 'trip'
  departure: string
  arrival: string
  departureDate: string
  amountOfCar: number
  remark: string
}

export interface Booking extends BookingForm {
  id: string
  vehicleId: string
  vehicleName: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
  totalPrice?: number
}

export interface BookingState {
  bookings: Booking[]
  currentBooking: BookingForm | null
  destinations: Destination[]
}

export interface ConfirmBookingRequest {
  boardingPointId: number[]
  dropOffId: number[]
  journeyDate: string[]
  journeyId: string[]
  journeyType: number
  nationally: number
  seatGender: number[]
  seatJourney: string[]
  seatNum: string[]
  seatPrice: number[]
  totalAmount: number
  totalDiscount: number
  totalSeat: string
  couponCode?: string
  email?: string
  isUseLuckyDraw?: number
  packageTravelCode?: string
  seatDob?: string[]
  seatName?: string[]
  seatNationallyId?: number[]
  seatPassport?: string[]
  session?: string
  telephone?: string
}

export interface ConfirmBookingResponse {
  bookingCode?: string
  paymentUrl?: string
  message?: string
  [key: string]: unknown
}

export interface Destination {
  id: string
  name: string
  nameEn: string
  nameCn: string
}

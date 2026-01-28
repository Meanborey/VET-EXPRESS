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

export interface Destination {
  id: string
  name: string
  nameEn: string
  nameCn: string
}

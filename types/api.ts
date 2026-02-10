/**
 * API Service Types
 * Shared types for API responses
 */

// Base API response wrapper
export interface BaseApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

// Schedule types
export interface ApiSchedule {
  id: string
  transportationType: string
  transportationPhoto?: string
  type: number
  vehicleType: number
  departure: string
  arrival: string
  duration: string
  seatAvailable: number
  totalSeat: number
  priceOriginal: number
  priceForeigner?: number
  price: number
  origin: string
  destination: string
  departDate: string
  routeInfo?: string
  description?: string
  note?: string
  boardingPoint: string
  boardingPointAddress?: string
  boardingPointId?: string
  boardingPointLats?: string
  boardingPointLongs?: string
  boardingPointList?: any[]
  boardingPointLists?: any[]
  dropOffPoint: string
  dropOffPointAddress?: string
  dropOffPointId?: string
  dropOffPointLats?: string
  dropOffPointLongs?: string
  dropOffPointLists?: any[]
  seatLayout?: string
  unavailableSeats?: Array<string | { seatNumber: string; gender?: string; status?: number }>
  nationRoad?: string
  scheduleType?: number
  slidePhoto?: any[]
  snack?: number
  status?: number
  steward?: number
  discount?: number
  disPercent?: string
  airCon?: number
  allowPricePeriod?: number
  amenities?: any[]
  wct?: number
  wifi?: number
  transportRouteDisplay?: string
}

// Destination types
export interface ApiDestination {
  id: string | number
  name?: string
  nameEn?: string
  nameCn?: string
  nameKh?: string
  code?: string
  // Alternative field names the API might use
  destinationName?: string
  destination_name?: string
  title?: string
}

// Booking types
export interface ApiBooking {
  id: string | number
  bookingCode?: string
  passengerName: string
  phoneNumber: string
  email?: string
  seatNumbers: string[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  createdAt: string
}

// Vehicle types
export interface ApiVehicle {
  id: string | number
  name: string
  type: string
  capacity: number
  description?: string
  images?: string[]
  pricePerDay?: number
}

// Flash Sale types
export interface ApiFlashSale {
  id: string | number
  title: string
  price: number
  oldPrice: number
  period: string
  icon?: string
}

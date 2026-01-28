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
  id: string | number
  vehicleName: string
  vehicleType: string
  departureTime: string
  arrivalTime: string
  duration?: string
  availableSeats: number
  totalSeats: number
  originalPrice: number
  price: number
  origin: string
  destination: string
  departDate: string
  boardingPoint?: string
  dropOffPoint?: string
  seatLayout?: string
  unavailableSeats?: string[]
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

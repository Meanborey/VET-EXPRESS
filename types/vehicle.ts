export interface Vehicle {
  id: string
  name: string
  description?: string
  images: string[]
  capacity?: number
  features?: string[]
  pricePerDay?: number
  available?: boolean
}

export interface VehicleState {
  vehicles: Vehicle[]
  currentVehicleId: string | null
  currentImageIndex: number
}

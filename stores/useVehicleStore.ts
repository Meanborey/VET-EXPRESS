import { defineStore } from 'pinia'
import type { Vehicle, VehicleState } from '~/types/vehicle'
import type { BaseApiResponse } from '~/types/api'

export const useVehicleStore = defineStore('vehicle', {
    state: (): VehicleState => ({
        vehicles: [
            {
                id: 'luxury-van-h350',
                name: 'Hyundai Solati H-350',
                description: 'Premium luxury van with comfortable seating and modern amenities',
                capacity: 16,
                pricePerDay: 180,
                available: true,
                features: ['Air Conditioning', 'Leather Seats', 'Entertainment System', 'WiFi'],
                images: [
                    '/images/gallery/vet/Luxury_Van-H350/Slide/Classic Hyundai Solati H350-01.jpg',
                    '/images/gallery/vet/Luxury_Van-H350/Slide/Classic Hyundai Solati H350-04.jpg',
                    '/images/gallery/vet/Luxury_Van-H350/Slide/Classic Hyundai Solati H350-03.jpg',
                    '/images/gallery/vet/Luxury_Van-H350/Slide/Classic Hyundai Solati H350-05.jpg',

                ]
            },
            //     {
            //     id: 'luxury-van-hiace',
            //     name: 'Luxury Van Hiace',
            //     description: 'Elegant Toyota Hiace with premium interior design',
            //     capacity: 10,
            //     pricePerDay: 150,
            //     available: true,
            //     features: ['Air Conditioning', 'Reclining Seats', 'USB Charging', 'Mini Bar'],
            //     images: [
            //       '/images/gallery/vet/Luxury-Van-Hiace/Slide/slide1.jpg',
            //       '/images/gallery/vet/Luxury-Van-Hiace/Slide/slide2.jpg',
            //       '/images/gallery/vet/Luxury-Van-Hiace/Slide/slide3.jpg',
            //     ]
            //   },
            //   {
            //     id: 'air-bus',
            //     name: 'Air Bus',
            //     description: 'Spacious air-conditioned bus for large groups and long-distance travel',
            //     capacity: 45,
            //     pricePerDay: 350,
            //     available: true,
            //     features: ['Air Conditioning', 'Reclining Seats', 'Entertainment System', 'Restroom', 'WiFi'],
            //     images: [
            //       '/images/gallery/vet/Air_Bus/Slide/slide1.jpg',
            //       '/images/gallery/vet/Air_Bus/Slide/slide2.jpg',
            //       '/images/gallery/vet/Air_Bus/Slide/slide3.jpg',
            //     ]
            //   },
            //   {
            //     id: 'hotel-bus',
            //     name: 'Hotel Bus',
            //     description: 'Premium sleeper bus with hotel-like amenities for overnight journeys',
            //     capacity: 24,
            //     pricePerDay: 450,
            //     available: true,
            //     features: ['Sleeper Beds', 'Air Conditioning', 'Entertainment System', 'WiFi', 'Restroom', 'Mini Bar'],
            //     images: [
            //       '/images/gallery/vet/Hotel_Bus/Slide/slide1.jpg',
            //       '/images/gallery/vet/Hotel_Bus/Slide/slide2.jpg',
            //       '/images/gallery/vet/Hotel_Bus/Slide/slide3.jpg',
            //     ]
            //   },
            //   {
            //     id: 'luxury-coaster',
            //     name: 'Luxury Coaster',
            //     description: 'Comfortable mid-size bus perfect for group tours',
            //     capacity: 29,
            //     pricePerDay: 250,
            //     available: true,
            //     features: ['Air Conditioning', 'Comfortable Seats', 'Entertainment System', 'USB Charging'],
            //     images: [
            //       '/images/gallery/vet/Luxury_Coaster/Slide/slide1.jpg',
            //       '/images/gallery/vet/Luxury_Coaster/Slide/slide2.jpg',
            //       '/images/gallery/vet/Luxury_Coaster/Slide/slide3.jpg',
            //     ]
            //   },
            //   {
            //     id: 'luxury-hotel-bus',
            //     name: 'Luxury Hotel Bus',
            //     description: 'Ultimate luxury sleeper bus with first-class amenities',
            //     capacity: 20,
            //     pricePerDay: 550,
            //     available: true,
            //     features: ['Private Cabins', 'Full Beds', 'Air Conditioning', 'WiFi', 'Entertainment', 'Premium Restroom'],
            //     images: [
            //       '/images/gallery/vet/Luxury_Hotel_Bus/Slide/slide1.jpg',
            //       '/images/gallery/vet/Luxury_Hotel_Bus/Slide/slide2.jpg',
            //       '/images/gallery/vet/Luxury_Hotel_Bus/Slide/slide3.jpg',
            //     ]
            //   },
            //   {
            //     id: 'speed-boat',
            //     name: 'Speed Boat',
            //     description: 'Fast and comfortable water transportation for coastal and island travel',
            //     capacity: 12,
            //     pricePerDay: 400,
            //     available: true,
            //     features: ['Life Jackets', 'Covered Seating', 'GPS Navigation', 'First Aid Kit'],
            //     images: [
            //       '/images/gallery/vet/SpeedBoat/Slide/slide1.jpg',
            //       '/images/gallery/vet/SpeedBoat/Slide/slide2.jpg',
            //       '/images/gallery/vet/SpeedBoat/Slide/slide3.jpg',
            //     ]
            //   }
        ],
        currentVehicleId: null,
        currentImageIndex: 0
    }),

    getters: {
        currentVehicle: (state): Vehicle | null => {
            if (!state.currentVehicleId) {
                return state.vehicles[0] || null
            }
            return state.vehicles.find(v => v.id === state.currentVehicleId) || null
        },

        availableVehicles: (state): Vehicle[] => {
            return state.vehicles.filter(v => v.available)
        },

        getVehicleById: (state) => {
            return (id: string): Vehicle | undefined => {
                return state.vehicles.find(v => v.id === id)
            }
        }
    },

    actions: {
        // Step 4 & 5: Pinia action → API call (POST form-urlencoded + Bearer)
        async fetchVehicles() {
            try {
                const { post } = useApi()
                const response = await post<BaseApiResponse<Vehicle[]>>('/vehicles')
                
                // Step 6: State updated → Step 7: UI reactive
                if (response?.data?.data) {
                    this.vehicles = response.data.data
                }
            } catch (err) {
                console.error('API Error, using local data:', err)
                // Keep using default dummy data
            }
        },

        setCurrentVehicle(vehicleId: string) {
            this.currentVehicleId = vehicleId
            this.currentImageIndex = 0
        },

        setCurrentVehicleByIndex(index: number) {
            if (index >= 0 && index < this.vehicles.length) {
                const vehicle = this.vehicles[index]
                if (vehicle) {
                    this.currentVehicleId = vehicle.id
                    this.currentImageIndex = 0
                }
            }
        },

        setCurrentImageIndex(index: number) {
            this.currentImageIndex = index
        },

        nextImage() {
            const vehicle = this.currentVehicle
            if (vehicle && this.currentImageIndex < vehicle.images.length - 1) {
                this.currentImageIndex++
            }
        },

        previousImage() {
            if (this.currentImageIndex > 0) {
                this.currentImageIndex--
            }
        },

        updateVehicleAvailability(vehicleId: string, available: boolean) {
            const vehicle = this.vehicles.find(v => v.id === vehicleId)
            if (vehicle) {
                vehicle.available = available
            }
        }
    }
})

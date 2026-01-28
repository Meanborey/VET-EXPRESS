<template>
    <div class="min-h-screen bg-gray-50 py-12">
        <div class="container mx-auto">
            <!-- Service Header -->
            <div class="text-center mb-8">
                <p class="text-orange-500 text-sm font-medium uppercase tracking-wide mb-2">
                    {{ t('service') }}
                </p>
                <h1 class="text-4xl font-bold text-gray-900 mb-4">
                    {{ t('vehicleRentalInCambodiaVietnamThailand') }}
                </h1>
                <p class="text-gray-600 max-w-3xl mx-auto mb-6">
                 {{ t('footerDescription') }}
                </p>

                <!-- Telegram Button -->
                <div class="flex items-center justify-center gap-2 mb-12">
                    <span class="text-gray-700">Ask info or book via</span>
                    <a href="https://t.me/yourhandle" target="_blank"
                        class="inline-flex items-center gap-2 px-4 py-2 border border-blue-400 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path
                                d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.86 8.766c-.14.642-.512.801-1.037.498l-2.867-2.112-1.382 1.33c-.153.153-.28.28-.575.28l.205-2.91 5.297-4.787c.23-.205-.05-.318-.357-.113l-6.544 4.123-2.82-.88c-.614-.192-.626-.614.128-.91l11.021-4.25c.512-.192.961.128.795.91z" />
                        </svg>
                        Telegram
                    </a>
                </div>
            </div>

            <!-- Vehicle Card -->
            <div v-if="currentVehicle" class="mx-auto">
                <div class="grid md:grid-cols-2 gap-8 p-8">
                    <!-- Image Carousel -->
                    <div class="relative">
                        <div class="relative aspect-[4/3] rounded-lg overflow-hidden">
                            <img 
                                :src="currentVehicle.images[vehicleStore.currentImageIndex]"
                                :alt="currentVehicle.name" 
                                class="w-full h-full object-cover" 
                            />

                            <!-- Carousel Dots -->
                            <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                <button
                                    v-for="(image, index) in currentVehicle.images" 
                                    :key="index"
                                    @click="vehicleStore.setCurrentImageIndex(index)" 
                                    :class="[
                                        'w-2 h-2 rounded-full transition-all',
                                        vehicleStore.currentImageIndex === index ? 'bg-white w-8' : 'bg-white/50'
                                    ]" 
                                />
                            </div>

                            <!-- Navigation Arrows (Optional) -->
                            <button
                                v-if="vehicleStore.currentImageIndex > 0"
                                @click="vehicleStore.previousImage"
                                class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                            >
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                                </svg>
                            </button>
                            <button
                                v-if="vehicleStore.currentImageIndex < currentVehicle.images.length - 1"
                                @click="vehicleStore.nextImage"
                                class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                            >
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Vehicle Info -->
                    <div class="flex flex-col">
                        <h2 class="text-3xl font-bold text-gray-900 mb-4">
                            {{ currentVehicle.name }}
                        </h2>

                        <NuxtLink 
                            to="/vehicle-rental/booking"
                            @click="handleBookingClick"
                            class="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors w-fit"
                        >
                            {{ t('reservationNow') }}
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useVehicleStore } from '~/stores/useVehicleStore'
const { t } = useI18n()

const vehicleStore = useVehicleStore()

// Get current vehicle from store
const currentVehicle = computed(() => vehicleStore.currentVehicle)

// Initialize with first vehicle on mount
onMounted(() => {
    if (!vehicleStore.currentVehicleId && vehicleStore.vehicles.length > 0) {
        vehicleStore.setCurrentVehicleByIndex(0)
    }
})

// Handle booking navigation - store will persist the current vehicle
const handleBookingClick = () => {
    // The vehicle data is already in the store and will be available on the booking page
    console.log('Navigating to booking with vehicle:', currentVehicle.value?.name)
}
</script>

<style scoped>
/* Add any additional custom styles here */
</style>

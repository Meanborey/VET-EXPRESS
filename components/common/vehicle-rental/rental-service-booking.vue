<template>
    <div class="w-full bg-gray-50 py-12">
        <div class="container mx-auto">
                <h2 class="text-2xl font-bold mb-8">{{ t('bookingdetail') }}</h2>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Left Side - Form -->
                    <div class="lg:col-span-2">
                        <form @submit.prevent="handleSubmit">
                            <!-- Full Name & Phone Number Row -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        {{ t('fullName') }} <span class="text-red-500">*</span>
                                    </label>
                                    <input v-model="formData.fullName" type="text" :placeholder="t('fullName')"
                                        class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        required />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        {{ t('phoneNumber') }}<span class="text-red-500">*</span>
                                    </label>
                                    <input v-model="formData.phoneNumber" type="tel" :placeholder="t('phoneNumber')"
                                        class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        required />
                                </div>
                            </div>

                            <!-- Journey Type -->
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-700 mb-3">
                                    {{ t('journeyType') }} <span class="text-red-500">*</span>
                                </label>
                                <div class="flex gap-6">
                                    <label class="flex items-center cursor-pointer">
                                        <input v-model="formData.journeyType" type="radio" value="one-way"
                                            class="w-4 h-4 text-orange-500 focus:ring-orange-500" />
                                        <span class="ml-2 text-gray-700">{{ t('oneWay') }}</span>
                                    </label>
                                    <label class="flex items-center cursor-pointer">
                                        <input v-model="formData.journeyType" type="radio" value="round-trip"
                                            class="w-4 h-4 text-orange-500 focus:ring-orange-500" />
                                        <span class="ml-2 text-gray-700">{{ t('roundTrip') }}</span>
                                    </label>
                                    <label class="flex items-center cursor-pointer">
                                        <input v-model="formData.journeyType" type="radio" value="trip"
                                            class="w-4 h-4 text-orange-500 focus:ring-orange-500" />
                                        <span class="ml-2 text-gray-700">{{ t('trip') }}</span>
                                    </label>
                                </div>
                            </div>

                            <!-- Destination -->
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    {{ t('destination') }} <span class="text-red-500">*</span>
                                </label>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <select v-model="formData.departure"
                                        class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                                        required>
                                        <option value="" disabled>{{ t('selectDeparture') }}</option>
                                        <option v-for="destination in bookingStore.destinations" :key="destination.id" :value="destination.id">
                                            {{ destination.name }}
                                        </option>
                                    </select>
                                    <select v-model="formData.arrival"
                                        class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                                        required>
                                        <option value="" disabled>{{ t('selectArrival') }}</option>
                                        <option v-for="destination in bookingStore.destinations" :key="destination.id" :value="destination.id">
                                            {{ destination.name }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <!-- Departure Date -->
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    {{ t('departureDate') }} <span class="text-red-500">*</span>
                                </label>
                                <input v-model="formData.departureDate" type="date"
                                    class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    required />
                            </div>

                            <!-- Amount of car -->
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    {{ t('amountOfCar') }} <span class="text-red-500">*</span>
                                </label>
                                <input v-model="formData.amountOfCar" type="number" min="1" :placeholder="t('amountOfCar')"
                                    class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    required />
                            </div>

                            <!-- Remark -->
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    {{ t('remark') }}
                                </label>
                                <textarea v-model="formData.remark" :placeholder="t('remark')" rows="4"
                                    class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"></textarea>
                            </div>
                        </form>
                    </div>

                    <!-- Right Side - Vehicle Details -->
                    <div class="lg:col-span-1">
                        <div class="sticky top-8">
                            <div class="mb-4">
                                <p class="text-sm text-gray-600">
                                    {{ t('vehicleType') }}: <span class="font-semibold text-gray-900">{{ vehicleType }}</span>
                                </p>
                            </div>

                            <!-- Vehicle Image with Carousel -->
                            <div class="relative mb-6 rounded-lg overflow-hidden">
                                <img :src="currentImage" :alt="vehicleType" class="w-full h-64 object-cover" />

                                <!-- Carousel Dots -->
                                <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                    <button v-for="(image, index) in images" :key="index"
                                        @click="currentImageIndex = index" :class="[
                                            'w-2 h-2 rounded-full transition-all',
                                            currentImageIndex === index ? 'bg-white w-3' : 'bg-white/60'
                                        ]"></button>
                                </div>
                            </div>

                            <!-- Save Button -->
                            <button @click="handleSubmit"
                                class="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-md transition-colors duration-200">
                                {{ t('save') }}
                            </button>
                        </div>
                    </div>
                </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useVehicleStore } from '~/stores/useVehicleStore'
import { useBookingStore } from '~/stores/useBookingStore'
import type { BookingForm } from '~/types/booking'

const { t } = useI18n()
const vehicleStore = useVehicleStore()
const bookingStore = useBookingStore()

// Get current vehicle from store
const currentVehicle = computed(() => vehicleStore.currentVehicle)
const vehicleType = computed(() => currentVehicle.value?.name || 'Hyundai Solati H-350')
const images = computed(() => currentVehicle.value?.images || ['/images/gallery/vet/Luxury_Van-H350/Slide/1.jpg'])

// Form data with TypeScript type
const formData = ref<BookingForm>({
    fullName: '',
    phoneNumber: '',
    journeyType: 'one-way',
    departure: '',
    arrival: '',
    departureDate: '',
    amountOfCar: 1,
    remark: ''
})

// Image carousel
const currentImageIndex = ref(0)

const currentImage = computed(() => {
    return images.value[currentImageIndex.value] || images.value[0]
})

// Load dummy data on mount (for testing)
onMounted(() => {
    // Uncomment to pre-fill form with dummy data for testing
    // loadDummyData()
})

// Load dummy booking data
const loadDummyData = () => {
    formData.value = {
        fullName: 'John Doe',
        phoneNumber: '+855 12 345 678',
        journeyType: 'round-trip',
        departure: 'phnom-penh',
        arrival: 'siem-reap',
        departureDate: '2026-02-15',
        amountOfCar: 1,
        remark: 'Please arrange pickup from hotel'
    }
}

// Handle form submission
const handleSubmit = () => {
    if (!currentVehicle.value) {
        console.error('No vehicle selected')
        return
    }

    // Create booking using the store
    const newBooking = bookingStore.createBooking(
        formData.value,
        currentVehicle.value.id,
        currentVehicle.value.name
    )

    console.log('Booking created:', newBooking)
    console.log('Total bookings in store:', bookingStore.bookings.length)
    
    // Show success message
    alert(`Booking successful! Booking ID: ${newBooking.id}`)
    
    // Reset form
    resetForm()
}

// Reset form
const resetForm = () => {
    formData.value = {
        fullName: '',
        phoneNumber: '',
        journeyType: 'one-way',
        departure: '',
        arrival: '',
        departureDate: '',
        amountOfCar: 1,
        remark: ''
    }
}
</script>

<style scoped>
/* Custom radio button styling */
input[type="radio"] {
    accent-color: #f97316;
}

/* Custom select dropdown arrow */
select {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
}
</style>

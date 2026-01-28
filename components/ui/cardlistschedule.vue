<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
    <!-- Schedule Info -->
    <div class="flex items-center justify-between mb-4">
      <!-- Vehicle Info -->
      <div class="flex items-center gap-4">
        <!-- Vehicle Image -->
        <div class="w-32 h-24 flex-shrink-0">
          <img :src="schedule.vehicleImage" :alt="schedule.vehicleName" class="w-full h-full object-contain" />
        </div>

        <!-- Bus Type Icon and Details -->
        <div class=" gap-3">
          <div class="w-8 h-8 rounded flex items-center justify-center flex-shrink-0">
            <img :src="schedule.vehicleIcon" :alt="schedule.vehicleType" class="w-full h-full" />
              <!-- <img src="@/assets/images/vireak-buntham.png" class="w-8 h-8" /> -->
          </div>
          <div>
            <h3 class="font-semibold text-gray-800 text-lg">
              {{ schedule.vehicleName }}
            </h3>
            <p class="text-sm text-gray-500">{{ schedule.routeInfo }}</p>
          </div>
        </div>
      </div>

      <!-- Time and Price Info -->
      <div class="flex items-center gap-8">
        <!-- Time Info -->
        <div class="flex items-center gap-4">
          <div class="text-center">
            <p class="text-xs text-gray-500 mb-1">Departure</p>
            <p class="text-2xl font-bold text-gray-800">{{ schedule.departureTime }}</p>
          </div>

          <div class="text-center px-4">
            <p class="text-xs text-gray-500 mb-1">Duration</p>
            <div class="flex items-center gap-2">
              <div class="h-px w-12 bg-gray-300"></div>
              <p class="text-sm font-medium text-gray-600">{{ schedule.duration }}</p>
              <div class="h-px w-12 bg-gray-300"></div>
            </div>
          </div>

          <div class="text-center">
            <p class="text-xs text-gray-500 mb-1">Arrival</p>
            <p class="text-2xl font-bold text-gray-800">{{ schedule.arrivalTime }}</p>
          </div>
        </div>

        <!-- Price and Seats -->
        <div class="text-right">
          <p class="text-sm text-gray-500 mb-1">{{ schedule.availableSeats }}/{{ schedule.totalSeats }} Seats</p>
          <div class="flex items-center justify-end gap-2">
            <span class="text-gray-400 line-through text-sm">${{ schedule.originalPrice }}</span>
            <span class="text-2xl font-bold text-orange-600">${{ schedule.price }}</span>
          </div>
        </div>

        <!-- Book Now Button -->
        <button @click="handleBookNow"
          class="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-colors whitespace-nowrap">
          Book Now
        </button>
      </div>
    </div>

    <!-- Boarding and Drop Off Info -->
    <div class="flex items-center justify-between pt-4 border-t border-gray-200">
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clip-rule="evenodd" />
          </svg>
          <span class="font-medium">Boarding:</span>
          <span>{{ schedule.boardingPoint }}</span>
        </div>

        <div class="flex items-center gap-2 text-sm text-gray-600">
          <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clip-rule="evenodd" />
          </svg>
          <span class="font-medium">Drop Off:</span>
          <span>{{ schedule.dropOffPoint }}</span>
        </div>
      </div>

      <!-- Trip Info Button -->
      <button @click="handleTripInfo"
        class="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 transition-colors">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd" />
        </svg>
        <span>Trip Info</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Schedule {
  id: string
  vehicleImage: string
  vehicleIcon: string
  vehicleName: string
  vehicleType: string
  routeInfo: string
  departureTime: string
  duration: string
  arrivalTime: string
  availableSeats: number
  totalSeats: number
  originalPrice: number
  price: number
  boardingPoint: string
  dropOffPoint: string
}

interface Props {
  schedule: Schedule
}

const props = defineProps<Props>()

const emit = defineEmits<{
  bookNow: [schedule: Schedule]
  tripInfo: [schedule: Schedule]
}>()

const handleBookNow = () => {
  emit('bookNow', props.schedule)
}

const handleTripInfo = () => {
  emit('tripInfo', props.schedule)
}
</script>

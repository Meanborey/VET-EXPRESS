<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
    <!-- Schedule Info -->
    <div class="flex items-center justify-between mb-4">
      <!-- Info -->
      <div class="flex items-center gap-4">
        <!-- Image -->
        <div class="w-44 h-24 flex-shrink-0">
          <img :src="schedule.transportationPhoto" :alt="schedule.transportationType"
            class="w-full h-full object-contain" />
        </div>

        <!-- Bus Type Icon and Details -->
        <div class=" gap-3">
          <div class="w-8 h-8 rounded flex items-center justify-center flex-shrink-0">
            <img v-if="schedule.scheduleType == 1" src="@/assets/images/schedulelist/vireak-buntham.png"
              class="w-8 h-8" />
            <img v-if="schedule.scheduleType == 3" src="@/assets/images/schedulelist/airbus.png" class="w-8 h-8" />
            <img v-if="schedule.scheduleType == 4" src="@/assets/images/schedulelist/vet-laos.svg" class="w-8 h-8" />

          </div>
          <div>
            <h3 class="font-semibold text-gray-800 text-lg">
              {{ schedule.transportationType }}
            </h3>
            <p class="text-sm text-gray-500">{{ schedule.transportRouteDisplay }} - {{ schedule.nationRoad }}</p>
          </div>
        </div>
      </div>

      <!-- Time Info -->
      <div class="flex items-center gap-4">
        <div class="text-center">
          <p class="text-xs text-gray-500 mb-1">Departure</p>
          <p class="text-base font-semibold text-gray-800">{{ formatTime(schedule.departure) }}</p>
        </div>

        <div class="text-center px-4">
          <p class="text-xs text-gray-500 mb-1">Duration</p>
          <div class="flex items-center gap-2">
            <div class="h-px w-12 bg-gray-300"></div>
            <p class="text-sm font-medium text-gray-600">{{ formatTime(schedule.duration) }}h</p>
            <div class="h-px w-12 bg-gray-300"></div>
          </div>
        </div>

        <div class="text-center">
          <p class="text-xs text-gray-500 mb-1">Arrival</p>
          <p class="text-base font-semibold text-gray-800">{{ formatTime(schedule.arrival) }}</p>
        </div>
      </div>
      <!-- Time and Price Info -->
      <div class="flex items-center gap-8">
        <!-- Price and Seats -->
        <div class="text-right">
          <!-- <p class="text-sm text-gray-500 mb-1">{{ schedule.totalSeat - schedule.seatAvailable }}/{{ schedule.totalSeat
          }} Seats</p> -->
           <p v-if="schedule.status === 1" class="text-sm text-gray-500 mb-1">{{schedule.totalSeat - schedule.seatAvailable}}/{{ schedule.totalSeat}} Seats</p>
            <p v-else-if="schedule.status === 2" class="text-sm text-gray-500 mb-1">{{schedule.seatAvailable}}/{{ schedule.totalSeat}} Seats</p>
          <div class="flex items-center justify-end gap-2">
            <span class="text-gray-400 line-through text-sm">${{ schedule.priceOriginal }}</span>
            <span class="text-2xl font-bold text-orange-600">${{ schedule.price }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Boarding and Drop Off Info -->
    <div class="flex items-start justify-between pt-4 border-t border-gray-200">
      <div class="flex gap-6">
        <div class="flex items-start gap-2 text-sm text-gray-600">
          <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clip-rule="evenodd" />
          </svg>
          <div class="flex">
            <span class="">Boarding:</span>
            <div v-if="schedule.boardingPointLists && schedule.boardingPointLists.length > 0" class="pl-1">
              <button v-for="(point, index) in schedule.boardingPointLists" :key="index"
                class="block text-left text-gray-700 hover:text-orange-500"
                @click="openTripInfoTab('boarding', index)">
                - {{ formatBoardingPoint(point) }}
              </button>
            </div>
            <button v-else class="text-left text-gray-700 pl-1 hover:text-orange-500"
              @click="openTripInfoTab('boarding')">
              {{ schedule.boardingPoint }}
            </button>
          </div>
        </div>

        <div class="flex items-start justify-start gap-2 text-sm text-gray-600">
          <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clip-rule="evenodd" />
          </svg>
          <div class="flex">
            <span class="">Drop Off:</span>
            <div v-if="schedule.dropOffPointLists && schedule.dropOffPointLists.length > 0" class="pl-1">
              <button v-for="(point, index) in schedule.dropOffPointLists" :key="index"
                class="block text-left text-gray-700 hover:text-orange-500"
                @click="openTripInfoTab('dropOff', index)">
                - {{ formatDropOffPoint(point) }}
              </button>
            </div>
            <button v-else class="text-left text-gray-700 pl-1 hover:text-orange-500"
              @click="openTripInfoTab('dropOff')">
              {{ schedule.dropOffPoint }}
            </button>
          </div>
        </div>
      </div>
      <div class="flex items-start gap-4">
        <!-- Trip Info Button -->
        <button @click="openTripInfoTab('tripInfo')"
          class="flex items-start gap-2 text-sm text-gray-600 hover:text-orange-500 transition-colors">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd" />
          </svg>
          <span>Trip Info</span>
        </button>

        <!-- Book Now Button -->

        <!-- <button v-if="schedule.vehicleType == 3" @click="handleBookNow"
        class="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium transition-colors whitespace-nowrap">
        Book Now
      </button> -->
        <button 
          @click="schedule.status === 1 ? handleBookNow() : null"
          :disabled="schedule.status !== 1"
          :class="[
            schedule.status !== 1
              ? 'bg-gray-400 cursor-not-allowed'
              : (schedule.status === 1 && schedule.scheduleType === 1) 
                ? 'bg-orange-500 hover:bg-orange-600' 
                : schedule.scheduleType === 3 
                  ? 'bg-violet-900 hover:bg-violet-800' 
                  : 'bg-orange-500 hover:bg-orange-600',
            'text-white px-8 py-3 rounded-lg font-medium transition-colors whitespace-nowrap'
          ]">
          {{ schedule.status === 2 ? 'Left' : schedule.status === 3 ? 'Full' : schedule.status === 4 ? 'Unavailable' : schedule.status !== 1 ? 'Unavailable' : 'Book Now' }}
        </button>
      </div>

    </div>

    <!-- Trip Info Modal -->
    <TripInfoModal :isOpen="isTripInfoModalOpen" :schedule="schedule" :initialTab="selectedTab"
      :initialPointIndex="selectedPointIndex" @close="closeTripInfoModal" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TripInfoModal from './TripInfoModal.vue'

interface Schedule {
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

interface Props {
  schedule: Schedule
}

const props = defineProps<Props>()

const emit = defineEmits<{
  bookNow: [schedule: Schedule]
  tripInfo: [schedule: Schedule]
}>()

const isTripInfoModalOpen = ref(false)
const selectedTab = ref<string>('tripInfo')
const selectedPointIndex = ref<number | null>(null)

const handleBookNow = () => {
  emit('bookNow', props.schedule)
}

const openTripInfoTab = (tab: string, index?: number) => {
  selectedTab.value = tab
  selectedPointIndex.value = typeof index === 'number' ? index : null
  isTripInfoModalOpen.value = true
  emit('tripInfo', props.schedule)
}

const closeTripInfoModal = () => {
  isTripInfoModalOpen.value = false
}

const formatBoardingPoint = (point: any): string => {
  if (!point) return ''
  const name = point?.name || point?.location || point?.title || point
  const time = point?.time || point?.departureTime || point?.departTime || point?.boardingTime || point?.departure
  if (name && time) return `${name} ${formatTime(String(time))}`
  return String(name || '')
}

const formatDropOffPoint = (point: any): string => {
  if (!point) return ''
  const name = point?.name || point?.location || point?.title || point
  const time = point?.time || point?.arrivalTime || point?.arriveTime || point?.dropOffTime || point?.arrival
  if (name && time) return `${name} ${formatTime(String(time))}`
  return String(name || '')
}

const toltalSeat = props.schedule.totalSeat - props.schedule.seatAvailable;

// Format time to HH:mm format
const formatTime = (time: string): string => {
  if (!time) return ''

  // If already in HH:mm format, return as is
  if (/^\d{2}:\d{2}$/.test(time)) {
    return time
  }

  // If it's a full date-time string, extract time
  try {
    const date = new Date(time)
    if (!isNaN(date.getTime())) {
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    }
  } catch (e) {
    // If parsing fails, try to extract time pattern
  }

  // Try to extract HH:mm pattern from string
  const timeMatch = time.match(/(\d{1,2}):(\d{2})/)
  if (timeMatch) {
    const hours = timeMatch[1]?.padStart(2, '0') ?? ''
    const minutes = timeMatch[2] ?? ''
    return `${hours}:${minutes}`
  }

  return time
}
</script>

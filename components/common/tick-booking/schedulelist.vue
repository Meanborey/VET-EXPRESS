<template>
  <div class="container mx-auto py-8">
    <!-- Seat Selection Modal -->
    <SeatSelectionModal
      :is-open="showSeatModal"
      :seat-data="seatData"
      :schedule-info="selectedScheduleInfo"
      :unavailable-seats="unavailableSeats"
      @close="showSeatModal = false"
      @continue="handleSeatContinue"
    />

    <!-- Search Header -->
    <div class="bg-white border-t border-x-gray-500 border-b p-3 mb-6">
      <div class="grid grid-cols-5 gap-6 items-center">
        <div>
          <p class="text-sm text-gray-500">From</p>
          <p class="text-base">{{ searchParams.from }}</p>
        </div>
        <div>
            <svg class="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
        <div class="flex items-center gap-2">
        
          <div>
            <p class="text-sm text-gray-500">To</p>
            <p class="text-base">{{ searchParams.to }}</p>
          </div>
        </div>
        <div>
          <p class="text-sm text-gray-500">Departure</p>
          <p class="text-base">{{ searchParams.departure }}</p>
        </div>
        <div class="flex justify-end">
          <button @click="handleModify" class="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors">
            Modify
          </button>
        </div>
      </div>
    </div>

    <!-- Schedule List -->
    <div class="space-y-4">
      <cardlistschedule
        v-for="schedule in schedules"
        :key="schedule.id"
        :schedule="schedule"
        @book-now="handleBookNow"
        @trip-info="handleTripInfo"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useDestinationStore } from '~/stores/useDestinationStore'

interface SearchParams {
  from: string
  to: string
  departure: string
}

const route = useRoute()
const router = useRouter()
const destinationStore = useDestinationStore()

// Seat selection modal
const showSeatModal = ref(false)
const currentSchedule = ref<any>(null)
const selectedScheduleInfo = ref({
  routeTitle: '',
  routeType: '',
  vehicleType: '',
  departure: '',
  price: 0
})

const searchParams = ref<SearchParams>({
  from: (route.query.from as string) || destinationStore.searchParams.origin || '',
  to: (route.query.to as string) || destinationStore.searchParams.destination || '',
  departure: (route.query.departDate as string) || destinationStore.searchParams.departDate || ''
})

// Get schedules from store (placeholder - no schedules in destinationStore yet)
const schedules = computed(() => [] as any[])

// Get current seat data from selected schedule
const seatData = computed(() => currentSchedule.value?.seatLayout || '[]')
const unavailableSeats = computed(() => currentSchedule.value?.unavailableSeats || [])

const handleBookNow = (schedule: any) => {
  console.log('Book now:', schedule)
  
  // Store current schedule
  currentSchedule.value = schedule
  
  // Set schedule info for modal
  selectedScheduleInfo.value = {
    routeTitle: `${searchParams.value.from} - ${searchParams.value.to}`,
    routeType: schedule.routeInfo || '(Direct)',
    vehicleType: schedule.vehicleType || schedule.vehicleName,
    departure: searchParams.value.departure,
    price: schedule.price
  }
  
  // Show seat selection modal
  showSeatModal.value = true
}

const handleSeatContinue = (selectedSeats: any[]) => {
  console.log('Selected seats:', selectedSeats)
  
  // Close modal
  showSeatModal.value = false
  
  // Navigate to booking page with selected seats and schedule info
  router.push({
    path: '/booking',
    query: {
      scheduleId: currentSchedule.value?.id,
      from: searchParams.value.from,
      to: searchParams.value.to,
      departDate: searchParams.value.departure,
      seats: selectedSeats.map(s => s.label).join(','),
      totalFare: (selectedSeats.length * currentSchedule.value?.price).toFixed(2)
    }
  })
}

const handleTripInfo = (schedule: any) => {
  console.log('Trip info:', schedule)
  // Show trip information modal/dialog
}

const handleModify = () => {
  router.push('/')
}

// Initialize search when component mounts
onMounted(() => {
  if (searchParams.value.from || searchParams.value.to || searchParams.value.departure) {
    destinationStore.setSearchParams({
      origin: searchParams.value.from,
      destination: searchParams.value.to,
      departDate: searchParams.value.departure,
      returnDate: (route.query.returnDate as string) || ''
    })
  }
})
</script>


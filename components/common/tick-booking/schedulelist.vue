<template>
  <div class="container mx-auto py-8">
    <!-- Seat Selection Modal -->
    <SeatSelectionModal 
      :is-open="showSeatModal" 
      :seat-data="seatData" 
      :schedule-info="selectedScheduleInfo"
      :unavailable-seats="unavailableSeats" 
      :journey-id="currentSchedule?.id"
      :fetch-from-api="true"
      @close="showSeatModal = false" 
      @continue="handleSeatContinue" 
    />

    <!-- Search Header -->
    <div class="">
      <div v-if="!showModifyForm" class="grid grid-cols-5 gap-6 items-center bg-white border-t border-x-gray-500 border-b p-3 mb-6">
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
          <button @click="showModifyForm = true"
            class="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors">
            Modify
          </button>
        </div>
      </div>
      <div v-else class=" mb-6">
        <destination-form @submit="handleModifySubmit" />
      </div>
    </div>


    <!-- Schedule List -->
    <div class="space-y-4">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>

      <!-- Error State -->
      <!-- <div v-else-if="hasError" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg class="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-lg font-semibold text-red-800 mb-2">Error Loading Schedules</h3>
        <p class="text-red-600 mb-4">{{ errorMessage }}</p>
        <button @click="retryFetch"
          class="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors">
          Retry
        </button>
      </div> -->

      <!-- Empty State -->
      <!-- <div v-else-if="emptyData || schedules.length === 0" class="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">No Schedules Available</h3>
        <p class="text-gray-500 mb-4">No schedules found for the selected route and date.</p>
        <button  class="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors">
          Modify Search
        </button>
      </div> -->

      <!-- Schedules List -->
      <cardlistschedule v-else v-for="schedule in schedules" :key="schedule.id" :schedule="schedule"
        @book-now="handleBookNow" @trip-info="handleTripInfo" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import DestinationForm from '~/components/form/destination-form.vue'
import { useDestinationStore } from '~/stores/useDestinationStore'
import { useScheduleStore } from '~/stores/useScheduleStore'

interface SearchParams {
  from: string
  to: string
  departure: string
}

const route = useRoute()
const router = useRouter()
const destinationStore = useDestinationStore()
const scheduleStore = useScheduleStore()
const showModifyForm = ref(false)

// Seat selection modal
const showSeatModal = ref(false)
const currentSchedule = ref<any>(null)
const selectedScheduleInfo = ref({
  routeTitle: '',
  routeType: '',
  vehicleType: '',
  departure: '',
  departureTime: '',
  arrivalTime: '',
  price: 0
})

const formatTime = (time: string): string => {
  if (!time) return ''

  if (/^\d{2}:\d{2}$/.test(time)) {
    return time
  }

  if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
    return time.substring(0, 5)
  }

  try {
    const date = new Date(time)
    if (!isNaN(date.getTime())) {
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    }
  } catch {
    // ignore parse error and fall back to regex extraction
  }

  const timeMatch = time.match(/(\d{1,2}):(\d{2})/)
  if (timeMatch) {
    const hours = timeMatch[1]?.padStart(2, '0') ?? ''
    const minutes = timeMatch[2] ?? ''
    return `${hours}:${minutes}`
  }

  return time
}

const searchParams = ref<SearchParams>({
  from: (route.query.from as string) || destinationStore.searchParams.origin || '',
  to: (route.query.to as string) || destinationStore.searchParams.destination || '',
  departure: (route.query.departDate as string) || destinationStore.searchParams.departDate || ''
})

const getStoredValue = (key: string): string => {
  if (typeof localStorage === 'undefined') return ''
  return localStorage.getItem(key) || ''
}

const resolvedReturnDate = computed(() => {
  const raw =
    (route.query.returnDate as string) ||
    destinationStore.searchParams.returnDate ||
    getStoredValue('returnDate') ||
    ''

  const normalized = raw.trim()
  if (!normalized || normalized === 'undefined' || normalized === 'null') return ''
  return normalized
})

const hasReturnTrip = computed(() => !!resolvedReturnDate.value)
const tripType = computed(() => hasReturnTrip.value ? 'round-trip' : 'one-way')

// Get schedules from store
const schedules = computed(() => scheduleStore.getAllSchedules)
const isLoading = computed(() => scheduleStore.isLoading)
const hasError = computed(() => scheduleStore.hasError)
const errorMessage = computed(() => scheduleStore.error)
const emptyData = computed(() => scheduleStore.emptyData)

// Get current seat data from selected schedule
const seatData = computed(() => currentSchedule.value?.seatLayout || '[]')
const unavailableSeats = computed(() => currentSchedule.value?.unavailableSeats || [])

const handleBookNow = (schedule: any) => {
  console.log('Book now:', schedule)

  // Store current schedule
  currentSchedule.value = schedule

  // Store journey ID and date in localStorage for the API call
  localStorage.setItem('journeyid', schedule.id)
  localStorage.setItem('dateFrom', searchParams.value.departure)

  // Set schedule info for modal
  selectedScheduleInfo.value = {
    routeTitle: `${searchParams.value.from} - ${searchParams.value.to}`,
    routeType: schedule.routeInfo || '(Direct)',
    vehicleType: schedule.transportationType || schedule.vehicleName || String(schedule.vehicleType || ''),
    departure: searchParams.value.departure,
    departureTime: formatTime(String(schedule.departure || '')),
    arrivalTime: formatTime(String(schedule.arrival || '')),
    price: schedule.price
  }

  // Show seat selection modal
  showSeatModal.value = true
}

const handleSeatContinue = (selectedSeats: any[]) => {
  console.log('Selected seats:', selectedSeats)

  // Close modal
  showSeatModal.value = false

  const selectedSeatLabels = selectedSeats.map(s => s.label).join(',')
  const totalFare = (selectedSeats.length * currentSchedule.value?.price).toFixed(2)
  const outboundDepartureTime = formatTime(String(currentSchedule.value?.departure || ''))
  const outboundArrivalTime = formatTime(String(currentSchedule.value?.arrival || ''))
  const outboundVehicleType =
    currentSchedule.value?.transportationType ||
    currentSchedule.value?.vehicleName ||
    String(currentSchedule.value?.vehicleType || '')

  if (hasReturnTrip.value) {
    router.push({
      path: '/schedulelistback',
      query: {
        tripType: tripType.value,
        from: searchParams.value.from,
        fromId: (route.query.fromId as string) || (route.query.destinationFrom as string) || destinationStore.searchParams.destinationFrom || undefined,
        to: searchParams.value.to,
        toId: (route.query.toId as string) || (route.query.destinationTo as string) || destinationStore.searchParams.destinationTo || undefined,
        departDate: searchParams.value.departure,
        returnDate: resolvedReturnDate.value,
        outboundScheduleId: currentSchedule.value?.id,
        outboundSeats: selectedSeatLabels,
        outboundTotalFare: totalFare,
        outboundVehicleType,
        outboundDepartureTime,
        outboundArrivalTime
      }
    })
    return
  }

  // Navigate to passenger page with selected seats and schedule info
  router.push({
    path: '/passenger',
    query: {
      tripType: tripType.value,
      scheduleId: currentSchedule.value?.id,
      from: searchParams.value.from,
      to: searchParams.value.to,
      departDate: searchParams.value.departure,
      seats: selectedSeatLabels,
      totalFare: totalFare,
      vehicleType: outboundVehicleType,
      departureTime: outboundDepartureTime,
      arrivalTime: outboundArrivalTime,
      returnDate: resolvedReturnDate.value || undefined
    }
  })
}

const handleTripInfo = (schedule: any) => {
  console.log('Trip info:', schedule)
  // Show trip information modal/dialog
}

const handleModifySubmit = async () => {
  showModifyForm.value = false

  const fromName = destinationStore.searchParams.origin || ''
  const toName = destinationStore.searchParams.destination || ''
  const departDate = destinationStore.searchParams.departDate || ''

  searchParams.value = {
    from: fromName,
    to: toName,
    departure: departDate
  }

  const destinationFrom =
    destinationStore.searchParams.destinationFrom ||
    (route.query.fromId as string) ||
    (route.query.destinationFrom as string) ||
    ''

  const destinationTo =
    destinationStore.searchParams.destinationTo ||
    (route.query.toId as string) ||
    (route.query.destinationTo as string) ||
    ''

  const nationally =
    (route.query.nationally as string) ||
    destinationStore.searchParams.nationally ||
    'local'

  const type =
    (route.query.type as string) ||
    destinationStore.searchParams.type ||
    destinationStore.currentType ||
    '1'

  if (destinationFrom && destinationTo && departDate && type) {
    await scheduleStore.fetchSchedulesByDate(
      departDate,
      destinationFrom,
      destinationTo,
      nationally,
      type
    )
  }
}



const retryFetch = async () => {
  // Map fromId/toId from URL to destinationFrom/destinationTo for API
  const destinationFrom = (route.query.fromId as string) || (route.query.destinationFrom as string) || destinationStore.searchParams.destinationFrom
  const destinationTo = (route.query.toId as string) || (route.query.destinationTo as string) || destinationStore.searchParams.destinationTo
  const departDate = searchParams.value.departure
  const nationally = (route.query.nationally as string) || destinationStore.searchParams.nationally || 'local'
  const type = (route.query.type as string) || destinationStore.searchParams.type || destinationStore.currentType || '1'

  console.log('Retry fetch with params:', { date: departDate, destinationFrom, destinationTo, nationally, type })

  if (destinationFrom && destinationTo && departDate && type) {
    await scheduleStore.fetchSchedulesByDate(departDate, destinationFrom, destinationTo, nationally, type)
  } else {
    console.error('Missing required parameters:', { destinationFrom, destinationTo, departDate, type })
  }
}

// Initialize search when component mounts
onMounted(async () => {
  if (searchParams.value.from || searchParams.value.to || searchParams.value.departure) {
    // Map fromId/toId from URL to destinationFrom/destinationTo
    const fromId = (route.query.fromId as string) || (route.query.destinationFrom as string) || ''
    const toId = (route.query.toId as string) || (route.query.destinationTo as string) || ''
    const nationally = (route.query.nationally as string) || 'local'
    const type = (route.query.type as string) || destinationStore.currentType || '1'

    destinationStore.setSearchParams({
      origin: searchParams.value.from,
      destinationFrom: fromId,
      destination: searchParams.value.to,
      destinationTo: toId,
      departDate: searchParams.value.departure,
      returnDate: (route.query.returnDate as string) || getStoredValue('returnDate') || '',
      nationally: nationally,
      type: type
    })

    console.log('Schedule list mounted with params:', {
      date: searchParams.value.departure,
      destinationFrom: fromId,
      destinationTo: toId,
      nationally,
      type
    })

    // Fetch schedules from API
    if (fromId && toId && searchParams.value.departure && type) {
      await scheduleStore.fetchSchedulesByDate(
        searchParams.value.departure,
        fromId,
        toId,
        nationally,
        type
      )
    } else {
      console.error('Missing required parameters for schedule fetch:', {
        fromId,
        toId,
        departDate: searchParams.value.departure,
        type
      })
    }
  }
})
</script>

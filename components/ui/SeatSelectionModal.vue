<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    @click="closeModal">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
      @click.stop>
      <!-- Header -->
      <div class="flex items-center justify-between p-3 border-b border-gray-200">
        <div>
          <!-- <h2 class="text-2xl font-bold text-gray-800"></h2> -->
          <p class="text-base text-gray-700 font-semibold mt-1">{{ scheduleInfo.routeTitle }} (Direct)</p>
        </div>
        <button @click="closeModal" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Loading State for Seat Layout -->
        <div v-if="isLoadingSeatLayout" class="flex justify-center items-center py-12">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p class="text-gray-600">Loading seat layout...</p>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <!-- Seat Map Section -->
          <div class="lg:col-span-3">
            <!-- Legend -->
            <div class="flex items-center gap-6 mb-6">
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 rounded-full bg-gray-200 border border-gray-300"></div>
                <span class="text-sm text-gray-700">Seat Available</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-blue-600 rounded-full border border-blue-700"></div>
                <span class="text-sm text-gray-700">Seat Selected</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-red-500 rounded-full border border-red-600"></div>
                <span class="text-sm text-gray-700">Seat Unavailable</span>
              </div>
            </div>

            <!-- Seat Layout -->
            <div class="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
              <!-- No Seats Message -->
              <div v-if="seatLayout.length === 0" class="text-center py-8">
                <p class="text-gray-500 mb-2">No seat layout available</p>
                <p class="text-sm text-gray-400">Please contact support if this issue persists</p>
              </div>

              <div v-for="(row, rowIndex) in seatLayout" :key="rowIndex" class="mb-3">
                <div class="grid grid-cols-5 gap-2">
                  <template v-for="(col, colIndex) in row.col" :key="colIndex">
                    <div :style="getCellSpanStyle(col)">
                    <!-- Facility Label (Toilet) -->
                    <div v-if="isFacilityLabel(col)" class="flex items-center justify-center h-20">
                      <span class="text-xs font-semibold text-gray-700">{{ col.label }}</span>
                    </div>

                    <!-- Staff Seat (Hostess/Captain) -->
                    <button v-else-if="getStaffSeatType(col)" type="button" disabled
                      class="relative flex flex-col items-center justify-center h-20 rounded-lg">
                      <img :src="getSeatImage(col)" :alt="col.label" class="w-12 h-12 object-contain mb-1" />
                      <span class="text-xs font-semibold text-gray-700">{{ col.label }}</span>
                    </button>

                    <!-- Section Label (Down Stair / Up Stair) -->
                    <div v-else-if="col.value && col.value.startsWith('Open')" class="">
                      {{ col.label }}
                    </div>

                    <!-- Empty Space (Aisle) -->
                    <div v-else-if="!col.value" class="w-full h-12"></div>

                    <!-- Seat Button -->
                    <button v-else type="button" @click="toggleSeat(col)" :disabled="isSeatUnavailable(col) || Boolean(getStaffSeatType(col))"
                      class="relative flex flex-col items-center justify-center h-20 rounded-lg transition-all duration-200 hover:scale-105"
                      :title="getSeatTitle(col)">
                      <!-- Seat Image -->
                      <img :src="getSeatImage(col)" :alt="col.label" class="w-12 h-12 object-contain mb-1" />
                      <span class="text-xs font-semibold"
                        :class="getSeatLabelClass(col)">{{
                        getSeatDisplayLabel(col) }}</span>
                     
                    </button>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- Booking Summary Section -->
          <div class="lg:col-span-2">
            <div class="bg-gray-50 rounded-xl p-6 border border-gray-200 sticky top-0">
              <h3 class="text-lg font-bold text-gray-800 mb-4">Booking Summary</h3>

              <div class="space-y-3 mb-6">
                <div class="flex  text-sm w-full ">
                  <span class="text-gray-600 w-1/2">Vehicle Type</span>
                  <span class="font-semibold text-gray-800">: {{ scheduleInfo.vehicleType }}</span>
                </div>
                <div class="flex  text-sm w-full ">
                  <span class="text-gray-600 w-1/2">Departure</span>
                  <span class="font-semibold text-gray-800">: {{ scheduleInfo.departure }}</span>
                </div>
                <div class="flex  text-sm w-full ">
                  <span class="text-gray-600 w-1/2">Price</span>
                  <span class="font-semibold text-gray-800">: ${{ scheduleInfo.price }}</span>
                </div>
                <div class="flex  text-sm w-full ">
                  <span class="text-gray-600 w-1/2">Selected Seat</span>
                  <span class="font-semibold"> : {{ selectedSeats.length }}</span>
                </div>
                <div class="pt-2 border-t border-gray-300 flex w-full">
                  <span class="text-xs text-gray-600 w-1/2">Seat Number</span>
                  <span class="text-xs font-semibold text-gray-800 w-1/2">: {{ selectedSeatLabels }}</span>
                </div>
              </div>

              <!-- Total Fare -->
              <div class=" mb-4  ">
                <div class="flex items-center w-full">
                  <span class="text-gray-600 font-semibold w-1/2">Total </span>
                  <span class="text-lg font-semibold text-gray-800 w-1/2">: ${{ totalFare.toFixed(2) }}</span>
                </div>
              </div>

              <!-- Continue Button -->
              <button @click="handleContinue"
                class="w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-xl"
                >
                Continue
              </button>
              <div v-if="showSeatError" class="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                Please select your seat
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useScheduleStore } from '~/stores/useScheduleStore'

// Import seat images
import seatAvailable from '@/assets/images/seats/Chair 1.png'
import seatSelected from '@/assets/images/seats/Chair 2.png'
import seatUnavailable from '@/assets/images/seats/Chair 3.png'
import BED1 from '@/assets/images/seats/BED 1.png'
import BED2 from '@/assets/images/seats/BED 2.png'
import BED3 from '@/assets/images/seats/BED 3.png'
import hostessSeat from '@/assets/images/seats/hostess.png'
import captainSeat from '@/assets/images/seats/captain.png'
const router = useRouter()

interface SeatCol {
  attr: {
    colspan: string
    rowspan: string
  }
  value: string
  label: string
}

interface SeatRow {
  row: string
  col: SeatCol[]
}

interface UnavailableSeatInfo {
  seatNumber: string
  gender?: string
  status?: number
}

interface ScheduleInfo {
  routeTitle: string
  routeType: string
  vehicleType: string
  departure: string
  price: number
}

interface Props {
  isOpen: boolean
  seatData?: string
  scheduleInfo: ScheduleInfo
  unavailableSeats?: Array<string | UnavailableSeatInfo>
  journeyId?: string
  fetchFromApi?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  seatData: '[]',
  unavailableSeats: () => [],
  journeyId: '',
  fetchFromApi: false
})

const emit = defineEmits<{
  close: []
  continue: [selectedSeats: SeatCol[]]
}>()

const scheduleStore = useScheduleStore()
const selectedSeats = ref<SeatCol[]>([])
const showSeatError = ref(false)
const isLoadingSeatLayout = ref(false)
const apiSeatData = ref<string>('')
const apiUnavailableSeats = ref<UnavailableSeatInfo[]>([])
const apiSeatType = ref<number | null>(null)

// Watch for modal opening to fetch seat layout if needed
watch(() => props.isOpen, async (newValue) => {
  if (newValue && props.fetchFromApi && props.journeyId) {
    await fetchSeatLayoutFromApi()
  }
})

// Fetch seat layout from API
const fetchSeatLayoutFromApi = async () => {
  try {
    isLoadingSeatLayout.value = true

    const dateFrom = localStorage.getItem('dateFrom') || ''
    const journeyId = props.journeyId || localStorage.getItem('journeyid') || ''

    console.log('Fetching seat layout - dateFrom:', dateFrom, 'journeyId:', journeyId)

    if (!dateFrom || !journeyId) {
      console.error('Missing date or journey ID')
      return
    }

    // Fetch both seat layout and unavailable seats
    const result = await scheduleStore.fetchSeatLayoutWithUnavailableSeats(dateFrom, journeyId)

    console.log('Seat layout result:', result)

    if (result) {
      apiSeatData.value = result.seatLayout
      apiUnavailableSeats.value = result.unavailableSeats
      apiSeatType.value = typeof result.seatType === 'number' ? result.seatType : null
      console.log('API Seat Data:', apiSeatData.value)
      console.log('API Unavailable Seats:', apiUnavailableSeats.value)
    }
  } catch (error) {
    console.error('Error fetching seat layout:', error)
  } finally {
    isLoadingSeatLayout.value = false
  }
}

const seatLayout = computed<SeatRow[]>(() => {
  try {
    // Use API data if available, otherwise use prop data
    const dataToUse = props.fetchFromApi && apiSeatData.value ? apiSeatData.value : props.seatData
    console.log('Data to use for seat layout:', dataToUse)
    console.log('fetchFromApi:', props.fetchFromApi, 'apiSeatData:', apiSeatData.value, 'propsSeatData:', props.seatData)

    if (!dataToUse || dataToUse === '[]') {
      console.warn('No seat data available')
      return []
    }

    const parsed = JSON.parse(dataToUse)
    console.log('Parsed seat layout:', parsed)
    return parsed
  } catch (e) {
    console.error('Error parsing seat data:', e)
    return []
  }
})

// Get unavailable seats from API or props
const unavailableSeatsComputed = computed<UnavailableSeatInfo[]>(() => {
  const seats = props.fetchFromApi && apiUnavailableSeats.value.length > 0
    ? apiUnavailableSeats.value
    : props.unavailableSeats

  const normalizeGender = (value: string | number | undefined | null) => {
    const strValue = value === undefined || value === null ? '' : String(value).trim()
    if (strValue === '1') return 'M'
    if (strValue === '2') return 'F'
    if (strValue.toLowerCase() === 'm') return 'M'
    if (strValue.toLowerCase() === 'f') return 'F'
    return strValue || undefined
  }

  const normalized = (seats || []).map((seat) => {
    if (typeof seat === 'string') {
      return { seatNumber: seat }
    }
    return {
      seatNumber: String(seat.seatNumber).trim(),
      gender: normalizeGender(seat.gender),
      status: seat.status
    }
  })

  console.log('Unavailable seats computed:', normalized)
  console.log('fetchFromApi:', props.fetchFromApi)
  console.log('apiUnavailableSeats:', apiUnavailableSeats.value)
  console.log('props.unavailableSeats:', props.unavailableSeats)

  return normalized
})

const totalFare = computed(() => {
  return selectedSeats.value.length * props.scheduleInfo.price
})

const selectedSeatLabels = computed(() => {
  return selectedSeats.value.map(seat => seat.label).join(', ')
})

const seatTypeToUse = computed(() => {
  return props.fetchFromApi && apiSeatType.value ? apiSeatType.value : 1
})

const getStaffSeatType = (seat: SeatCol | string) => {
  const rawValue = typeof seat === 'string' ? seat : seat.value
  const rawLabel = typeof seat === 'string' ? seat : seat.label
  const combined = `${rawValue} ${rawLabel}`.toLowerCase()

  if (combined.includes('hostess')) {
    return 'hostess'
  }
  if (combined.includes('captain') || combined.includes('capitain')) {
    return 'captain'
  }
  return null
}

const isFacilityLabel = (seat: SeatCol | string) => {
  const rawValue = typeof seat === 'string' ? seat : seat.value
  const rawLabel = typeof seat === 'string' ? seat : seat.label
  const combined = `${rawValue} ${rawLabel}`.toLowerCase()
  return combined.includes('toilet')
}

const getCellSpanStyle = (seat: SeatCol) => {
  const colSpan = Number(seat.attr?.colspan || 1)
  const rowSpan = Number(seat.attr?.rowspan || 1)
  const style: Record<string, string> = {}

  if (colSpan > 1) {
    style.gridColumn = `span ${colSpan} / span ${colSpan}`
  }
  if (rowSpan > 1) {
    style.gridRow = `span ${rowSpan} / span ${rowSpan}`
  }

  return style
}

const getSeatImage = (seat: SeatCol | string) => {
  const seatObj = typeof seat === 'string' ? null : seat
  const seatValue = typeof seat === 'string' ? seat : seat.value

  const staffSeatType = getStaffSeatType(seatObj || seatValue)
  if (staffSeatType === 'hostess') {
    return hostessSeat
  }
  if (staffSeatType === 'captain') {
    return captainSeat
  }

  const isUnavailable = isSeatUnavailable(seatObj || seatValue)
  const isSelected = isSeatSelected(seatValue)

  if (seatTypeToUse.value === 2) {
    if (isUnavailable) {
      return BED3
    }
    if (isSelected) {
      return BED2
    }
    return BED1
  }

  if (isUnavailable) {
    return seatUnavailable // Red/Unavailable
  }
  if (isSelected) {
    return seatSelected // Blue/Selected
  }
  return seatAvailable // Gray/Available
}

const getSeatClass = (seat: SeatCol | string) => {
  const seatValue = typeof seat === 'string' ? seat : seat.value
  const seatObj = typeof seat === 'string' ? null : seat

  if (isSeatUnavailable(seatObj || seatValue)) {
    return 'bg-red-500 border-red-600 text-white cursor-not-allowed'
  }
  if (isSeatSelected(seatValue)) {
    return 'bg-blue-600 border-blue-700 text-white shadow-lg'
  }
  return 'bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300'
}

const isSeatSelected = (seatValue: string) => {
  return selectedSeats.value.some(seat => seat.value === seatValue)
}

const findUnavailableSeatMatch = (seat: SeatCol | string): UnavailableSeatInfo | null => {
  const unavailableList = unavailableSeatsComputed.value

  // Get seat value and label
  let seatValue: string
  let seatLabel: string

  if (typeof seat === 'string') {
    seatValue = seat
    seatLabel = seat
  } else {
    seatValue = seat.value
    seatLabel = seat.label
  }

  // Function to normalize seat string for comparison
  const normalize = (str: string) => str.replace(/\s+/g, '').toLowerCase()

  // Function to extract just the number from seat (e.g., "1A(M)" -> "1", "10B" -> "10")
  const extractNumber = (str: string) => {
    const match = str.match(/^(\d+)/)
    return match ? match[1] : ''
  }

  const checkMatch = (toCheck: string): UnavailableSeatInfo | null => {
    const normalizedCheck = normalize(toCheck)

    for (const unavailable of unavailableList) {
      const unavailableSeatNumber = unavailable.seatNumber || ''
      const normalizedUnavailable = normalize(unavailableSeatNumber)

      // Exact match (normalized)
      if (normalizedUnavailable === normalizedCheck) {
        console.log('Exact match:', toCheck, '=', unavailableSeatNumber)
        return unavailable
      }

      // Match without (M) or (m)
      const checkWithoutM = normalizedCheck.replace(/\(m\)/g, '')
      const unavailableWithoutM = normalizedUnavailable.replace(/\(m\)/g, '')

      if (checkWithoutM === unavailableWithoutM) {
        console.log('Match without (M):', toCheck, '=', unavailableSeatNumber)
        return unavailable
      }

      // If unavailable is just a number (e.g., "1", "2", "5")
      // Match only A-suffix seats like "1A", "2A" (Down Stair), not "1B", "2B" (Up Stair)
      if (/^\d+$/.test(unavailableSeatNumber.trim())) {
        const unavailableNum = unavailableSeatNumber.trim()
        const regex = new RegExp(`^${unavailableNum}a`, 'i')
        if (regex.test(toCheck)) {
          console.log('Number + A match:', toCheck, 'matches number', unavailableNum)
          return unavailable
        }
      }
    }

    return null
  }

  return checkMatch(seatValue) || checkMatch(seatLabel)
}

const isSeatUnavailable = (seat: SeatCol | string) => {
  return Boolean(findUnavailableSeatMatch(seat))
}

const getSeatDisplayLabel = (seat: SeatCol) => {
  const matched = findUnavailableSeatMatch(seat)
  if (matched?.gender) {
    return `${seat.label} (${matched.gender})`
  }
  return seat.label
}

const getSeatTitle = (seat: SeatCol) => {
  const matched = findUnavailableSeatMatch(seat)
  if (matched?.gender) {
    return `Seat ${seat.label} - Gender: ${matched.gender} - Value: ${seat.value}`
  }
  return `Seat ${seat.label} - Value: ${seat.value}`
}

const getSeatLabelClass = (seat: SeatCol) => {
  if (isSeatUnavailable(seat)) {
    return ' px-1.5 py-0.5 rounded'
  }
  if (isSeatSelected(seat.value)) {
    return ' px-1.5 py-0.5 rounded'
  }
  return 'text-gray-700'
}

const toggleSeat = (seat: SeatCol) => {
  // Don't allow selecting unavailable seats
  if (isSeatUnavailable(seat) || getStaffSeatType(seat)) {
    console.log('Cannot select unavailable seat:', seat.label, seat.value)
    return
  }

  const index = selectedSeats.value.findIndex(s => s.value === seat.value)
  if (index > -1) {
    selectedSeats.value.splice(index, 1)
  } else {
    selectedSeats.value.push(seat)
  }
  if (selectedSeats.value.length > 0) {
    showSeatError.value = false
  }
}

const closeModal = () => {
  selectedSeats.value = []
  showSeatError.value = false
  emit('close')
}

const handleContinue = () => {
  if (selectedSeats.value.length === 0) {
    showSeatError.value = true
    return
  }
  const seatLabels = selectedSeats.value.map(seat => seat.label)
  localStorage.setItem('selectedSeats', seatLabels.join(','))
  emit('continue', selectedSeats.value)
  router.push({
    path: '/passenger',
    query: {
      seats: seatLabels.join(',')
    }
  })
}
</script>

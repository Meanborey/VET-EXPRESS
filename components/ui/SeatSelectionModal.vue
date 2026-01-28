<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" @click="closeModal">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col" @click.stop>
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
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Seat Map Section -->
          <div class="lg:col-span-2">
            <!-- Legend -->
            <div class="flex items-center gap-6 mb-6">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-gray-200 rounded border border-gray-300"></div>
                <span class="text-sm text-gray-700">Seat Available</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-blue-600 rounded border border-blue-700"></div>
                <span class="text-sm text-gray-700">Seat Selected</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-red-500 rounded border border-red-600"></div>
                <span class="text-sm text-gray-700">Seat Unavailable</span>
              </div>
            </div>

            <!-- Seat Layout -->
            <div class="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
              <div v-for="(row, rowIndex) in seatLayout" :key="rowIndex" class="mb-3">
                <div class="grid grid-cols-5 gap-2">
                  <template v-for="(col, colIndex) in row.col" :key="colIndex">
                    <!-- Section Label (Down Stair / Up Stair) -->
                    <div v-if="col.value && col.value.startsWith('Open')" 
                         class="col-span-5 text-center py-2 mb-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold rounded-lg shadow-md">
                      {{ col.label }}
                    </div>
                    
                    <!-- Empty Space (Aisle) -->
                    <div v-else-if="!col.value" class="w-full h-12"></div>
                    
                    <!-- Seat Button -->
                    <button
                      v-else
                      type="button"
                      @click="toggleSeat(col)"
                      :disabled="isSeatUnavailable(col.value)"
                      class="relative flex flex-col items-center justify-center h-16 rounded-lg border-2 transition-all duration-200 hover:scale-105"
                      :class="getSeatClass(col.value)">
                      <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V7H1v7c0 1.1.9 2 2 2h1v3h2v-3h8v3h2v-3h1c1.1 0 2-.9 2-2V7z"/>
                      </svg>
                      <span class="text-xs font-semibold">{{ col.label }}</span>
                      <span v-if="col.value.endsWith('(M)')" class="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-yellow-900 rounded-full text-[8px] flex items-center justify-center font-bold">M</span>
                    </button>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- Booking Summary Section -->
          <div class="lg:col-span-1">
            <div class="bg-gray-50 rounded-xl p-6 border border-gray-200 sticky top-0">
              <h3 class="text-lg font-bold text-gray-800 mb-4">Booking Summary</h3>
              
              <div class="space-y-3 mb-6">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Vehicle Type:</span>
                  <span class="font-semibold text-gray-800">{{ scheduleInfo.vehicleType }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Departure:</span>
                  <span class="font-semibold text-gray-800">{{ scheduleInfo.departure }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Price:</span>
                  <span class="font-semibold text-gray-800">${{ scheduleInfo.price }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Selected Seat:</span>
                  <span class="font-semibold text-orange-600">{{ selectedSeats.length }}</span>
                </div>
                <div v-if="selectedSeats.length > 0" class="pt-2 border-t border-gray-300">
                  <span class="text-xs text-gray-600">Seat Number:</span>
                  <div class="flex flex-wrap gap-2 mt-2">
                    <span v-for="seat in selectedSeats" :key="seat.value" 
                          class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                      {{ seat.label }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Total Fare -->
              <div class="bg-white rounded-lg p-4 mb-4 border border-gray-300">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 font-medium">Total fare:</span>
                  <span class="text-2xl font-bold text-gray-800">${{ totalFare.toFixed(2) }}</span>
                </div>
              </div>

              <!-- Continue Button -->
              <button 
                @click="handleContinue"
                :disabled="selectedSeats.length === 0"
                class="w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                :class="selectedSeats.length > 0 ? 'bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-xl' : 'bg-gray-400'">
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

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

interface ScheduleInfo {
  routeTitle: string
  routeType: string
  vehicleType: string
  departure: string
  price: number
}

interface Props {
  isOpen: boolean
  seatData: string
  scheduleInfo: ScheduleInfo
  unavailableSeats?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  unavailableSeats: () => []
})

const emit = defineEmits<{
  close: []
  continue: [selectedSeats: SeatCol[]]
}>()

const selectedSeats = ref<SeatCol[]>([])

const seatLayout = computed<SeatRow[]>(() => {
  try {
    return JSON.parse(props.seatData)
  } catch (e) {
    console.error('Error parsing seat data:', e)
    return []
  }
})

const totalFare = computed(() => {
  return selectedSeats.value.length * props.scheduleInfo.price
})

const getSeatClass = (seatValue: string) => {
  if (isSeatUnavailable(seatValue)) {
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

const isSeatUnavailable = (seatValue: string) => {
  return props.unavailableSeats.includes(seatValue)
}

const toggleSeat = (seat: SeatCol) => {
  const index = selectedSeats.value.findIndex(s => s.value === seat.value)
  if (index > -1) {
    selectedSeats.value.splice(index, 1)
  } else {
    selectedSeats.value.push(seat)
  }
}

const closeModal = () => {
  selectedSeats.value = []
  emit('close')
}

const handleContinue = () => {
  if (selectedSeats.value.length > 0) {
    emit('continue', selectedSeats.value)
  }
}
</script>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

const nationalityStore = useNationalityStore()
const { nationalities, loading: nationalityLoading, error: nationalityError } = storeToRefs(nationalityStore)
const boardingPointStore = useBoardingPointStore()
const {
   boardingPoints,
   loading: boardingPointLoading,
   error: boardingPointError
} = storeToRefs(boardingPointStore)
const dropOffPointStore = useDropOffPointStore()
const {
   dropOffPoints,
   loading: dropOffPointLoading,
   error: dropOffPointError
} = storeToRefs(dropOffPointStore)
const selectedBoardingPointId = ref('')
const showBoardingPointList = ref(false)
const selectedDropOffPointId = ref('')
const showDropOffPointList = ref(false)
const route = useRoute()

// Contact form data
const email = ref('')
const phoneNumber = ref('')
const emailError = ref('')
const phoneError = ref('')

interface PassengerForm {
   seatLabel: string
   name: string
   gender: '' | 'female' | 'male'
   nationality: string
   nationalitySearch: string
   showNationalityDropdown: boolean
}

const passengers = ref<PassengerForm[]>([])

const parseSeatList = (raw: unknown): string[] => {
   if (!raw) return []
   if (Array.isArray(raw)) return raw.map((item) => String(item).trim()).filter(Boolean)

   const text = String(raw).trim()
   if (!text) return []

   if (text.startsWith('[')) {
      try {
         const parsed = JSON.parse(text)
         if (Array.isArray(parsed)) {
            return parsed.map((item) => String(item).trim()).filter(Boolean)
         }
      } catch {
         // Fall through to CSV parsing
      }
   }

   return text.split(',').map((item) => item.trim()).filter(Boolean)
}

const seatLabels = computed(() => {
   const fromQuery = parseSeatList(route.query.seats)
   if (fromQuery.length > 0) return fromQuery

   if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('selectedSeats')
      const fromStorage = parseSeatList(stored)
      if (fromStorage.length > 0) return fromStorage
   }

   return []
})

const syncPassengers = () => {
   const count = seatLabels.value.length || 1
   const next: PassengerForm[] = []

   for (let i = 0; i < count; i += 1) {
      const seatLabel = seatLabels.value[i] || `${i + 1}`
      const existing = passengers.value[i]

      next.push(
         existing
            ? { ...existing, seatLabel }
            : {
               seatLabel,
               name: '',
               gender: '',
               nationality: '',
               nationalitySearch: '',
               showNationalityDropdown: false
            }
      )
   }

   passengers.value = next
}

const getFilteredNationalities = (query: string) => {
   const normalized = query.trim().toLowerCase()
   if (!normalized) return nationalities.value
   return nationalities.value.filter((item) => item.name.toLowerCase().includes(normalized))
}

const selectNationality = (index: number, name: string) => {
   const passenger = passengers.value[index]
   if (!passenger) return
   passenger.nationality = name
   passenger.nationalitySearch = name
   passenger.showNationalityDropdown = false
}

const closeNationalityDropdown = (index: number) => {
   setTimeout(() => {
      const passenger = passengers.value[index]
      if (passenger) passenger.showNationalityDropdown = false
   }, 120)
}

onMounted(() => {
   if (nationalities.value.length === 0) {
      nationalityStore.fetchNationalities()
   }

   // if (boardingPoints.value.length === 0) {
   boardingPointStore.fetchBoardingPoints()
   // }
   dropOffPointStore.fetchDropOffPoints()

   // Drop-off points will be fetched when boarding point is selected
})

watch(seatLabels, syncPassengers, { immediate: true })

watch(
   boardingPoints,
   (points) => {
      // Only auto-select if there's exactly one boarding point
      if (!selectedBoardingPointId.value && points.length === 1) {
         selectedBoardingPointId.value = points[0]?.id || ''
      }
   },
   { immediate: true }
)

// Watch for drop-off points and auto-select only if there's exactly one
watch(
   dropOffPoints,
   (points) => {
      // Only auto-select if there's exactly one drop-off point
      if (!selectedDropOffPointId.value && points.length === 1) {
         selectedDropOffPointId.value = points[0]?.id || ''
      }
   },
   { immediate: true }
)

// Watch for boarding point selection changes and fetch drop-off points
watch(
   selectedBoardingPointId,
   (newBoardingPointId) => {
      if (newBoardingPointId) {
         console.log('Boarding point selected, fetching drop-off points for:', newBoardingPointId)
         dropOffPointStore.fetchDropOffPoints(newBoardingPointId)
      }
   },
   { immediate: true }
)

const selectedBoardingPoint = computed(() => {
   if (boardingPoints.value.length === 0) return null
   return (
      boardingPoints.value.find((point) => point.id === selectedBoardingPointId.value) ||
      null
   )
})

const toggleBoardingPointList = () => {
   showBoardingPointList.value = !showBoardingPointList.value
}

const selectBoardingPoint = (pointId: string) => {
   selectedBoardingPointId.value = pointId
   showBoardingPointList.value = false
}

const selectedDropOffPoint = computed(() => {
   if (dropOffPoints.value.length === 0) return null
   return (
      dropOffPoints.value.find((point) => point.id === selectedDropOffPointId.value) ||
      null
   )
})

const toggleDropOffPointList = () => {
   showDropOffPointList.value = !showDropOffPointList.value
}

const selectDropOffPoint = (pointId: string) => {
   selectedDropOffPointId.value = pointId
   showDropOffPointList.value = false
}

// Map viewing functions
const hasCoordinates = (point: any) => {
   return (point?.lats && point?.longs) || (point?.latitude && point?.longitude)
}

const openMapView = (point: any) => {
   if (!hasCoordinates(point)) return
   
   const lat = point.lats || point.latitude
   const lng = point.longs || point.longitude
   
   // Open Google Maps or your preferred map service
   const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`
   window.open(mapUrl, '_blank')
}

const canShowBoardingMap = computed(() => {
   if (boardingPoints.value.length === 1) {
      return hasCoordinates(boardingPoints.value[0])
   }
   return selectedBoardingPoint.value && hasCoordinates(selectedBoardingPoint.value)
})

const canShowDropOffMap = computed(() => {
   if (dropOffPoints.value.length === 1) {
      return hasCoordinates(dropOffPoints.value[0])
   }
   return selectedDropOffPoint.value && hasCoordinates(selectedDropOffPoint.value)
})

const viewBoardingMap = () => {
   if (boardingPoints.value.length === 1) {
      openMapView(boardingPoints.value[0])
   } else if (selectedBoardingPoint.value) {
      openMapView(selectedBoardingPoint.value)
   }
}

const viewDropOffMap = () => {
   if (dropOffPoints.value.length === 1) {
      openMapView(dropOffPoints.value[0])
   } else if (selectedDropOffPoint.value) {
      openMapView(selectedDropOffPoint.value)
   }
}

// Validation functions
const validateEmail = (emailValue: string) => {
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
   if (!emailValue) {
      return 'Email is required'
   }
   if (!emailRegex.test(emailValue)) {
      return 'Please enter a valid email address'
   }
   return ''
}

const validatePhone = (phoneValue: string) => {
   const phoneRegex = /^[+]?[\d\s-()]+$/
   const cleanPhone = phoneValue.replace(/[\s-()]/g, '')
   
   if (!phoneValue) {
      return 'Phone number is required'
   }
   if (!phoneRegex.test(phoneValue)) {
      return 'Please enter a valid phone number'
   }
   if (cleanPhone.length < 8 || cleanPhone.length > 15) {
      return 'Phone number must be between 8 and 15 digits'
   }
   return ''
}

// Watch for validation
watch(email, (newEmail) => {
   emailError.value = validateEmail(newEmail)
}, { immediate: false })

watch(phoneNumber, (newPhone) => {
   phoneError.value = validatePhone(newPhone)
}, { immediate: false })
</script>

<template>
   <div class="min-h-screen bg-gray-50">
      <div class="container mx-auto py-10">
         <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 space-y-6">
               <!-- Passenger Detail -->
               <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div class="flex items-center justify-between mb-4">
                     <h2 class="text-base font-semibold text-gray-800">Passenger Detail</h2>
                  </div>
                  <div class="border-t border-gray-100 pt-4">
                     <div v-for="(passenger, index) in passengers" :key="passenger.seatLabel" class="mb-6">
                        <div class="text-sm font-semibold text-gray-700 mb-3">
                           Passenger {{ index + 1 }}: <span class="text-blue-600">#{{ passenger.seatLabel }}</span>
                        </div>
                        <div class="flex items-center gap-6 mb-4">
                           <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                              <input v-model="passenger.gender" type="radio" :name="`gender-${index}`" value="female"
                                 required class="text-orange-500" />
                              Female
                           </label>
                           <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                              <input v-model="passenger.gender" type="radio" :name="`gender-${index}`" value="male"
                                 required class="text-orange-500" />
                              Male
                           </label>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <input v-model="passenger.name" type="text" placeholder="Full name" required
                              class="w-full h-11 px-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                           <div class="relative">
                              <input v-model="passenger.nationalitySearch" type="text" placeholder="Nationality"
                                 required
                                 class="w-full h-11 px-3 pr-10 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                 @focus="passenger.showNationalityDropdown = true"
                                 @blur="closeNationalityDropdown(index)" />
                              <i
                                 class="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                              <div v-if="passenger.showNationalityDropdown"
                                 class="absolute z-10 mt-1 w-full max-h-56 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
                                 <button v-for="item in getFilteredNationalities(passenger.nationalitySearch)"
                                    :key="item.id" type="button"
                                    class="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                                    @mousedown.prevent="selectNationality(index, item.name)">
                                    {{ item.name }}
                                 </button>
                                 <div
                                    v-if="!nationalityLoading && getFilteredNationalities(passenger.nationalitySearch).length === 0"
                                    class="px-3 py-2 text-sm text-gray-500">
                                    No results
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     <p v-if="nationalityError" class="text-xs text-red-600">
                        {{ nationalityError }}
                     </p>
                     <p v-else-if="!nationalityLoading && nationalities.length === 0" class="text-xs text-gray-500">
                        No nationalities found.
                     </p>

                     <div class="mt-6 space-y-4">

                        <div class="border-gray-200 rounded-lg text-sm text-gray-700">
                           <div v-if="boardingPointLoading" class="text-sm text-gray-500">Loading boarding points...
                           </div>
                           <div v-else-if="boardingPointError" class="text-sm text-red-600">{{ boardingPointError }}
                           </div>
                           <div v-else-if="boardingPoints.length === 0" class="text-sm text-gray-500">No boarding points
                              found.</div>
                           <div v-else class="space-y-3">
                              <div v-if="boardingPoints.length > 0" class="relative">
                                 <!-- <label class="block text-xs font-semibold text-gray-600 mb-2">Boarding Point <span
                                       class="text-red-500">*</span></label> -->
                                          <div class="flex justify-between">
                                    <label class="block text-xs font-semibold text-gray-600 mb-2">Boarding Point <span
                                          class="text-red-500">*</span></label>
                                    <button 
                                       v-if="canShowBoardingMap" 
                                       @click="viewBoardingMap" 
                                       class="text-xs text-orange-500 italic hover:text-orange-600 cursor-pointer"
                                       type="button"
                                    >
                                       View Map
                                    </button>
                                 </div>
                                 <button type="button"
                                    class="w-full p-3 rounded-md border border-gray-300 text-sm bg-white flex items-center justify-between hover:border-orange-400"
                                    @click="toggleBoardingPointList">
                                    <div class="flex items-start gap-2">
                                       <span><i class="fas fa-map-marker-alt text-orange-500"></i></span>
                                       <div class="flex flex-col items-start leading-tight">
                                          <span class="text-gray-700 font-semibold">
                                             {{ selectedBoardingPoint?.name || (boardingPoints.length > 1 ? 'Please select boarding point' : 'Boarding Point') }}
                                          </span>
                                          <span v-if="selectedBoardingPoint?.address" class="text-sm text-gray-600">{{
                                             selectedBoardingPoint.address }}</span>
                                       </div>
                                    </div>
                                    <i v-if="boardingPoints.length > 1" class="fas fa-chevron-down text-gray-400"></i>
                                 </button>
                                 <div v-if="showBoardingPointList && boardingPoints.length > 1"
                                    class="absolute z-20 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                                    <div class="max-h-64 overflow-auto px-4 p-4 space-y-3">
                                       <label v-for="point in boardingPoints" :key="point.id"
                                          class="flex items-start gap-3 rounded-lg border border-gray-200 p-3 cursor-pointer hover:border-orange-300">
                                          <input type="radio" class="mt-1" :value="point.id"
                                             v-model="selectedBoardingPointId"
                                             @change="selectBoardingPoint(point.id)" />
                                          <div class="flex-1">
                                             <div class="flex items-center justify-between">
                                                <div class="font-semibold text-orange-600">
                                                   {{ point.name }}<span v-if="point.time"> {{ point.time }}</span>
                                                </div>
                                                <button 
                                                   v-if="hasCoordinates(point)" 
                                                   @click="openMapView(point)" 
                                                   class="text-xs font-semibold text-orange-500 hover:text-orange-600"
                                                   type="button"
                                                >
                                                   View Map
                                                </button>
                                             </div>
                                             <div v-if="point.address" class="text-sm text-gray-600 mt-1">{{
                                                point.address }}</div>
                                          </div>
                                       </label>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div class="text-xs text-indigo-700">
                           Please make sure you come to the correct boarding point that you have chosen as some
                           schedules do not have same
                           price. In case you chose the boarding point with lower price and come to boarding point with
                           higher price, we will
                           charge extra.
                        </div>

                        <div class="border-gray-200 rounded-lg text-sm text-gray-700">
                           <div v-if="dropOffPointLoading" class="text-sm text-gray-500">Loading drop-off points...
                           </div>
                           <div v-else-if="dropOffPointError" class="text-sm text-red-600">{{ dropOffPointError }}</div>
                           <div v-else-if="dropOffPoints.length === 0" class="text-sm text-gray-500">No drop-off points
                              found for selected boarding point.</div>
                           <div v-else class="space-y-3">
                              <div v-if="dropOffPoints.length > 0" class="relative">
                                 <div class="flex justify-between">
                                    <label class="block text-xs font-semibold text-gray-600 mb-2">Drop Off Point <span
                                          class="text-red-500">*</span></label>
                                    <button 
                                       v-if="canShowDropOffMap" 
                                       @click="viewDropOffMap" 
                                       class="text-xs text-orange-500 italic hover:text-orange-600 cursor-pointer"
                                       type="button"
                                    >
                                       View Map
                                    </button>
                                 </div>

                                 <button type="button"
                                    class="w-full p-3 rounded-md border border-gray-300 text-sm bg-white flex items-start justify-between hover:border-orange-400"
                                    @click="toggleDropOffPointList">
                                    <div class="flex items-start gap-2 flex-1 min-w-0">
                                       <span class="flex-shrink-0"><i
                                             class="fas fa-map-marker-alt text-orange-500"></i></span>
                                       <div class="flex flex-col items-start leading-tight gap-1 min-w-0 flex-1">
                                          <span class="text-gray-700 font-semibold break-words">
                                             {{ selectedDropOffPoint?.name || 'Drop Off Point' }}
                                          </span>
                                          <span v-if="selectedDropOffPoint?.address"
                                             class="text-sm text-gray-600 break-words text-start">{{
                                             selectedDropOffPoint.address }}</span>
                                       </div>
                                    </div>
                                    <i v-if="dropOffPoints.length > 1"
                                       class="fas fa-chevron-down text-gray-400 flex-shrink-0"></i>
                                 </button>
                                 <div v-if="showDropOffPointList && dropOffPoints.length > 1"
                                    class="absolute z-20 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                                    <div class="max-h-64 overflow-auto px-4 p-4 space-y-3">
                                       <label v-for="point in dropOffPoints" :key="point.id"
                                          class="flex items-start gap-3 rounded-lg border border-gray-200 p-3 cursor-pointer hover:border-orange-300">
                                          <input type="radio" class="mt-1" :value="point.id"
                                             v-model="selectedDropOffPointId" @change="selectDropOffPoint(point.id)" />
                                          <div class="flex-1">
                                             <div class="flex items-center justify-between">
                                                <div class="font-semibold text-orange-600">
                                                   {{ point.name }}<span v-if="point.time"> {{ point.time }}</span>
                                                </div>
                                                <button 
                                                   v-if="hasCoordinates(point)" 
                                                   @click="openMapView(point)" 
                                                   class="text-xs font-semibold text-orange-500 hover:text-orange-600"
                                                   type="button"
                                                >
                                                   View Map
                                                </button>
                                             </div>
                                             <div v-if="point.address" class="text-sm text-gray-600 mt-1">{{
                                                point.address }}</div>
                                          </div>
                                       </label>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <!-- Contact Details -->
               <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div class="flex items-start gap-3 mb-4">
                     <div class="w-1 h-5 bg-orange-500 rounded"></div>
                     <div>
                        <h2 class="text-base font-semibold text-gray-800">Contact Details</h2>
                        <p class="text-xs text-gray-500">Your booking detail ticket will be sent your email address</p>
                     </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <input 
                           v-model="email"
                           type="email" 
                           placeholder="Email address"
                           required
                           :class="[
                              'w-full h-11 px-3 rounded-md border text-sm focus:outline-none focus:ring-2',
                              emailError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                           ]"
                        />
                        <p v-if="emailError" class="text-xs text-red-600 mt-1">{{ emailError }}</p>
                     </div>
                     <div>
                        <input 
                           v-model="phoneNumber"
                           type="tel" 
                           placeholder="Phone number"
                           required
                           :class="[
                              'w-full h-11 px-3 rounded-md border text-sm focus:outline-none focus:ring-2',
                              phoneError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                           ]"
                        />
                        <p v-if="phoneError" class="text-xs text-red-600 mt-1">{{ phoneError }}</p>
                     </div>
                  </div>
               </div>

               <!-- Noted -->
               <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div class="flex items-start gap-4">
                     <div
                        class="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-lg">
                        <i class="fas fa-lightbulb"></i>
                     </div>
                     <div>
                        <div class="text-sm font-semibold text-gray-800 mb-2">Noted *</div>
                        <div class="text-sm text-gray-700 mb-2">Attention! Information for Sleeper Bus*</div>
                        <div class="text-sm text-gray-600">Beds are designed for two people. We are sorry if your bed
                           have difference gender, we will change.</div>
                     </div>
                  </div>
                  <div class="border-t border-gray-100 my-5"></div>
                  <div class="text-sm font-semibold text-gray-800 mb-3">Discount coupon</div>
                  <label class="inline-flex items-center gap-3 text-sm text-gray-700 mb-6">
                     <input type="checkbox" class="w-4 h-4 text-orange-500" />
                     Apply Travel Package Code
                  </label>
                  <label class="inline-flex items-center gap-3 text-sm text-gray-700 mb-6">
                     <input type="checkbox" class="w-4 h-4 text-orange-500" />
                     By clicking on "Process Payment", you agree to the Terms & Conditions and Privacy Policy
                  </label>
                  <button
                     class="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg flex items-center justify-between px-6">
                     <span>Process Payment</span>
                     <span>→</span>
                  </button>
               </div>
            </div>

            <!-- Booking Summary -->
            <div class="lg:col-span-1">
               <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-20">
                  <h2 class="text-base font-semibold text-gray-800 mb-4">Booking summary</h2>
                  <div class="text-sm text-gray-700">Phnom Penh - Siem Reap</div>
                  <div class="text-sm text-gray-500 mt-1">2026-02-11</div>
                  <div class="border-t border-gray-100 my-4"></div>
                  <div class="flex items-center justify-between text-sm text-gray-700">
                     <span>Trip Price</span>
                     <span>$16.15</span>
                  </div>
                  <div class="border-t border-gray-100 my-4"></div>
                  <button class="text-sm text-blue-600 hover:text-blue-700">View Trip Details</button>
                  <div class="border-t border-gray-100 my-4"></div>
                  <div class="flex items-center justify-between text-sm text-gray-700 mb-2">
                     <span>Grand Total:</span>
                     <span>$16.15</span>
                  </div>
                  <div class="flex items-center justify-between text-sm text-gray-700 mb-2">
                     <span>Discount (%):</span>
                     <span>$0.00</span>
                  </div>
                  <div class="flex items-center justify-between text-sm font-semibold text-gray-800">
                     <span>Total:</span>
                     <span>$16.15</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>
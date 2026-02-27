<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { ConfirmBookingRequest } from '~/types/booking'

const nationalityStore = useNationalityStore()
const { nationalities, loading: nationalityLoading, error: nationalityError } = storeToRefs(nationalityStore)
const boardingPointStore = useBoardingPointStore()
const {
   boardingPoints,
   loading: boardingPointLoading,
   error: boardingPointError
} = storeToRefs(boardingPointStore)
const boardingPointStoreBack = useBoardingPointStoreback()
const {
   boardingPoints: boardingPointsBack,
   loading: boardingPointLoadingBack,
   error: boardingPointErrorBack
} = storeToRefs(boardingPointStoreBack)
const dropOffPointStore = useDropOffPointStore()
const {
   dropOffPoints,
   loading: dropOffPointLoading,
   error: dropOffPointError
} = storeToRefs(dropOffPointStore)
const dropOffPointStoreBack = useDropOffPointStoreback()
const {
   dropOffPoints: dropOffPointsBack,
   loading: dropOffPointLoadingBack,
   error: dropOffPointErrorBack
} = storeToRefs(dropOffPointStoreBack)
const passengerPaymentStore = usePassengerPaymentStore()
const {
   isSubmitting,
   paymentError,
   paymentSuccess
} = storeToRefs(passengerPaymentStore)
const selectedBoardingPointId = ref('')
const showBoardingPointList = ref(false)
const selectedDropOffPointId = ref('')
const showDropOffPointList = ref(false)
const selectedReturnBoardingPointId = ref('')
const showReturnBoardingPointList = ref(false)
const selectedReturnDropOffPointId = ref('')
const showReturnDropOffPointList = ref(false)
const route = useRoute()
const router = useRouter()

// Contact form data
const email = ref('')
const phoneNumber = ref('')
const emailError = ref('')
const phoneError = ref('')
const showBookingSummaryModal = ref(false)

interface PassengerForm {
   seatLabel: string
   name: string
   gender: '' | 'female' | 'male'
   nationality: string
   nationalitySearch: string
   showNationalityDropdown: boolean
}

const passengers = ref<PassengerForm[]>([])
const returnPassengers = ref<PassengerForm[]>([])

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

const getQueryValue = (value: string | string[] | undefined): string => {
   if (Array.isArray(value)) return value[0] || ''
   return value || ''
}

const isRoundTrip = computed(() => {
   const tripType = getQueryValue(route.query.tripType as string | string[] | undefined)
   if (tripType === 'round-trip') return true
   return !!getQueryValue(route.query.returnDate as string | string[] | undefined)
})

const outboundSeatLabels = computed(() => {
   const outboundFromQuery = parseSeatList(route.query.outboundSeats)
   if (outboundFromQuery.length > 0) return outboundFromQuery

   if (isRoundTrip.value) {
      return []
   }

   const fromQuery = parseSeatList(route.query.seats)
   if (fromQuery.length > 0) return fromQuery

   if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('selectedSeats')
      const fromStorage = parseSeatList(stored)
      if (fromStorage.length > 0) return fromStorage
   }

   return []
})

const returnSeatLabels = computed(() => {
   if (!isRoundTrip.value) return []

   const fromReturnQuery = parseSeatList(route.query.returnSeats)
   if (fromReturnQuery.length > 0) return fromReturnQuery

   const fromSeats = parseSeatList(route.query.seats)
   return fromSeats
})

const getStoredValue = (key: string): string => {
   if (typeof localStorage === 'undefined') return ''
   return localStorage.getItem(key) || ''
}

const selectedSeatCount = computed(() => outboundSeatLabels.value.length + returnSeatLabels.value.length)

const selectedTotalFare = computed(() => {
   const outboundTotal = toNumber(getQueryValue(route.query.outboundTotalFare as string | string[] | undefined)) ?? 0
   const returnTotal = toNumber(getQueryValue(route.query.returnTotalFare as string | string[] | undefined)) ?? 0

   if (isRoundTrip.value && (outboundTotal > 0 || returnTotal > 0)) {
      return outboundTotal + returnTotal
   }

   const fromQuery = toNumber(getQueryValue(route.query.totalFare as string | string[] | undefined))
   if (fromQuery !== null) return fromQuery

   const fromStorage = toNumber(getStoredValue('selectedTotalFare'))
   return fromStorage ?? 0
})

const tripPrice = computed(() => {
   const fromQuery = toNumber(getQueryValue(route.query.tripPrice as string | string[] | undefined))
   if (fromQuery !== null) return fromQuery

   const fromStorage = toNumber(getStoredValue('selectedTripPrice'))
   if (fromStorage !== null) return fromStorage

   if (selectedSeatCount.value > 0) {
      return Number((selectedTotalFare.value / selectedSeatCount.value).toFixed(2))
   }

   return 0
})

const outboundRouteTitle = computed(() => {
   const from = getQueryValue(route.query.from as string | string[] | undefined)
   const to = getQueryValue(route.query.to as string | string[] | undefined)
   if (from && to) return `${from} - ${to}`
   return bookingRouteTitle.value
})

const returnRouteTitle = computed(() => {
   if (!isRoundTrip.value) return ''

   const from = getQueryValue(route.query.from as string | string[] | undefined)
   const to = getQueryValue(route.query.to as string | string[] | undefined)
   if (from && to) return `${to} - ${from}`

   return bookingRouteTitle.value
})

const returnDepartureDate = computed(() => {
   const fromQuery = getQueryValue(route.query.returnDate as string | string[] | undefined)
   if (fromQuery) return fromQuery
   return getStoredValue('returnDate') || '-'
})

const returnScheduleIdForPoints = computed(() => {
   return (
      getQueryValue(route.query.returnScheduleId as string | string[] | undefined) ||
      getQueryValue(route.query.scheduleId as string | string[] | undefined)
   )
})

const returnDateForPoints = computed(() => {
   return (
      getQueryValue(route.query.returnDate as string | string[] | undefined) ||
      getStoredValue('returnDate') ||
      getStoredValue('dateFrom')
   )
})

const outboundScheduleIdForPoints = computed(() => {
   return (
      getQueryValue(route.query.outboundScheduleId as string | string[] | undefined) ||
      getQueryValue(route.query.scheduleId as string | string[] | undefined) ||
      getStoredValue('journeyid')
   )
})

const outboundDateForPoints = computed(() => {
   return (
      getQueryValue(route.query.departDate as string | string[] | undefined) ||
      getStoredValue('selectedDepartureDate') ||
      getStoredValue('dateFrom')
   )
})

const outboundTripPrice = computed(() => {
   if (isRoundTrip.value) {
      const fromRoundTripQuery = toNumber(getQueryValue(route.query.outboundTotalFare as string | string[] | undefined))
      if (fromRoundTripQuery !== null) return fromRoundTripQuery

      const fallbackTotal = selectedTotalFare.value
      if (fallbackTotal > 0) {
         const backFare = toNumber(getQueryValue(route.query.returnTotalFare as string | string[] | undefined)) ?? 0
         const derived = fallbackTotal - backFare
         return derived > 0 ? Number(derived.toFixed(2)) : 0
      }

      return 0
   }

   const fromOneWayQuery = toNumber(getQueryValue(route.query.totalFare as string | string[] | undefined))
   if (fromOneWayQuery !== null) return fromOneWayQuery

   const fromStorage = toNumber(getStoredValue('selectedTotalFare'))
   if (fromStorage !== null) return fromStorage

   return tripPrice.value
})

const returnTripPrice = computed(() => {
   if (!isRoundTrip.value) return 0

   const fromQuery = toNumber(getQueryValue(route.query.returnTotalFare as string | string[] | undefined))
   if (fromQuery !== null) return fromQuery

   const fallbackTotal = selectedTotalFare.value
   if (fallbackTotal > 0) {
      const goFare = toNumber(getQueryValue(route.query.outboundTotalFare as string | string[] | undefined)) ?? 0
      const derived = fallbackTotal - goFare
      return derived > 0 ? Number(derived.toFixed(2)) : 0
   }

   return 0
})

const totalTripPrice = computed(() => {
   if (isRoundTrip.value) {
      const combined = outboundTripPrice.value + returnTripPrice.value
      if (combined > 0) return Number(combined.toFixed(2))

      if (selectedTotalFare.value > 0) {
         return Number(selectedTotalFare.value.toFixed(2))
      }
   }

   if (outboundTripPrice.value > 0) return outboundTripPrice.value
   if (selectedTotalFare.value > 0) return Number(selectedTotalFare.value.toFixed(2))
   return tripPrice.value
})

const totalDiscountAmount = computed(() => 0)
const grandTotal = computed(() => selectedTotalFare.value)

const formatPrice = (value: number) => `$${value.toFixed(2)}`

const bookingRouteTitle = computed(() => {
   const fromQuery = getQueryValue(route.query.routeTitle as string | string[] | undefined)
   if (fromQuery) return fromQuery

   const from = getQueryValue(route.query.from as string | string[] | undefined)
   const to = getQueryValue(route.query.to as string | string[] | undefined)
   if (from && to) return `${from} - ${to}`

   const fromStorage = getStoredValue('selectedRouteTitle')
   return fromStorage || 'Route information not available'
})

const bookingVehicleType = computed(() => {
   const fromQuery = getQueryValue(route.query.vehicleType as string | string[] | undefined)
   if (fromQuery) return fromQuery
   return getStoredValue('selectedVehicleType') || '-'
})

const bookingDepartureDate = computed(() => {
   const fromQuery = getQueryValue(route.query.departDate as string | string[] | undefined)
   if (fromQuery) return fromQuery
   return getStoredValue('selectedDepartureDate') || getStoredValue('dateFrom') || '-'
})

const bookingDepartureTime = computed(() => {
   const fromQuery = getQueryValue(
      (route.query.departureTime as string | string[] | undefined) ||
      (route.query.departure as string | string[] | undefined)
   )
   if (fromQuery) return fromQuery
   return (
      getStoredValue('selectedDepartureTime') ||
      getStoredValue('departureTime') ||
      '-'
   )
})

const bookingArrivalTime = computed(() => {
   const fromQuery = getQueryValue(
      (route.query.arrivalTime as string | string[] | undefined) ||
      (route.query.arrival as string | string[] | undefined)
   )
   if (fromQuery) return fromQuery
   return (
      getStoredValue('selectedArrivalTime') ||
      getStoredValue('arrivalTime') ||
      '-'
   )
})

const outboundVehicleType = computed(() => {
   const fromQuery = getQueryValue(route.query.outboundVehicleType as string | string[] | undefined)
   if (fromQuery) return fromQuery
   return bookingVehicleType.value
})

const returnVehicleType = computed(() => {
   const fromQuery = getQueryValue(route.query.returnVehicleType as string | string[] | undefined)
   if (fromQuery) return fromQuery
   return bookingVehicleType.value
})

const outboundDepartureTime = computed(() => {
   const fromQuery = getQueryValue(route.query.outboundDepartureTime as string | string[] | undefined)
   if (fromQuery) return fromQuery
   return bookingDepartureTime.value
})

const outboundArrivalTime = computed(() => {
   const fromQuery = getQueryValue(route.query.outboundArrivalTime as string | string[] | undefined)
   if (fromQuery) return fromQuery
   return bookingArrivalTime.value
})

const returnDepartureTime = computed(() => {
   const fromQuery = getQueryValue(route.query.returnDepartureTime as string | string[] | undefined)
   if (fromQuery) return fromQuery
   return bookingDepartureTime.value
})

const returnArrivalTime = computed(() => {
   const fromQuery = getQueryValue(route.query.returnArrivalTime as string | string[] | undefined)
   if (fromQuery) return fromQuery
   return bookingArrivalTime.value
})

const outboundSelectedSeatCount = computed(() => outboundSeatLabels.value.length)
const returnSelectedSeatCount = computed(() => returnSeatLabels.value.length)
const outboundSeatText = computed(() => outboundSeatLabels.value.join(', ') || '-')
const returnSeatText = computed(() => returnSeatLabels.value.join(', ') || '-')

const selectedSeatText = computed(() => {
   const outbound = outboundSeatLabels.value.join(', ')
   const back = returnSeatLabels.value.join(', ')
   if (outbound && back) return `${outbound} | ${back}`
   if (outbound) return outbound
   if (back) return back
   return '-'
})

const openBookingSummaryModal = () => {
   showBookingSummaryModal.value = true
}

const closeBookingSummaryModal = () => {
   showBookingSummaryModal.value = false
}

const syncPassengers = () => {
   const count = outboundSeatLabels.value.length || 1
   const next: PassengerForm[] = []

   for (let i = 0; i < count; i += 1) {
      const seatLabel = outboundSeatLabels.value[i] || `${i + 1}`
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

const syncReturnPassengers = () => {
   const count = returnSeatLabels.value.length || 0
   const next: PassengerForm[] = []

   for (let i = 0; i < count; i += 1) {
      const seatLabel = returnSeatLabels.value[i] || `${i + 1}`
      const existing = returnPassengers.value[i]

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

   returnPassengers.value = next
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

const selectReturnNationality = (index: number, name: string) => {
   const passenger = returnPassengers.value[index]
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

const closeReturnNationalityDropdown = (index: number) => {
   setTimeout(() => {
      const passenger = returnPassengers.value[index]
      if (passenger) passenger.showNationalityDropdown = false
   }, 120)
}

onMounted(() => {
   if (nationalities.value.length === 0) {
      nationalityStore.fetchNationalities()
   }

   boardingPointStore.fetchBoardingPoints(outboundDateForPoints.value, outboundScheduleIdForPoints.value)

   if (isRoundTrip.value && returnScheduleIdForPoints.value) {
      boardingPointStoreBack.fetchBoardingPoints(returnDateForPoints.value, returnScheduleIdForPoints.value)
      dropOffPointStoreBack.fetchDropOffPoints(
         returnScheduleIdForPoints.value,
         returnDateForPoints.value,
         returnScheduleIdForPoints.value
      )
   }

   // Drop-off points will be fetched when boarding point is selected
})

watch(outboundSeatLabels, syncPassengers, { immediate: true })
watch(returnSeatLabels, syncReturnPassengers, { immediate: true })

watch(
   boardingPoints,
   (points) => {
      if (
         selectedBoardingPointId.value &&
         !points.some((point) => point.id === selectedBoardingPointId.value)
      ) {
         selectedBoardingPointId.value = ''
      }

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
      if (
         selectedDropOffPointId.value &&
         !points.some((point) => point.id === selectedDropOffPointId.value)
      ) {
         selectedDropOffPointId.value = ''
      }

      // Only auto-select if there's exactly one drop-off point
      if (!selectedDropOffPointId.value && points.length === 1) {
         selectedDropOffPointId.value = points[0]?.id || ''
      }
   },
   { immediate: true }
)

watch(
   boardingPointsBack,
   (points) => {
      if (
         selectedReturnBoardingPointId.value &&
         !points.some((point) => point.id === selectedReturnBoardingPointId.value)
      ) {
         selectedReturnBoardingPointId.value = ''
      }

      if (isRoundTrip.value && !selectedReturnBoardingPointId.value && points.length === 1) {
         selectedReturnBoardingPointId.value = points[0]?.id || ''
      }
   },
   { immediate: true }
)

watch(
   dropOffPointsBack,
   (points) => {
      if (
         selectedReturnDropOffPointId.value &&
         !points.some((point) => point.id === selectedReturnDropOffPointId.value)
      ) {
         selectedReturnDropOffPointId.value = ''
      }

      if (isRoundTrip.value && !selectedReturnDropOffPointId.value && points.length === 1) {
         selectedReturnDropOffPointId.value = points[0]?.id || ''
      }
   },
   { immediate: true }
)

// Watch for boarding point selection changes and fetch drop-off points
watch(
   selectedBoardingPointId,
   (newBoardingPointId, oldBoardingPointId) => {
      if (newBoardingPointId) {
         if (oldBoardingPointId && oldBoardingPointId !== newBoardingPointId) {
            selectedDropOffPointId.value = ''
         }
         console.log('Boarding point selected, fetching drop-off points for:', newBoardingPointId)
         dropOffPointStore.fetchDropOffPoints(
            newBoardingPointId,
            outboundDateForPoints.value,
            outboundScheduleIdForPoints.value
         )
      }
   },
   { immediate: true }
)

watch(
   selectedReturnBoardingPointId,
   (newBoardingPointId, oldBoardingPointId) => {
      if (isRoundTrip.value && newBoardingPointId) {
         if (oldBoardingPointId && oldBoardingPointId !== newBoardingPointId) {
            selectedReturnDropOffPointId.value = ''
         }
         console.log('Return boarding point selected, fetching return drop-off points for:', newBoardingPointId)
         dropOffPointStoreBack.fetchDropOffPoints(
            newBoardingPointId,
            returnDateForPoints.value,
            returnScheduleIdForPoints.value
         )
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

const selectedReturnBoardingPoint = computed(() => {
   if (boardingPointsBack.value.length === 0) return null
   return (
      boardingPointsBack.value.find((point) => point.id === selectedReturnBoardingPointId.value) ||
      null
   )
})

const selectedReturnDropOffPoint = computed(() => {
   if (dropOffPointsBack.value.length === 0) return null
   return (
      dropOffPointsBack.value.find((point) => point.id === selectedReturnDropOffPointId.value) ||
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

const toggleReturnBoardingPointList = () => {
   showReturnBoardingPointList.value = !showReturnBoardingPointList.value
}

const selectReturnBoardingPoint = (pointId: string) => {
   selectedReturnBoardingPointId.value = pointId
   showReturnBoardingPointList.value = false
}

const toggleReturnDropOffPointList = () => {
   showReturnDropOffPointList.value = !showReturnDropOffPointList.value
}

const selectReturnDropOffPoint = (pointId: string) => {
   selectedReturnDropOffPointId.value = pointId
   showReturnDropOffPointList.value = false
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

const canShowReturnBoardingMap = computed(() => {
   if (boardingPointsBack.value.length === 1) {
      return hasCoordinates(boardingPointsBack.value[0])
   }
   return selectedReturnBoardingPoint.value && hasCoordinates(selectedReturnBoardingPoint.value)
})

const canShowReturnDropOffMap = computed(() => {
   if (dropOffPointsBack.value.length === 1) {
      return hasCoordinates(dropOffPointsBack.value[0])
   }
   return selectedReturnDropOffPoint.value && hasCoordinates(selectedReturnDropOffPoint.value)
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

const viewReturnBoardingMap = () => {
   if (boardingPointsBack.value.length === 1) {
      openMapView(boardingPointsBack.value[0])
   } else if (selectedReturnBoardingPoint.value) {
      openMapView(selectedReturnBoardingPoint.value)
   }
}

const viewReturnDropOffMap = () => {
   if (dropOffPointsBack.value.length === 1) {
      openMapView(dropOffPointsBack.value[0])
   } else if (selectedReturnDropOffPoint.value) {
      openMapView(selectedReturnDropOffPoint.value)
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

watch(email, (newEmail) => {
   emailError.value = validateEmail(newEmail)
}, { immediate: false })

watch(phoneNumber, (newPhone) => {
   phoneError.value = validatePhone(newPhone)
}, { immediate: false })

const toNumber = (value: string): number | null => {
   const parsed = Number(value)
   return Number.isFinite(parsed) ? parsed : null
}

const toMoneyCents = (value: number): number => {
   const normalized = Number.isFinite(value) ? value : 0
   return Math.round(normalized * 100)
}

const buildSeatPriceBreakdown = (totalAmount: number, seatCount: number): number[] => {
   if (seatCount <= 0) return []

   const safeTotalCents = Math.max(0, toMoneyCents(totalAmount))
   const baseCents = Math.floor(safeTotalCents / seatCount)
   const remainderCents = safeTotalCents - baseCents * seatCount

   return Array.from({ length: seatCount }, (_, index) => {
      const cents = baseCents + (index === seatCount - 1 ? remainderCents : 0)
      return cents / 100
   })
}

const toGenderCode = (gender: PassengerForm['gender']): number => (gender === 'female' ? 1 : 2)

const normalizeSeatNumber = (label: string): string => String(label).replace(/[^0-9]/g, '')

const processPayment = async () => {
   if (isSubmitting.value) return

   paymentError.value = ''
   paymentSuccess.value = ''

   const normalizedEmail = email.value.trim().toLowerCase()
   const normalizedPhone = phoneNumber.value.trim()
   if (email.value !== normalizedEmail) {
      email.value = normalizedEmail
   }
   if (phoneNumber.value !== normalizedPhone) {
      phoneNumber.value = normalizedPhone
   }

   emailError.value = validateEmail(email.value)
   phoneError.value = validatePhone(phoneNumber.value)

   if (emailError.value || phoneError.value) {
      paymentError.value = 'Please complete contact details with valid email and phone number.'
      return
   }

   if (!selectedBoardingPointId.value || !selectedDropOffPointId.value) {
      paymentError.value = 'Boarding point and drop-off point are required.'
      return
   }

   if (!selectedBoardingPoint.value || !selectedDropOffPoint.value) {
      paymentError.value = 'Please reselect a valid boarding point and drop-off point.'
      return
   }

   if (isRoundTrip.value && (!selectedReturnBoardingPointId.value || !selectedReturnDropOffPointId.value)) {
      paymentError.value = 'Return trip boarding point and drop-off point are required.'
      return
   }

   if (isRoundTrip.value && (!selectedReturnBoardingPoint.value || !selectedReturnDropOffPoint.value)) {
      paymentError.value = 'Please reselect valid return-trip boarding point and drop-off point.'
      return
   }

   if (passengers.value.some((passenger) => !passenger.gender)) {
      paymentError.value = 'Please select gender for all passengers.'
      return
   }

   if (isRoundTrip.value && returnPassengers.value.some((passenger) => !passenger.gender)) {
      paymentError.value = 'Please select gender for all return-trip passengers.'
      return
   }

   const outboundJourneyId =
      getQueryValue(route.query.outboundScheduleId as string | string[] | undefined) ||
      getQueryValue(route.query.scheduleId as string | string[] | undefined) ||
      (typeof localStorage !== 'undefined' ? localStorage.getItem('journeyid') || '' : '')
   const outboundJourneyDate =
      getQueryValue(route.query.departDate as string | string[] | undefined) ||
      (typeof localStorage !== 'undefined' ? localStorage.getItem('dateFrom') || '' : '')

   const returnJourneyId =
      getQueryValue(route.query.returnScheduleId as string | string[] | undefined) ||
      (typeof localStorage !== 'undefined' ? localStorage.getItem('journeyidback') || '' : '') ||
      getQueryValue(route.query.scheduleId as string | string[] | undefined)
   const returnJourneyDate =
      getQueryValue(route.query.returnDate as string | string[] | undefined) ||
      (typeof localStorage !== 'undefined' ? localStorage.getItem('dateTo') || '' : '') ||
      (typeof localStorage !== 'undefined' ? localStorage.getItem('returnDate') || '' : '')

   if (!outboundJourneyId || !outboundJourneyDate) {
      paymentError.value = 'Missing journey ID or journey date.'
      return
   }

   if (isRoundTrip.value && (!returnJourneyId || !returnJourneyDate)) {
      paymentError.value = 'Missing return journey ID or return date.'
      return
   }

   const boardingPointId = toNumber(selectedBoardingPointId.value)
   const dropOffId = toNumber(selectedDropOffPointId.value)
   const returnBoardingPointId = toNumber(selectedReturnBoardingPointId.value)
   const returnDropOffId = toNumber(selectedReturnDropOffPointId.value)

   if (boardingPointId === null || dropOffId === null) {
      paymentError.value = 'Boarding point and drop-off point must be valid numeric IDs.'
      return
   }

   if (isRoundTrip.value && (returnBoardingPointId === null || returnDropOffId === null)) {
      paymentError.value = 'Return boarding point and drop-off point must be valid numeric IDs.'
      return
   }

   const outboundSeatNumRaw = outboundSeatLabels.value.length > 0
      ? outboundSeatLabels.value
      : passengers.value.map((passenger) => passenger.seatLabel)

   const returnSeatNumRaw = isRoundTrip.value
      ? (returnSeatLabels.value.length > 0
         ? returnSeatLabels.value
         : returnPassengers.value.map((passenger) => passenger.seatLabel))
      : []

   const seatNumRaw = [...outboundSeatNumRaw, ...returnSeatNumRaw]

   const seatNum = seatNumRaw.map((label) => normalizeSeatNumber(label)).filter(Boolean)

   if (seatNum.length === 0) {
      paymentError.value = 'At least one seat is required.'
      return
   }

   if (seatNum.length !== seatNumRaw.length) {
      paymentError.value = 'Seat numbers must contain digits only.'
      return
   }

   const totalAmount = Number(selectedTotalFare.value.toFixed(2))
   const outboundTotalFare = toNumber(getQueryValue(route.query.outboundTotalFare as string | string[] | undefined)) ??
      (isRoundTrip.value ? 0 : selectedTotalFare.value)
   const returnTotalFare = toNumber(getQueryValue(route.query.returnTotalFare as string | string[] | undefined)) ??
      (isRoundTrip.value ? (toNumber(getQueryValue(route.query.totalFare as string | string[] | undefined)) ?? 0) : 0)

   const outboundSeatPrices = buildSeatPriceBreakdown(outboundTotalFare, outboundSeatNumRaw.length)
   const returnSeatPrices = buildSeatPriceBreakdown(returnTotalFare, returnSeatNumRaw.length)
   const seatPrices = [...outboundSeatPrices, ...returnSeatPrices]
   const seatPriceTotal = Number(seatPrices.reduce((sum, price) => sum + price, 0).toFixed(2))
   const fallbackSeatPrices = buildSeatPriceBreakdown(totalAmount, seatNum.length)
   const normalizedSeatPrices = seatPriceTotal > 0 ? seatPrices : fallbackSeatPrices
   const normalizedTotalAmount = Number(
      (seatPriceTotal > 0 ? seatPriceTotal : totalAmount).toFixed(2)
   )

   const journeyTypeRaw =
      getQueryValue(route.query.type as string | string[] | undefined) ||
      (typeof localStorage !== 'undefined' ? localStorage.getItem('types') || '1' : '1')

   const journeyType = isRoundTrip.value ? 2 : (toNumber(journeyTypeRaw) ?? 1)

   const nationallyRaw =
      getQueryValue(route.query.nationally as string | string[] | undefined) ||
      (typeof localStorage !== 'undefined' ? localStorage.getItem('nationally') || '1' : '1')

   const nationally = toNumber(nationallyRaw) ?? 1

   const nationalIdMap = new Map(
      nationalities.value.map((item) => [item.name.trim().toLowerCase(), toNumber(item.id)])
   )

   const resolvedSeatNationallyIds = passengers.value
      .map((passenger) => {
         const key = passenger.nationality.trim().toLowerCase()
         return key ? nationalIdMap.get(key) ?? null : null
      })
      .filter((id): id is number => id !== null)

   const payload: ConfirmBookingRequest = {
      boardingPointId: isRoundTrip.value && returnBoardingPointId !== null ? [boardingPointId, returnBoardingPointId] : [boardingPointId],
      dropOffId: isRoundTrip.value && returnDropOffId !== null ? [dropOffId, returnDropOffId] : [dropOffId],
      journeyDate: isRoundTrip.value ? [outboundJourneyDate, returnJourneyDate] : [outboundJourneyDate],
      journeyId: isRoundTrip.value ? [outboundJourneyId, returnJourneyId] : [outboundJourneyId],
      journeyType,
      nationally,
      seatGender: [
         ...passengers.value.map((passenger) => toGenderCode(passenger.gender)),
         ...returnPassengers.value.map((passenger) => toGenderCode(passenger.gender))
      ],
      seatJourney: [
         ...outboundSeatNumRaw.map(() => outboundJourneyId),
         ...returnSeatNumRaw.map(() => returnJourneyId)
      ],
      seatNum,
      seatPrice: normalizedSeatPrices,
      totalAmount: normalizedTotalAmount,
      totalDiscount: 0,
      totalSeat: String(seatNum.length),
      email: email.value.trim() || undefined,
      telephone: phoneNumber.value.trim() || undefined,
      seatName: [...passengers.value, ...returnPassengers.value].some((passenger) => passenger.name.trim())
         ? [...passengers.value, ...returnPassengers.value].map((passenger) => passenger.name.trim())
         : undefined,
      seatNationallyId: (() => {
         const allPassengers = [...passengers.value, ...returnPassengers.value]
         const ids = allPassengers
            .map((passenger) => {
               const key = passenger.nationality.trim().toLowerCase()
               return key ? nationalIdMap.get(key) ?? null : null
            })
            .filter((id): id is number => id !== null)
         return ids.length > 0 ? ids : undefined
      })()
   }

   const firstPassenger = passengers.value[0]
   const passengerGenders = [...passengers.value, ...returnPassengers.value]
      .map((passenger) => passenger.gender)
      .filter((value) => !!value)
   const outboundPassengerGenders = passengers.value
      .map((passenger) => passenger.gender)
      .filter((value) => !!value)
   const returnPassengerGenders = returnPassengers.value
      .map((passenger) => passenger.gender)
      .filter((value) => !!value)
   const outboundPassengerNationalities = passengers.value
      .map((passenger) => passenger.nationality.trim())
      .filter((value) => !!value)
   const returnPassengerNationalities = returnPassengers.value
      .map((passenger) => passenger.nationality.trim())
      .filter((value) => !!value)
   const passengerNationalities = [...passengers.value, ...returnPassengers.value]
      .map((passenger) => passenger.nationality.trim())
      .filter((value) => !!value)

   const target = await passengerPaymentStore.confirmBookingAndBuildPaymentTarget({
      payload,
      routeTitle: bookingRouteTitle.value,
      vehicleType: bookingVehicleType.value,
      departDate: bookingDepartureDate.value,
      departureTime: bookingDepartureTime.value,
      seatNo: selectedSeatText.value,
      totalFare: grandTotal.value,
      tripType: isRoundTrip.value ? 'round-trip' : 'one-way',
      outboundRouteTitle: outboundRouteTitle.value,
      returnRouteTitle: returnRouteTitle.value,
      outboundVehicleType: outboundVehicleType.value,
      returnVehicleType: returnVehicleType.value,
      outboundDepartDate: bookingDepartureDate.value,
      returnDepartDate: returnDepartureDate.value,
      outboundDepartureTime: outboundDepartureTime.value,
      returnDepartureTime: returnDepartureTime.value,
      outboundSeats: outboundSeatText.value,
      returnSeats: returnSeatText.value,
      outboundSeatCount: outboundSelectedSeatCount.value,
      returnSeatCount: returnSelectedSeatCount.value,
      outboundGenders: outboundPassengerGenders,
      returnGenders: returnPassengerGenders,
      outboundNationalities: outboundPassengerNationalities,
      returnNationalities: returnPassengerNationalities,
      email: email.value,
      genders: passengerGenders,
      nationalities: passengerNationalities,
      firstGender: firstPassenger?.gender || undefined,
      firstNationality: firstPassenger?.nationality || undefined
   })

   if (target) {
      await navigateTo(target)
   }
}
</script>

<template>
   <div class="min-h-screen bg-gray-50">
      <div class="container mx-auto py-10">
         <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 space-y-6">
               <!-- one way-->
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

                     <!-- boarding point -->
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
                        <!-- Drop-off point -->
                        <div class="border-gray-200 rounded-lg text-sm text-gray-700">
                           <div v-if="dropOffPointLoading" class="text-sm text-gray-500">Loading drop-off points...
                           </div>
                           <div v-else-if="dropOffPointError" class="text-sm text-red-600">{{ dropOffPointError }}</div>
                           <div v-else-if="dropOffPoints.length === 0" class="text-sm text-gray-500">
                              {{ selectedBoardingPointId
                                 ? 'No drop-off points found for selected boarding point.'
                                 : 'Please select boarding point first.' }}
                           </div>
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
               <!-- Round Trip -->
               <div v-if="isRoundTrip" class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div class="flex items-center justify-between mb-4">
                     <h2 class="text-base font-semibold text-gray-800">Return Trip</h2>
                  </div>
                  <div class="border-t border-gray-100 pt-4">
                     <div v-for="(passenger, index) in returnPassengers" :key="`return-${passenger.seatLabel}`" class="mb-6">
                        <div class="text-sm font-semibold text-gray-700 mb-3">
                           Passenger {{ index + 1 }}: <span class="text-blue-600">#{{ passenger.seatLabel }}</span>
                        </div>
                        <div class="flex items-center gap-6 mb-4">
                           <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                              <input v-model="passenger.gender" type="radio" :name="`return-gender-${index}`" value="female"
                                 required class="text-orange-500" />
                              Female
                           </label>
                           <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                              <input v-model="passenger.gender" type="radio" :name="`return-gender-${index}`" value="male"
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
                                 @blur="closeReturnNationalityDropdown(index)" />
                              <i
                                 class="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                              <div v-if="passenger.showNationalityDropdown"
                                 class="absolute z-10 mt-1 w-full max-h-56 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
                                 <button v-for="item in getFilteredNationalities(passenger.nationalitySearch)"
                                    :key="item.id" type="button"
                                    class="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                                    @mousedown.prevent="selectReturnNationality(index, item.name)">
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

                     <!-- boarding point back -->
                     <div class="mt-6 space-y-4">
                        <div class="border-gray-200 rounded-lg text-sm text-gray-700">
                           <div v-if="boardingPointLoadingBack" class="text-sm text-gray-500">Loading boarding points...
                           </div>
                           <div v-else-if="boardingPointErrorBack" class="text-sm text-red-600">{{ boardingPointErrorBack }}
                           </div>
                           <div v-else-if="boardingPointsBack.length === 0" class="text-sm text-gray-500">No boarding points
                              found.</div>
                           <div v-else class="space-y-3">
                              <div v-if="boardingPointsBack.length > 0" class="relative">
                                 <div class="flex justify-between">
                                    <label class="block text-xs font-semibold text-gray-600 mb-2">Boarding Point <span
                                          class="text-red-500">*</span></label>
                                    <button
                                       v-if="canShowReturnBoardingMap"
                                       @click="viewReturnBoardingMap"
                                       class="text-xs text-orange-500 italic hover:text-orange-600 cursor-pointer"
                                       type="button"
                                    >
                                       View Map
                                    </button>
                                 </div>
                                 <button type="button"
                                    class="w-full p-3 rounded-md border border-gray-300 text-sm bg-white flex items-center justify-between hover:border-orange-400"
                                    @click="toggleReturnBoardingPointList">
                                    <div class="flex items-start gap-2">
                                       <span><i class="fas fa-map-marker-alt text-orange-500"></i></span>
                                       <div class="flex flex-col items-start leading-tight">
                                          <span class="text-gray-700 font-semibold">
                                             {{ selectedReturnBoardingPoint?.name || (boardingPointsBack.length > 1 ? 'Please select boarding point' : 'Boarding Point') }}
                                          </span>
                                          <span v-if="selectedReturnBoardingPoint?.address" class="text-sm text-gray-600">{{
                                             selectedReturnBoardingPoint.address }}</span>
                                       </div>
                                    </div>
                                    <i v-if="boardingPointsBack.length > 1" class="fas fa-chevron-down text-gray-400"></i>
                                 </button>
                                 <div v-if="showReturnBoardingPointList && boardingPointsBack.length > 1"
                                    class="absolute z-20 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                                    <div class="max-h-64 overflow-auto px-4 p-4 space-y-3">
                                       <label v-for="point in boardingPointsBack" :key="`return-b-${point.id}`"
                                          class="flex items-start gap-3 rounded-lg border border-gray-200 p-3 cursor-pointer hover:border-orange-300">
                                          <input type="radio" class="mt-1" :value="point.id"
                                             v-model="selectedReturnBoardingPointId"
                                             @change="selectReturnBoardingPoint(point.id)" />
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

                        <!-- Drop-off point back -->
                        <div class="border-gray-200 rounded-lg text-sm text-gray-700">
                           <div v-if="dropOffPointLoadingBack" class="text-sm text-gray-500">Loading drop-off points...
                           </div>
                           <div v-else-if="dropOffPointErrorBack" class="text-sm text-red-600">{{ dropOffPointErrorBack }}</div>
                           <div v-else-if="dropOffPointsBack.length === 0" class="text-sm text-gray-500">
                              {{ selectedReturnBoardingPointId
                                 ? 'No drop-off points found for selected boarding point.'
                                 : 'Please select boarding point first.' }}
                           </div>
                           <div v-else class="space-y-3">
                              <div v-if="dropOffPointsBack.length > 0" class="relative">
                                 <div class="flex justify-between">
                                    <label class="block text-xs font-semibold text-gray-600 mb-2">Drop Off Point <span
                                          class="text-red-500">*</span></label>
                                    <button
                                       v-if="canShowReturnDropOffMap"
                                       @click="viewReturnDropOffMap"
                                       class="text-xs text-orange-500 italic hover:text-orange-600 cursor-pointer"
                                       type="button"
                                    >
                                       View Map
                                    </button>
                                 </div>

                                 <button type="button"
                                    class="w-full p-3 rounded-md border border-gray-300 text-sm bg-white flex items-start justify-between hover:border-orange-400"
                                    @click="toggleReturnDropOffPointList">
                                    <div class="flex items-start gap-2 flex-1 min-w-0">
                                       <span class="flex-shrink-0"><i
                                             class="fas fa-map-marker-alt text-orange-500"></i></span>
                                       <div class="flex flex-col items-start leading-tight gap-1 min-w-0 flex-1">
                                          <span class="text-gray-700 font-semibold break-words">
                                             {{ selectedReturnDropOffPoint?.name || 'Drop Off Point' }}
                                          </span>
                                          <span v-if="selectedReturnDropOffPoint?.address"
                                             class="text-sm text-gray-600 break-words text-start">{{
                                             selectedReturnDropOffPoint.address }}</span>
                                       </div>
                                    </div>
                                    <i v-if="dropOffPointsBack.length > 1"
                                       class="fas fa-chevron-down text-gray-400 flex-shrink-0"></i>
                                 </button>
                                 <div v-if="showReturnDropOffPointList && dropOffPointsBack.length > 1"
                                    class="absolute z-20 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                                    <div class="max-h-64 overflow-auto px-4 p-4 space-y-3">
                                       <label v-for="point in dropOffPointsBack" :key="`return-d-${point.id}`"
                                          class="flex items-start gap-3 rounded-lg border border-gray-200 p-3 cursor-pointer hover:border-orange-300">
                                          <input type="radio" class="mt-1" :value="point.id"
                                             v-model="selectedReturnDropOffPointId" @change="selectReturnDropOffPoint(point.id)" />
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
                  <p v-if="paymentError" class="mb-3 text-sm text-red-600">{{ paymentError }}</p>
                  <p v-if="paymentSuccess" class="mb-3 text-sm text-green-600">{{ paymentSuccess }}</p>
                  <button
                     :disabled="isSubmitting"
                     class="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-semibold py-3 rounded-lg flex items-center justify-between px-6"
                     @click="processPayment">
                     <span>{{ isSubmitting ? 'Processing...' : 'Process Payment' }}</span>
                     <span>→</span>
                  </button>
               </div>
            </div>

            <!-- Booking Summary -->
            <div class="lg:col-span-1">
               <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-20">
                  <h2 class="text-base font-semibold text-gray-800 mb-4">Booking summary</h2>
                  <template v-if="isRoundTrip">
                     <div class="text-sm text-gray-700">{{ outboundRouteTitle }}</div>
                     <div class="text-sm text-gray-500 mt-1">{{ bookingDepartureDate }}</div>
                     <div class="flex items-center justify-between text-sm text-gray-700 mt-2">
                        <span>Trip Price</span>
                        <span>{{ formatPrice(outboundTripPrice) }}</span>
                     </div>
                     <div class="border-t border-gray-100 my-4"></div>
                     <div class="text-sm text-gray-700">{{ returnRouteTitle }}</div>
                     <div class="text-sm text-gray-500 mt-1">{{ returnDepartureDate }}</div>
                     <div class="flex items-center justify-between text-sm text-gray-700 mt-2">
                        <span>Trip Price</span>
                        <span>{{ formatPrice(returnTripPrice) }}</span>
                     </div>
                  </template>
                  <template v-else>
                     <div class="text-sm text-gray-700">{{ bookingRouteTitle }}</div>
                     <div class="text-sm text-gray-500 mt-1">{{ bookingDepartureDate }}</div>
                     <div class="border-t border-gray-100 my-4"></div>
                     <div class="flex items-center justify-between text-sm text-gray-700">
                        <span>Trip Price</span>
                        <span>{{ formatPrice(totalTripPrice) }}</span>
                     </div>
                  </template>
                  <div class="border-t border-gray-100 my-4"></div>
                  <button class="text-sm text-blue-600 hover:text-blue-700" @click="openBookingSummaryModal">View Trip Details</button>
                  <div class="border-t border-gray-100 my-4"></div>
                  <div class="flex items-center justify-between text-sm text-gray-700 mb-2">
                     <span>Grand Total:</span>
                     <span>{{ formatPrice(grandTotal) }}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm text-gray-700 mb-2">
                     <span>Discount (%):</span>
                     <span>{{ formatPrice(totalDiscountAmount) }}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm font-semibold text-gray-800">
                     <span>Total:</span>
                     <span>{{ formatPrice(grandTotal - totalDiscountAmount) }}</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div
         v-if="showBookingSummaryModal"
         class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
         @click="closeBookingSummaryModal"
      >
         <div class="w-full max-w-md max-h-[90vh] rounded-xl bg-white p-7 shadow-2xl overflow-hidden" @click.stop>
            <div class="mb-5 flex items-center justify-between">
               <h3 class="text-lg font-semibold text-gray-800">Booking summary</h3>
               <button class="text-2xl text-gray-600 hover:text-gray-800" @click="closeBookingSummaryModal">×</button>
            </div>

            <div class="max-h-[72vh] overflow-y-auto pr-2 space-y-6 text-lg text-gray-700">
               <template v-if="isRoundTrip">
                  <div class="space-y-4">
                     <div>{{ outboundRouteTitle }}</div>
                     <div class="grid grid-cols-[10rem_minmax(0,1fr)] gap-y-4">
                        <span>Vehicle Type</span>
                        <span>: {{ outboundVehicleType }}</span>
                        <span>Departure Date</span>
                        <span>: {{ bookingDepartureDate }}</span>
                        <span>Departure Time</span>
                        <span>: {{ outboundDepartureTime }}</span>
                        <span>Arrival Time</span>
                        <span>: {{ outboundArrivalTime }}</span>
                        <span>Selected Seat</span>
                        <span>: {{ outboundSelectedSeatCount }}</span>
                        <span>Seat No.</span>
                        <span>: {{ outboundSeatText }}</span>
                        <span>Trip Price</span>
                        <span>: {{ formatPrice(outboundTripPrice) }}</span>
                     </div>
                  </div>

                  <div class="border-t border-dashed border-gray-300"></div>

                  <div class="space-y-4">
                     <div>{{ returnRouteTitle }}</div>
                     <div class="grid grid-cols-[10rem_minmax(0,1fr)] gap-y-4">
                        <p>Vehicle Type</p>
                        <p>: {{ returnVehicleType }}</p>
                        <p>Departure Date</p>
                        <p>: {{ returnDepartureDate }}</p>
                        <p>Departure Time</p>
                        <p>: {{ returnDepartureTime }}</p>
                        <p>Arrival Time</p>
                        <p>: {{ returnArrivalTime }}</p>
                        <p>Selected Seat</p>
                        <p>: {{ returnSelectedSeatCount }}</p>
                        <p>Seat No.</p>
                        <p>: {{ returnSeatText }}</p>
                        <p>Trip Price</p>
                        <p>: {{ formatPrice(returnTripPrice) }}</p>
                     </div>
                  </div>
               </template>

               <template v-else>
                  <div>{{ bookingRouteTitle }}</div>
                  <div class="grid grid-cols-[10rem_minmax(0,1fr)] gap-y-4">
                     <p>Vehicle Type</p>
                     <p>: {{ bookingVehicleType }}</p>
                     <p>Departure Date</p>
                     <p>: {{ bookingDepartureDate }}</p>
                     <p>Departure Time</p>
                     <p>: {{ bookingDepartureTime }}</p>
                     <p>Arrival Time</p>
                     <p>: {{ bookingArrivalTime }}</p>
                     <p>Selected Seat</p>
                     <p>: {{ selectedSeatCount }}</p>
                     <p>Seat No.</p>
                     <p>: {{ selectedSeatText }}</p>
                     <p>Trip Price</p>
                     <p>: {{ formatPrice(totalTripPrice) }}</p>
                  </div>
               </template>
            </div>
         </div>
      </div>
   </div>
</template>
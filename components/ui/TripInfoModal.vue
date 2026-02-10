<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeModal"></div>

        <!-- Modal Content -->
        <div class="relative bg-white rounded-lg shadow-xl w-full container max-h-[80vh] overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-800">More Information About Bus</h2>
            <button @click="closeModal"
              class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex h-[calc(80vh-70px)]">
            <!-- Sidebar Navigation -->
            <div class="w-48 bg-gray-900 text-white flex-shrink-0">
              <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                'w-full px-6 py-4 text-left transition-colors',
                activeTab === tab.id
                  ? 'bg-blue-900 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              ]">
                {{ tab.label }}
              </button>
            </div>

            <!-- Main Content Area -->
            <div class="flex-1 overflow-y-auto p-6">
              <!-- Trip Info Tab -->
              <div v-if="activeTab === 'tripInfo'" class="space-y-6 overflow-y-auto">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Description</h3>
                <div class="space-y-4 text-gray-700 leading-relaxed">
                  <p v-if="schedule.description">{{ schedule.description }}</p>
                  <template v-else>
                    <p class="font-medium">
                      {{ schedule.origin }}-{{ schedule.destination }} ({{ schedule.transportationType }}) Journey
                      Details {{ schedule.scheduleType === 3 ? 'Vice Versa' : '' }}
                    </p>
                    <p>
                      Embarking on a journey between {{ schedule.origin }} and {{ schedule.destination }} promises a
                      blend of comfort and convenience, especially when traveling in a {{ schedule.transportationType
                      }}. To whom to save time and accommodation, {{ schedule.transportationType }} is the best choice.
                    </p>
                  </template>

                  <div v-if="schedule.note" class="mt-4">
                    <p class="font-medium text-gray-800">Additional Notes:</p>
                    <p>{{ schedule.note }}</p>
                  </div>
                </div>
              </div>

              <!-- Boarding Tab -->
              <div v-if="activeTab === 'boarding'" class="space-y-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Boarding Information</h3>
                <div class="space-y-4">
                  <div v-if="schedule.boardingPointLists && schedule.boardingPointLists.length > 0"
                    class="space-y-2">
                    <p class="font-medium text-gray-800">Available Boarding Points:</p>
                    <div v-for="(point, index) in schedule.boardingPointLists" :key="index"
                      :ref="(el) => { if (el) boardingPointRefs[index] = el as HTMLElement }"
                      :class="[
                        'bg-gray-50 p-3 rounded',
                        currentPointIndex === index ? 'ring-2 ring-orange-400' : ''
                      ]">
                      <p class="text-gray-700">{{ point.name || point.location }}</p>
                      <p v-if="point.address" class="text-sm text-gray-600">{{ point.address }}</p>
                      <div v-if="hasPointCoords(point)" class="mt-3">
                        <iframe
                          :src="getMapUrl(getPointLat(point), getPointLng(point))"
                          class="w-full h-96 rounded-lg border border-gray-200"
                          loading="lazy"
                          referrerpolicy="no-referrer-when-downgrade"
                          allowfullscreen
                        ></iframe>
                      </div>
                    </div>
                  </div>

                  <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
                    <p class="text-sm text-blue-800">
                      <strong>Note:</strong> Please arrive at the boarding point at least 15 minutes before departure
                      time.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Drop Off Tab -->
              <div v-if="activeTab === 'dropOff'" class="space-y-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Drop Off Information</h3>
                <div class="space-y-4">
                  <div v-if="schedule.dropOffPointLists && schedule.dropOffPointLists.length > 0" class="space-y-2">
                    <p class="font-medium text-gray-800">Available Drop Off Points:</p>
                    <div v-for="(point, index) in schedule.dropOffPointLists" :key="index"
                      :ref="(el) => { if (el) dropOffPointRefs[index] = el as HTMLElement }"
                      :class="[
                        'bg-gray-50 p-3 rounded',
                        currentPointIndex === index ? 'ring-2 ring-orange-400' : ''
                      ]">
                      <p class="text-gray-700">{{ point.name || point.location }}</p>
                      <p v-if="point.address" class="text-sm text-gray-600">{{ point.address }}</p>
                      <div v-if="hasPointCoords(point)" class="mt-3">
                        <iframe
                          :src="getMapUrl(getPointLat(point), getPointLng(point))"
                          class="w-full h-96 rounded-lg border border-gray-200"
                          loading="lazy"
                          referrerpolicy="no-referrer-when-downgrade"
                          allowfullscreen
                        ></iframe>
                      </div>
                    </div>
                  </div>

                  <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
                    <p class="text-sm text-blue-800">
                      <strong>Note:</strong> Upon arrival, passengers are dropped off at the designated location.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Gallery Tab -->
              <div v-if="activeTab === 'gallery'">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Gallery</h3>
                <div v-if="galleryPhotos.length > 0" class="relative">
                  <div class="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                    <img :src="galleryPhotos[currentSlide]" :alt="`Gallery image ${currentSlide + 1}`"
                      class="w-full h-full object-cover" />

                    <div
                      class="absolute top-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                      {{ currentSlide + 1 }} / {{ galleryPhotos.length }}
                    </div>

                    <button @click="prevSlide"
                      class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button @click="nextSlide"
                      class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  <div class="flex justify-center gap-2 mt-4">
                    <button v-for="(_, index) in galleryPhotos" :key="index" @click="goToSlide(index)"
                      :class="[
                        'w-2.5 h-2.5 rounded-full transition',
                        currentSlide === index ? 'bg-white border border-gray-400 shadow' : 'bg-gray-300'
                      ]"
                      aria-label="Go to slide"
                    ></button>
                  </div>
                </div>
                <div v-else class="text-center py-12 text-gray-500">
                  <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>No gallery images available</p>
                </div>
              </div>

              <!-- Amenities Tab -->
              <div v-if="activeTab === 'amenities'">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Amenities & Features</h3>
                <div v-if="schedule.amenities && schedule.amenities.length > 0"
                  class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                  <div v-for="(amenity, index) in schedule.amenities" :key="index" class="flex flex-col items-center">
                    <div
                      class="w-14 h-14 rounded-full border-2 border-orange-500 flex items-center justify-center bg-white">
                      <img :src="amenity.icon || amenity.photo || amenity.url || amenity"
                        :alt="amenity.name || amenity.title || 'Amenity'" class="w-8 h-8 object-contain" />
                    </div>
                    <p class="mt-2 text-xs text-gray-700 text-center">
                      {{ amenity.name || amenity.title || amenity }}
                    </p>
                  </div>
                </div>
                <div v-else class="text-center py-12 text-gray-500">
                  <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>No amenities available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
const { t } = useI18n()

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
  isOpen: boolean
  schedule: Schedule
  initialTab?: string
  initialPointIndex?: number | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const activeTab = ref('tripInfo')
const currentPointIndex = ref<number | null>(null)
const currentSlide = ref(0)
const boardingPointRefs = ref<HTMLElement[]>([])
const dropOffPointRefs = ref<HTMLElement[]>([])

const hasBoardingCoords = computed(() => {
  return Boolean(props.schedule.boardingPointLats && props.schedule.boardingPointLongs)
})

const hasDropOffCoords = computed(() => {
  return Boolean(props.schedule.dropOffPointLats && props.schedule.dropOffPointLongs)
})

const getMapUrl = (lat?: string, lng?: string) => {
  if (!lat || !lng) return ''
  const query = encodeURIComponent(`${lat},${lng}`)
  return `https://www.google.com/maps?q=${query}&z=15&output=embed`
}

const getPointLat = (point: any) => {
  return point?.lat || point?.lats || point?.latitude || point?.boardingPointLats || point?.dropOffPointLats
}

const getPointLng = (point: any) => {
  return point?.lng || point?.longs || point?.longitude || point?.boardingPointLongs || point?.dropOffPointLongs
}

const hasPointCoords = (point: any) => {
  return Boolean(getPointLat(point) && getPointLng(point))
}

const galleryPhotos = computed(() => {
  if (props.schedule.slidePhoto && props.schedule.slidePhoto.length > 0) {
    return props.schedule.slidePhoto
      .map((photo: any) => photo?.photo || photo?.url || photo)
      .filter(Boolean)
  }
  return []
})

const prevSlide = () => {
  if (galleryPhotos.value.length === 0) return
  currentSlide.value = (currentSlide.value - 1 + galleryPhotos.value.length) % galleryPhotos.value.length
}

const nextSlide = () => {
  if (galleryPhotos.value.length === 0) return
  currentSlide.value = (currentSlide.value + 1) % galleryPhotos.value.length
}

const goToSlide = (index: number) => {
  if (galleryPhotos.value.length === 0) return
  currentSlide.value = Math.min(Math.max(index, 0), galleryPhotos.value.length - 1)
}

const tabs = [
  { id: 'tripInfo', label: 'Trip Info' },
  { id: 'boarding', label: 'Boarding' },
  { id: 'dropOff', label: 'Drop Off' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'amenities', label: 'Amenities' }
]

const closeModal = () => {
  emit('close')
}

const scrollToPoint = async (tab: string, index: number | null) => {
  if (index === null || index < 0) return
  await nextTick()
  const refs = tab === 'boarding' ? boardingPointRefs.value : dropOffPointRefs.value
  const target = refs[index]
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

watch(
  () => [props.isOpen, props.initialTab, props.initialPointIndex] as const,
  ([isOpen, initialTab, initialPointIndex]) => {
    if (!isOpen) return
    if (initialTab) {
      activeTab.value = initialTab
    }
    currentPointIndex.value =
      typeof initialPointIndex === 'number' ? initialPointIndex : null
    if (initialTab === 'boarding' || initialTab === 'dropOff') {
      scrollToPoint(initialTab, currentPointIndex.value)
    }
  },
  { immediate: true }
)

watch(activeTab, (tab) => {
  if (tab === 'boarding' || tab === 'dropOff') {
    scrollToPoint(tab, currentPointIndex.value)
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>

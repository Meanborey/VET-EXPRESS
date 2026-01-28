<template>
  <section class="bg-white py-16 px-4">
    <div class="container mx-auto">
      <!-- Section Title -->
      <div class="text-start mb-12">
        <h2 class="text-4xl font-semibold mb-4">
          VET Gallery
        </h2>
      </div>

      <div class="space-y-8">
        <h2 class="text-orange-500 text-2xl font-semibold">Vireak Buntham Express Travel</h2>
        <!-- Vehicle Gallery Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8">
          <!-- Vehicle Card -->
          <div v-for="vehicle in vehicles" :key="vehicle.id"
            class="group bg-white rounded-2xl shadow-lg overflow-hidden  duration-300 transform h-fit">
            <div class="relative overflow-hidden cursor-pointer" @click="openModal(vehicle)">
              <img :src="vehicle.image" :alt="vehicle.name"
                class="w-full h-56 object-cover  transition-transform duration-500" @error="handleImageError">
            </div>
            <div class="p-6">
              <h3 class="text-lg font-bold text-gray-900 text-center">
                {{ vehicle.name }}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <h2 class="text-orange-500 font-semibold text-2xl">VET Air Bus Express</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8">
        <!-- Vehicle Card -->
        <div v-for="airbuss in aribus" :key="airbuss.id"
          class="group bg-white rounded-2xl shadow-lg overflow-hidden  duration-300 transform h-fit">
          <div class="relative overflow-hidden cursor-pointer" @click="openModal(airbuss)">
            <img :src="airbuss.image" :alt="airbuss.name"
              class="w-full h-56 object-cover  transition-transform duration-500" @error="handleImageError">
          </div>
          <div class="p-6">
            <h3 class="text-lg font-bold text-gray-900 text-center">
              {{ airbuss.name }}
            </h3>
            <!-- <p v-if="airbuss.description" class="text-sm text-gray-600 text-center mt-2">
                {{ airbuss.description }}
              </p> -->
          </div>
        </div>

      </div>
      <h2 class="text-orange-500 font-semibold text-2xl">Buva Sea Cambodia</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8">
        <!-- Vehicle Card -->
        <div v-for="buvaseas in buvasea" :key="buvaseas.id"
          class="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 transform h-fit">
          <div class="relative overflow-hidden cursor-pointer" @click="openModal(buvaseas)">
            <img :src="buvaseas.image" :alt="buvaseas.name"
              class="w-full h-56 object-cover transition-transform duration-500" @error="handleImageError">
            <!-- <div class="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div> -->
          </div>
          <div class="p-6">
            <h3 class="text-lg font-bold text-gray-900 text-center">
              {{ buvaseas.name }}
            </h3>
            <!-- <p v-if="buvaseas.description" class="text-sm text-gray-600 text-center mt-2">
                  {{ buvaseas.description }}
                </p> -->
          </div>
        </div>
      </div>

    </div>

    <!-- Popup Modal Slider -->
    <div v-if="showModal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
      @click.self="closeModal" @keydown.window="handleKeyDown" role="dialog" aria-modal="true">

      <div id="gallery-modal" class="bg-white rounded-lg shadow-lg container w-full relative pointer-events-auto"
        @click.stop>

        <!-- Close button -->
        <div class="w-full items-end flex justify-end p-4">
          <button id="gallery-close-btn" type="button" @click.stop.prevent="closeModal($event)"
            class="flex justify-end text-end items-end z-50 bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition">Close</button>
        </div>


        <div class="flex flex-col w-full min-h-[300px] max-h-[80vh] relative p-4  overflow-hidden">
          <div class="w-full h-full flex items-center justify-center overflow-hidden" @touchstart="onTouchStart"
            @touchend="onTouchEnd">
            <button @click="prevImage" :disabled="currentIndex === 0" aria-label="Previous image"
              class="absolute left-8 top-1/2 -translate-y-1/2 bg-orange-400 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-orange-500 disabled:opacity-50 z-10">
              <span class="text-2xl leading-none">&#8592;</span>
            </button>
            <div class="absolute left-4 top-4 z-50 bg-black bg-opacity-70 text-white text-sm px-3 py-1 m-4 rounded-full">
              {{ currentIndex + 1 }} / {{ modalImages.length }}
            </div>

            <img :src="modalImages[currentIndex]" class="h-full w-full object-contain rounded" />

            <button @click="nextImage" :disabled="currentIndex === modalImages.length - 1" aria-label="Next image"
              class="absolute right-8 top-1/2 -translate-y-1/2 bg-orange-400 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-orange-500 disabled:opacity-50 z-10">
              <span class="text-2xl leading-none">&#8594;</span>
            </button>
          </div>

          <div class="flex absolute bottom-12 w-full items-center justify-center mt-4 space-x-3">
            <button v-for="(img, i) in modalImages" :key="i" @click="currentIndex = i"
              :aria-label="`Go to image ${i + 1}`"
              class="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full transition transform hover:scale-110 text-center"
              :class="currentIndex === i ? 'bg-orange-400' : 'bg-white border border-gray-300'">
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()

// Vehicle data
interface VehicleImage {
  image: string;
}

interface Vehicle {
  id: number;
  name: string;
  image: string;
  sub?: VehicleImage[];
  sun?: VehicleImage[];
}

interface Buvasea {
  id: number;
  name: string;
  image: string;
  sub?: VehicleImage[];
}

interface Airbus {
  id: number;
  name: string;
  image: string;
  sub?: VehicleImage[];
}

const vehicles = ref<Vehicle[]>([
  {
    id: 1,
    name: 'Hotel Bus',
    image: '/images/gallery/vet/Hotel_Bus/Cover/Hotel_Bus_Cover.jpg',
    // description: 'Comfortable sleeping bus for long distance travel'
    sub: [
      {
        image: '/images/gallery/vet/Hotel_Bus/Slide/Hotel Bus-01.jpg'
      },
      {
        image: '/images/gallery/vet/Hotel_Bus/Slide/Hotel Bus-03.jpg'
      },
      {
        image: '/images/gallery/vet/Hotel_Bus/Slide/Hotel Bus-04.jpg'
      },
      {
        image: '/images/gallery/vet/Hotel_Bus/Slide/Hotel Bus-05.jpg'
      },
      {
        image: '/images/gallery/vet/Hotel_Bus/Slide/Hotel Bus-06.jpg'
      },

    ]
  },
  {
    id: 2,
    name: 'Luxury Hotel Bus',
    image: '/images/gallery/vet/Luxury_Hotel_Bus/Cover/Luxury Hotel Bus_Cover.jpg',
    // description: 'Premium sleeping bus with luxury amenities',
    sub: [
      {
        image: '/images/gallery/vet/Luxury_Hotel_Bus/Slide/Luxury Hotel Bus-01.jpg'
      },
      {
        image: '/images/gallery/vet/Luxury_Hotel_Bus/Slide/Luxury Hotel Bus-03.jpg'
      },
      {
        image: '/images/gallery/vet/Luxury_Hotel_Bus/Slide/Luxury Hotel Bus-04.jpg'
      },
      {
        image: '/images/gallery/vet/Luxury_Hotel_Bus/Slide/Luxury Hotel Bus-05.jpg'
      },
      {
        image: '/images/gallery/vet/Luxury_Hotel_Bus/Slide/Luxury Hotel Bus-06.jpg'
      },
      {
        image: '/images/gallery/vet/Luxury_Hotel_Bus/Slide/Luxury Hotel Bus-07.jpg'
      }
    ]
  },
  {
    id: 3,
    name: 'Luxury Coaster',
    image: '/images/gallery/vet/Luxury_Coaster/Cover/Luxury Coaster_Cover.jpg',
    // description: 'Mid-size luxury coach for medium groups'
    sub: [
      {
        image: '/images/gallery/vet/Luxury_Coaster/Slide/Luxury Coaster-01.jpg'
      },
      {
        image: '/images/gallery/vet/Luxury_Coaster/Slide/Luxury Coaster-03.jpg'
      },
      {
        image: '/images/gallery/vet/Luxury_Coaster/Slide/Luxury Coaster-04.jpg'
      },
      {
        image: '/images/gallery/vet/Luxury_Coaster/Slide/Luxury Coaster-05.jpg'
      },
      {
        image: '/images/gallery/vet/Luxury_Coaster/Slide/Luxury Coaster-06.jpg'
      },
      {
        image: '/images/gallery/vet/Luxury_Coaster/Slide/Luxury Coaster-07.jpg'
      }
    ]
  },
  {
    id: 4,
    name: 'Luxury Van-H350',
    image: '/images/gallery/vet/Luxury_Van-H350/Cover/Classic Hyundai Solati H350_Cover.jpg',
    // description: 'Premium van service for small groups'
    sub: [
      {
        image: '/images/gallery/vet/Luxury_Van-H350/Slide/Classic Hyundai Solati H350-01.jpg'
      },
      {
        image: '/images/gallery/vet/Luxury_Van-H350/Slide/Classic Hyundai Solati H350-03.jpg'
      },
      {
        image: '/images/gallery/vet/Luxury_Van-H350/Slide/Classic Hyundai Solati H350-04.jpg'
      },
      {
        image: '/images/gallery/vet/Luxury_Van-H350/Slide/Classic Hyundai Solati H350-05.jpg'
      },
      {
        image: '/images/gallery/vet/Luxury_Van-H350/Slide/Classic Hyundai Solati H350-06.jpg'
      },
      {
        image: '/images/gallery/vet/Luxury_Van-H350/Slide/Classic Hyundai Solati H350-07.jpg'
      }
    ]
  },
  {
    id: 5,
    name: 'Luxury Van-H350',
    image: '/images/gallery/vet/Luxury-Van-Hiace/Cover/Luxury Van-Hiace_Cover.jpg',
    // description: 'Comfortable van for private transportation'
    sun: [
      {
        image: '/images/gallery/vet/Luxury-Van-Hiace/Slide/Luxury Van-Hiace-01.jpg'
      },
      {
        image: '/images/gallery/vet/Luxury-Van-Hiace/Slide/Luxury Van-Hiace-03.jpg'
      },
      {
        image: '/images/gallery/vet/Luxury-Van-Hiace/Slide/Luxury Van-Hiace-04.jpg'
      },
      {
        image: '/images/gallery/vet/Luxury-Van-Hiace/Slide/Luxury Van-Hiace-05.jpg'
      },
      {
        image: '/images/gallery/vet/Luxury-Van-Hiace/Slide/Luxury Van-Hiace-06.jpg'
      }
    ]
  }
])
const buvasea = ref<Buvasea[]>([
  {
    id: 1,
    name: 'SpeedBoat',
    image: '/images/gallery/vet/SpeedBoat/Cover/SpeedBoat_Cover.jpg',
    // description: 'Comfortable sleeping bus for long distance travel'
    sub: [
      {
        image: '/images/gallery/vet/SpeedBoat/Slide/SpeedBoat-01.jpg'
      },
      {
        image: '/images/gallery/vet/SpeedBoat/Slide/SpeedBoat-03.jpg'
      },
      {
        image: '/images/gallery/vet/SpeedBoat/Slide/SpeedBoat-04.jpg'
      },
      {
        image: '/images/gallery/vet/SpeedBoat/Slide/SpeedBoat-05.jpg'
      }
    ]
  },
])
const aribus = ref<Airbus[]>([
  {
    id: 1,
    name: 'Air Bus',
    image: '/images/gallery/vet/Air_Bus/Cover/Air Bus_Cover.jpg',
    // description: 'Comfortable sleeping bus for long distance travel'
    sub: [
      {
        image: '/images/gallery/vet/Air_Bus/Slide/Air Bus-01.jpg'
      },
      {
        image: '/images/gallery/vet/Air_Bus/Slide/Air Bus-06.jpg'
      },
      {
        image: '/images/gallery/vet/Air_Bus/Slide/Air Bus-07.jpg'
      },
      {
        image: '/images/gallery/vet/Air_Bus/Slide/Air Bus-08.jpg'
      },
      {
        image: '/images/gallery/vet/Air_Bus/Slide/Air Bus-09.jpg'
      },
      {
        image: '/images/gallery/vet/Air_Bus/Slide/Air Bus-10.jpg'
      }
    ]
  },

])

// Handle image loading errors with fallback
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  console.warn(`Image failed to load: ${img.src}`)
  // You could set a fallback image here if needed
  // img.src = '/images/placeholder-vehicle.jpg'
}

// Modal state and slider logic
const showModal = ref(false)
const modalImages = ref<string[]>([])
const currentIndex = ref(0)

// Keyboard handlers for modal (Escape + arrow navigation)
const handleKeyDown = (event: KeyboardEvent) => {
  if (!showModal.value) return
  if (event.key === 'Escape') {
    closeModal()
  } else if (event.key === 'ArrowLeft') {
    prevImage()
  } else if (event.key === 'ArrowRight') {
    nextImage()
  }
}

// Capture-phase click logger to debug which element is under the pointer
function logClickCapture(e: MouseEvent) {
  try {
    const elAtPoint = document.elementFromPoint(e.clientX, e.clientY)
    console.log('capture click', e.type, 'coords', e.clientX, e.clientY, 'target', e.target)
    console.log('elementFromPoint ->', elAtPoint, 'pointerEvents:', elAtPoint && window.getComputedStyle(elAtPoint).pointerEvents)
  } catch (err) {
    console.log('capture click error', err)
  }
}

const touchStartX = ref<number | null>(null)
function onTouchStart(e: TouchEvent) {
  touchStartX.value = e.touches?.[0]?.clientX ?? null
}
function onTouchEnd(e: TouchEvent) {
  if (touchStartX.value === null) return
  const endX = e.changedTouches?.[0]?.clientX ?? touchStartX.value
  const delta = endX - touchStartX.value
  if (delta > 50) prevImage()
  else if (delta < -50) nextImage()
  touchStartX.value = null
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  // listen in capture phase to see which element will receive the click
  window.addEventListener('click', logClickCapture, true)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('click', logClickCapture, true)
  document.body.style.overflow = ''
})

function openModal(vehicle: Vehicle | Airbus | Buvasea) {
  console.log('openModal called', vehicle && (vehicle.name ?? vehicle.id ?? vehicle))
  // Use cover image + all sub images
  showModal.value = true
  let images = []
  if (vehicle.image) images.push(vehicle.image)
  if (vehicle.sub && Array.isArray(vehicle.sub)) {
    images = images.concat(vehicle.sub.map(img => img.image))
  }
  if ('sun' in vehicle && vehicle.sun && Array.isArray(vehicle.sun)) {
    images = images.concat(vehicle.sun.map(img => img.image))
  }
  modalImages.value = images
  currentIndex.value = 0
  showModal.value = true
}
function closeModal(e?: Event) {
  console.log('closeModal called', e?.type ?? 'no-event', e)
  try {
    e?.stopPropagation()
    e?.preventDefault()
  } catch (err) {
    // ignore
  }
  showModal.value = false
}

// Debug: watch modal state changes and prevent body scroll while open
watch(showModal, (val) => {
  console.log('showModal changed ->', val)
  document.body.style.overflow = val ? 'hidden' : ''
})
function prevImage() {
  if (currentIndex.value > 0) currentIndex.value--
}
function nextImage() {
  if (currentIndex.value < modalImages.value.length - 1) currentIndex.value++
}
</script>

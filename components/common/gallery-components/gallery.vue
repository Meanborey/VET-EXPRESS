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
            class="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-300 transform hover:-translate-y-2 md:hover:-translate-y-1 h-fit">
            <div class="relative overflow-hidden cursor-pointer" @click="openModal(vehicle)">
              <img :src="vehicle.image" :alt="vehicle.name"
                class="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                @error="handleImageError">
              <div class="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
            </div>
            <div class="p-6">
              <h3 class="text-lg font-bold text-gray-900 text-center">
                {{ vehicle.name }}
              </h3>
            </div>
          </div>
        </div>
      <!-- Popup Modal Slider -->
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white rounded-lg shadow-lg max-w-4xl w-full p-4 relative">
          <button @click="closeModal" class="absolute top-4 right-4 bg-red-400 text-white px-4 py-2 rounded">Close</button>
          <div class="flex flex-col items-center">
            <div class="relative w-full flex items-center justify-center">
              <button @click="prevImage" :disabled="currentIndex === 0" class="absolute left-2 top-1/2 -translate-y-1/2 bg-orange-400 text-white rounded-full p-2">
                <span class="text-2xl">&#8592;</span>
              </button>
              <img :src="modalImages[currentIndex]" class="max-h-[400px] object-contain rounded" />
              <button @click="nextImage" :disabled="currentIndex === modalImages.length - 1" class="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-400 text-white rounded-full p-2">
                <span class="text-2xl">&#8594;</span>
              </button>
            </div>
            <div class="mt-2 text-gray-700">{{ currentIndex + 1 }} / {{ modalImages.length }}</div>
            <div class="flex justify-center mt-2 space-x-2">
              <span v-for="(img, i) in modalImages" :key="i" @click="currentIndex = i"
                class="w-3 h-3 rounded-full cursor-pointer"
                :class="currentIndex === i ? 'bg-orange-400' : 'bg-gray-300'">
              </span>
            </div>
          </div>
        </div>
      </div>
        </div>

        <h2 class="text-orange-500 font-semibold text-2xl">VET Air Bus Express</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8">
          <!-- Vehicle Card -->
          <div v-for="airbuss in aribus" :key="airbuss.id"
            class="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-300 transform hover:-translate-y-2 md:hover:-translate-y-1 h-fit">
            <div class="relative overflow-hidden">
              <img :src="airbuss.image" :alt="airbuss.name"
                class="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                @error="handleImageError">
              <div class="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
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
              class="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-300 transform hover:-translate-y-2 md:hover:-translate-y-1 h-fit">
              <div class="relative overflow-hidden">
                <img :src="buvaseas.image" :alt="buvaseas.name"
                  class="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  @error="handleImageError">
                <div class="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
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
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white rounded-lg shadow-lg max-w-4xl w-full p-4 relative">
          <button @click="closeModal" class="absolute top-4 right-4 bg-red-400 text-white px-4 py-2 rounded">Close</button>
          <div class="flex flex-col items-center">
            <div class="relative w-full flex items-center justify-center">
              <button @click="prevImage" :disabled="currentIndex === 0" class="absolute left-2 top-1/2 -translate-y-1/2 bg-orange-400 text-white rounded-full p-2">
                <span class="text-2xl">&#8592;</span>
              </button>
              <img :src="modalImages[currentIndex]" class="max-h-[400px] object-contain rounded" />
              <button @click="nextImage" :disabled="currentIndex === modalImages.length - 1" class="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-400 text-white rounded-full p-2">
                <span class="text-2xl">&#8594;</span>
              </button>
            </div>
            <div class="mt-2 text-gray-700">{{ currentIndex + 1 }} / {{ modalImages.length }}</div>
            <div class="flex justify-center mt-2 space-x-2">
              <span v-for="(img, i) in modalImages" :key="i" @click="currentIndex = i"
                class="w-3 h-3 rounded-full cursor-pointer"
                :class="currentIndex === i ? 'bg-orange-400' : 'bg-gray-300'">
              </span>
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
    sub:[
      {
        image:'/images/gallery/vet/Hotel_Bus/Slide/Hotel Bus-01.jpg'
      },
      {
        image:'/images/gallery/vet/Hotel_Bus/Slide/Hotel Bus-03.jpg'
      },
      {
        image:'/images/gallery/vet/Hotel_Bus/Slide/Hotel Bus-04.jpg'
      },
      {
        image:'/images/gallery/vet/Hotel_Bus/Slide/Hotel Bus-05.jpg'
      },
      {
        image:'/images/gallery/vet/Hotel_Bus/Slide/Hotel Bus-06.jpg'
      },
     
    ]
  },
  {
    id: 2,
    name: 'Luxury Hotel Bus',
    image: '/images/gallery/vet/Luxury_Hotel_Bus/Cover/Luxury Hotel Bus_Cover.jpg',
    // description: 'Premium sleeping bus with luxury amenities',
    sub:[
      {
        image:'/images/gallery/vet/Luxury_Hotel_Bus/Slide/Luxury Hotel Bus-01.jpg'
      },
      {
        image:'/images/gallery/vet/Luxury_Hotel_Bus/Slide/Luxury Hotel Bus-03.jpg'
      },
      {
        image:'/images/gallery/vet/Luxury_Hotel_Bus/Slide/Luxury Hotel Bus-04.jpg'
      },
      {
        image:'/images/gallery/vet/Luxury_Hotel_Bus/Slide/Luxury Hotel Bus-05.jpg'
      },
      {
        image:'/images/gallery/vet/Luxury_Hotel_Bus/Slide/Luxury Hotel Bus-06.jpg'
      },
      {
        image:'/images/gallery/vet/Luxury_Hotel_Bus/Slide/Luxury Hotel Bus-07.jpg'
      }
    ]
  },
  {
    id: 3,
    name: 'Luxury Coaster',
    image: '/images/gallery/vet/Luxury_Coaster/Cover/Luxury Coaster_Cover.jpg',
    // description: 'Mid-size luxury coach for medium groups'
    sub:[
      {
        image:'/images/gallery/vet/Luxury_Coaster/Slide/Luxury Coaster-01.jpg'
      },
      {
        image:'/images/gallery/vet/Luxury_Coaster/Slide/Luxury Coaster-03.jpg'
      },
      {
        image:'/images/gallery/vet/Luxury_Coaster/Slide/Luxury Coaster-04.jpg'
      },
      {
        image:'/images/gallery/vet/Luxury_Coaster/Slide/Luxury Coaster-05.jpg'
      },
      {
        image:'/images/gallery/vet/Luxury_Coaster/Slide/Luxury Coaster-06.jpg'
      },
      {
        image:'/images/gallery/vet/Luxury_Coaster/Slide/Luxury Coaster-07.jpg'
      }
    ]
  },
  {
    id: 4,
    name: 'Luxury Van-H350',
    image: '/images/gallery/vet/Luxury_Van-H350/Cover/Classic Hyundai Solati H350_Cover.jpg',
    // description: 'Premium van service for small groups'
    sub:[
      {
        image:'/images/gallery/vet/Luxury_Van-H350/Slide/Classic Hyundai Solati H350-01.jpg'
      },
      {
        image:'/images/gallery/vet/Luxury_Van-H350/Slide/Classic Hyundai Solati H350-03.jpg'
      },
      {
        image:'/images/gallery/vet/Luxury_Van-H350/Slide/Classic Hyundai Solati H350-04.jpg'
      },
      {
        image:'/images/gallery/vet/Luxury_Van-H350/Slide/Classic Hyundai Solati H350-05.jpg'
      },
      {
        image:'/images/gallery/vet/Luxury_Van-H350/Slide/Classic Hyundai Solati H350-06.jpg'
      },
      {
        image:'/images/gallery/vet/Luxury_Van-H350/Slide/Classic Hyundai Solati H350-07.jpg'
      }
    ]
  },
  {
    id: 5,
    name: 'Luxury Van-H350',
    image: '/images/gallery/vet/Luxury-Van-Hiace/Cover/Luxury Van-Hiace_Cover.jpg',
    // description: 'Comfortable van for private transportation'
    sun:[
      {
        image:'/images/gallery/vet/Luxury-Van-Hiace/Slide/Luxury Van-Hiace-01.jpg'
      },
      {
        image:'/images/gallery/vet/Luxury-Van-Hiace/Slide/Luxury Van-Hiace-03.jpg'
      },
      {
        image:'/images/gallery/vet/Luxury-Van-Hiace/Slide/Luxury Van-Hiace-04.jpg'
      },
      {
        image:'/images/gallery/vet/Luxury-Van-Hiace/Slide/Luxury Van-Hiace-05.jpg'
      },
      {
        image:'/images/gallery/vet/Luxury-Van-Hiace/Slide/Luxury Van-Hiace-06.jpg'
      },
      {
        image:'/images/gallery/vet/Luxury-Van-Hiace/Slide/Luxury Van-Hiace-07.jpg'
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
    sub:[
      {
        image:'/images/gallery/vet/SpeedBoat/Slide/SpeedBoat-01.jpg'
      },
      {
        image:'/images/gallery/vet/SpeedBoat/Slide/SpeedBoat-03.jpg'
      },
      {
        image:'/images/gallery/vet/SpeedBoat/Slide/SpeedBoat-04.jpg'
      },
      {
        image:'/images/gallery/vet/SpeedBoat/Slide/SpeedBoat-05.jpg'
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
     sub:[
      {
        image:'/images/gallery/vet/Air_Bus/Slide/Air Bus-01.jpg'
      },
      {
        image:'/images/gallery/vet/Air_Bus/Slide/Air Bus-06.jpg'
      },
      {
        image:'/images/gallery/vet/Air_Bus/Slide/Air Bus-07.jpg'
      },
      {
        image:'/images/gallery/vet/Air_Bus/Slide/Air Bus-08.jpg'
      },
      {
        image:'/images/gallery/vet/Air_Bus/Slide/Air Bus-09.jpg'
      },
      {
        image:'/images/gallery/vet/Air_Bus/Slide/Air Bus-10.jpg'
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

function openModal(vehicle: Vehicle) {
  // Use cover image + all sub images
  showModal.value = true
  let images = []
  if (vehicle.image) images.push(vehicle.image)
  if (vehicle.sub && Array.isArray(vehicle.sub)) {
    images = images.concat(vehicle.sub.map(img => img.image))
  }
  if (vehicle.sun && Array.isArray(vehicle.sun)) {
    images = images.concat(vehicle.sun.map(img => img.image))
  }
  modalImages.value = images
  currentIndex.value = 0
  showModal.value = true
}
function closeModal() {
  showModal.value = false
}
function prevImage() {
  if (currentIndex.value > 0) currentIndex.value--
}
function nextImage() {
  if (currentIndex.value < modalImages.value.length - 1) currentIndex.value++
}
</script>

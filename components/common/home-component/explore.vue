<template>
  <section class=" py-16 px-4">
    <div class="container mx-auto">
      <!-- Section Title -->
      <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-12 text-center">
        {{ t('exploreTitle') }}
      </h2>

      <!-- Destination Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <!-- Cambodia Card -->
        <div class="group relative overflow-hidden rounded-2xl h-64 md:h-72 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300">
          <img 
            src="@/assets/images/explore/vireak-buntham-cambodia.jpg" 
            alt="Cambodia" 
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div class="absolute top-4 left-4">
            <h3 class="text-white text-3xl font-bold">{{ t('countryCambodia') }}</h3>
          </div>
        </div>

        <!-- Laos Card -->
        <div class="group relative overflow-hidden rounded-2xl h-64 md:h-72 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300">
          <img 
            src="@/assets/images/explore/vireak-buntham-laos.jpg" 
            alt="Laos" 
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div class="absolute top-4 left-4">
            <h3 class="text-white text-3xl font-bold">{{ t('countryLaos') }}</h3>
          </div>
        </div>

        <!-- Thailand Card -->
        <div class="group relative overflow-hidden rounded-2xl h-64 md:h-72 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300">
          <img 
            src="@/assets/images/explore/vireak-buntham-thailand.jpg" 
            alt="Thailand" 
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div class="absolute top-4 left-4">
            <h3 class="text-white text-3xl font-bold">{{ t('countryThailand') }}</h3>
          </div>
        </div>

        <!-- Vietnam Card -->
        <div class="group relative overflow-hidden rounded-2xl h-64 md:h-72 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300">
          <img 
            src="@/assets/images/explore/vireak-buntham-vietnam.jpg" 
            alt="Vietnam" 
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div class="absolute top-4 left-4">
            <h3 class="text-white text-3xl font-bold">{{ t('countryVietnam') }}</h3>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Explore component - displays trending destinations
const { t } = useI18n()
</script>

<style scoped>
/* Smooth hover effects */
.group:hover img {
  transform: scale(1.1);
}
</style>

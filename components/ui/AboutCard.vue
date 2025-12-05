<template>
  <div class="bg-white rounded-2xl transition-shadow duration-300 h-full flex flex-col group">
    <!-- Image Container -->
    <div class="relative overflow-hidden bg-gradient-to-b">
      <img 
        :src="image" 
        :alt="title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-lg"
        @error="handleImageError"
      >
       <button class="flex absolute items-end gap-2 bottom-0 right-0 rounded-br-2xl bg-orange-600  text-white hover:bg-orange-700 font-semibold transition px-4 py-2">
       Read More
        <span class="text-sm text-end">  →</span>
      </button>
    </div>

    <!-- Content Container -->
    <div class="py-6 flex flex-col flex-grow">
      <!-- Title -->
      <h3 class="text-lg font-bold text-gray-900 mb-3">
        {{ title }}
      </h3>

      <!-- Description -->
      <p class="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
        {{ description }}
      </p>

      <!-- Read More Button -->
     
    </div>

    <!-- Orange Footer Bar -->
  </div>
</template>

<script setup lang="ts">
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  console.warn(`Image failed to load: ${img.src}`)
}

withDefaults(defineProps<{
  title: string
  image: string
  description: string
  badge?: string
}>(), {
  badge: 'VET'
})
</script>

<style scoped>
/* Smooth hover effects */
.transition {
  transition: all 0.3s ease;
}
</style>

<script setup lang="ts">
interface Milestone {
  year: string
  title: string
  points: string[]
  icon?: string
}

defineProps<{
  milestone: Milestone
}>()
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
    <!-- Icon -->
    <div class="flex justify-center mb-4">
      <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>

    <!-- Year/Title -->
    <h3 class="text-lg font-bold text-gray-800 text-center mb-4">{{ milestone.year }}</h3>

    <!-- Description Points -->
    <ul class="space-y-2">
      <li v-for="(point, index) in milestone.points" :key="index" class="flex items-start gap-2 text-sm text-gray-700">
        <span class="text-blue-600 font-bold mt-0.5">•</span>
        <span>{{ point }}</span>
      </li>
    </ul>
  </div>
</template>

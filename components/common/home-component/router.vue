<template>
  <section class="pb-16">
    <div class="container mx-auto">
      <!-- Loading State -->
      <div v-if="routesStore.isLoading" class="text-center py-8">
        <p class="text-gray-600">{{ t('routesLoading') }}</p>
      </div>

      <!-- Error State -->
      <div v-else-if="routesStore.error" class="text-center py-8">
        <p class="text-red-600">{{ routesStore.error }}</p>
      </div>

      <!-- Routes Content -->
      <template v-else>
        <!-- Local Route - Cambodia -->
        <div class="mb-16">
          <h3 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
            {{ t('localRouteTitle') }}
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <RouterLink
              v-for="route in routesStore.getAllLocalRoutes"
              :key="route.id"
              :to="`/booking?route=${route.slug}`"
              class="rounded-lg transition-colors duration-300 cursor-pointer"
            >
              <p class="text-sm lg:text-base text-gray-700">
                {{ route.name }}
              </p>
            </RouterLink>
          </div>
        </div>

        <!-- International Route - Thailand & Vietnam & Laos -->
        <div>
          <h3 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
            {{ t('internationalRouteTitle') }}
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <RouterLink
              v-for="route in routesStore.getAllInternationalRoutes"
              :key="route.id"
              :to="`/booking?route=${route.slug}`"
              class="rounded-lg transition-colors duration-300 cursor-pointer"
            >
              <p class="text-sm lg:text-base text-gray-700">
                {{ route.name }}
              </p>
            </RouterLink>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRoutesStore } from '~/stores/useRoutesStore';

// Initialize the routes store
const routesStore = useRoutesStore();
const { t } = useI18n()

// Fetch routes on component mount
onMounted(() => {
  routesStore.fetchRoutes();
});
</script>

<style scoped>
/* Smooth hover effects and transitions */
.router-link-active {
  @apply bg-blue-100 text-blue-600;
}

/* Link animation on hover */
:deep(a):hover {
  text-decoration: none;
}
</style>
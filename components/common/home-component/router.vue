<template>
  <section class=" pb-16">
    <div class="container mx-auto">

      <!-- Local Route - Cambodia -->
      <div class="mb-16">
        <h3 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
          Local Route - Cambodia
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <RouterLink
            v-for="route in localRoutes"
            :key="route.id"
            :to="`/booking?route=${route.slug}`"
            class="rounded-lg  transition-colors duration-300 cursor-pointer"
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
          International Route - Thailand & Vietnam & Laos
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <RouterLink
            v-for="route in internationalRoutes"
            :key="route.id"
            :to="`/booking?route=${route.slug}`"
            class="rounded-lg  transition-colors duration-300 cursor-pointer"
          >
            <p class="text-sm lg:text-base text-gray-700">
              {{ route.name }}
            </p>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Local routes within Cambodia
const localRoutes = [
  { id: 1, name: 'Phnom Penh - Siem Reap', slug: 'phnom-penh-siem-reap' },
  { id: 2, name: 'Phnom Penh - Rattanakiri', slug: 'phnom-penh-rattanakiri' },
  { id: 3, name: 'Phnom Penh - Kampot', slug: 'phnom-penh-kampot' },
  { id: 4, name: 'Phnom Penh - Shianouk Ville', slug: 'phnom-penh-shianouk-ville' },
  { id: 5, name: 'Phnom Penh - Mondulkiri', slug: 'phnom-penh-mondulkiri' },
  { id: 6, name: 'Phnom Penh - Koh Kong', slug: 'phnom-penh-koh-kong' },
  { id: 7, name: 'Phnom Penh - Poi Pet', slug: 'phnom-penh-poi-pet' },
  { id: 8, name: 'Phnom Penh - Stueng Treng', slug: 'phnom-penh-stueng-treng' },
  { id: 9, name: 'Phnom Penh - Phnom Penh Olympic', slug: 'phnom-penh-olympic' },
  { id: 10, name: 'Phnom Penh - Battambang', slug: 'phnom-penh-battambang' },
  { id: 11, name: 'Phnom Penh - Kampong Cham', slug: 'phnom-penh-kampong-cham' },
  { id: 12, name: 'Phnom Penh - Koh Sdach', slug: 'phnom-penh-koh-sdach' },
];

// International routes
const internationalRoutes = [
  { id: 1, name: 'Phnom Penh - Bangkok', slug: 'phnom-penh-bangkok' },
  { id: 2, name: 'Poi Pet - Bangkok', slug: 'poi-pet-bangkok' },
  { id: 3, name: 'Svay Rieng - Ho Chi Minh', slug: 'svay-rieng-ho-chi-minh' },
  { id: 4, name: 'Siem Reap - Vientiane (Laos)', slug: 'siem-reap-vientiane' },
  { id: 5, name: 'Phnom Penh - Nakasang', slug: 'phnom-penh-nakasang' },
  { id: 6, name: 'Poi Pet - Nakasang', slug: 'poi-pet-nakasang' },
  { id: 7, name: 'Siem Reap - Don Det (4000 island)', slug: 'siem-reap-don-det' },
  { id: 8, name: 'Phnom Penh - Pakse (Laos)', slug: 'phnom-penh-pakse' },
  { id: 9, name: 'Battambang - Bangkok', slug: 'battambang-bangkok' },
  { id: 10, name: 'Shianouk Ville - Bangkok', slug: 'shianouk-ville-bangkok' },
  { id: 11, name: 'Bavet - Ho Chi Minh', slug: 'bavet-ho-chi-minh' },
  { id: 12, name: 'Banteay Meanchey - Vientiane (Laos)', slug: 'banteay-meanchey-vientiane' },
  { id: 13, name: 'Banteay Meanchey - Don Det (4000 island)', slug: 'banteay-meanchey-don-det' },
  { id: 14, name: 'Banteay Meanchey - Pakse (Laos)', slug: 'banteay-meanchey-pakse' },
  { id: 15, name: 'Siem Reap - Bangkok', slug: 'siem-reap-bangkok' },
  { id: 16, name: 'Siem Reap - Nakasang', slug: 'siem-reap-nakasang' },
  { id: 17, name: 'Siem Reap - Pakse (Laos)', slug: 'siem-reap-pakse' },
  { id: 18, name: 'Poi Pet - Vientiane (Laos)', slug: 'poi-pet-vientiane' },
  { id: 19, name: 'Sihanpuk Ville - Nakasang', slug: 'sihanpuk-ville-nakasang' },
  { id: 20, name: 'Sihanpuk Ville - Vientiane (Laos)', slug: 'sihanpuk-ville-vientiane' },
  { id: 21, name: 'Battambang - Vientiane (Laos)', slug: 'battambang-vientiane' },
  { id: 22, name: 'Battambang - Nakasang', slug: 'battambang-nakasang' },
  { id: 23, name: 'Battambang - Don Det (4000 island)', slug: 'battambang-don-det' },
  { id: 24, name: 'Battambang - Pakse (Laos)', slug: 'battambang-pakse' },
  { id: 25, name: 'Phnom Penh - Trat', slug: 'phnom-penh-trat' },
  { id: 26, name: 'Phnom Penh - Ho Chi Minh', slug: 'phnom-penh-ho-chi-minh' },
  { id: 27, name: 'Phnom Penh - Vientiane (Laos)', slug: 'phnom-penh-vientiane' },
  { id: 28, name: 'Phnom Penh - Don Det (4000 island)', slug: 'phnom-penh-don-det' },
];
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
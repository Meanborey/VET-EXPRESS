<template>
  <section class="bg-gray-50 py-16 px-4">
    <div class="container mx-auto">
      <!-- Chairman Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start mb-16">
        <!-- Left: Chairman Photo -->
        <div class="flex justify-center lg:justify-end">
          <div class="w-full max-w-xs">
            <img 
              src="/images/about/chairman-photo.jpg" 
              alt="Neak Oknha Suo Vireak"
              class="w-full h-auto rounded-lg shadow-lg"
            >
          </div>
        </div>

        <!-- Right: Chairman Info and Description -->
        <div class="lg:col-span-2">
          <!-- Chairman Name and Title -->
          <div class="bg-orange-500 text-white px-6 py-4 rounded-lg mb-6">
            <h3 class="text-2xl font-bold mb-1">Neak Oknha Suo Vireak</h3>
            <p class="text-lg font-semibold">Found, Chairman & CEO</p>
          </div>

          <!-- Main Description -->
          <p class="text-gray-700 text-base leading-relaxed mb-6">
            Vireak Buntham Express Co., Ltd (VET) is a leading transportation and logistics company with a number of 
            offices spread across Cambodia, and founded in 2004 by Neak Oknha Suo Vireak, and was registered as a 
            company in 2006 at Koh Kong Province. VET provides a transportations and logistics crossing Cambodia, 
            Thailand, and Vietnam. VET utilizes modern technology to deliver exceptional services.
          </p>

          <!-- Additional Details -->
          <div class="space-y-4 text-gray-700 text-sm leading-relaxed">
            <p>
              VET started with the few sleeping buses and vans, with the few staff in Koh Kong Province, and then VET has invested on luxury hotel buses, Toyota Hiace vans for passengers transportation, and trucks for logistics to customize its clients.
            </p>

            <p>
              The 2020 and 2021 were the historical expansion year for VET to transform very fast as the top leading logistic company in Cambodia even VET was facing with pandemic covid 19. We believe that the success of our clients will help us succeed. Our values reflect the thinking of the top management, which is to put our client's interests ahead of our own.
            </p>

            <p>
              2022 marked a triumphant return for VET Travel as passenger services resumed post-pandemic. Continuing its ambitious expansion, VET expanded its branch network and invested in a magnificent new Head Office to ensure employee comfort and well-being.
            </p>

            <p>
              Committed to sustainability, VET has begun introducing electric trucks in 2024 to reduce operating costs. Looking ahead, the company sets its sights on connecting Phnom Penh and Siem Reap to Laos, expanding its regional reach and further cementing its legacy as a pioneer in transportation and logistics.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// VET Background component featuring chairman information
</script>

<style scoped>
/* Smooth transitions */
.transition {
  transition: all 0.3s ease;
}
</style>

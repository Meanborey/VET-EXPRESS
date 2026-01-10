<template>
  <section class="py-20 bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">{{ t('chooseUsTitle') }}</h2>
        <p class="text-lg text-gray-600">
          {{ t('chooseUsSubtitle') }}
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Feature 1: Complimentary -->
        <div class="flex items-start space-x-4">
          <div class="bg-orange-500 rounded-lg p-4 mb-4">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
            </svg>
          </div>
          <div class="flex flex-col">
             <h3 class="text-xl font-bold text-gray-900 mb-2">{{ t('featureComplimentaryTitle') }}</h3>
           <p class="text-gray-600">{{ t('featureComplimentaryDesc') }}</p>
          </div>
         
        </div>

        <!-- Feature 2: Liability Insurance -->
        <div class="flex items-start space-x-4">
          <div class="bg-orange-500 rounded-lg p-4 mb-4">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.72-7 8.77V12H5V6.3l7-3.11v8.8z"/>
            </svg>
          </div>
          <div class="flex flex-col">
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ t('featureLiabilityTitle') }}</h3>
          <p class="text-gray-600">
            {{ t('featureLiabilityDesc') }}
          </p>
          </div>
        </div>

        <!-- Feature 3: Power & USB Charger -->
        <div class="flex items-start space-x-4">
          <div class="bg-orange-500 rounded-lg p-4 mb-4">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 7v10H8V7h8m0-2H8c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-4 16c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/>
            </svg>
          </div>
          <div class="flex flex-col">
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ t('featurePowerTitle') }}</h3>
          <p class="text-gray-600">
            {{ t('featurePowerDesc') }}
          </p>
          </div>
        </div>

        <!-- Feature 4: Customer Service -->
        <div class="flex items-start space-x-4">
          <div class="bg-orange-500 rounded-lg p-4 mb-4">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12h-8v-2h8v2zm0-4h-8V8h8v2z"/>
            </svg>
          </div>
          <div class="flex flex-col">
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ t('featureCustomerTitle') }}</h3>
          <p class="text-gray-600">
            {{ t('featureCustomerDesc') }}
          </p>
          </div>
        </div>

        <!-- Feature 5: Air Conditioned -->
        <div class="flex items-start space-x-4">
          <div class="bg-orange-500 rounded-lg p-4 mb-4">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
            </svg>
          </div>
          <div class="flex flex-col">
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ t('featureAirTitle') }}</h3>
          <p class="text-gray-600">
            {{ t('featureAirDesc') }}
          </p>
          </div>
        </div>

        <!-- Feature 6: Payment & Ticket -->
        <div class="flex items-start space-x-4">
          <div class="bg-orange-500 rounded-lg p-4 mb-4">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54h2.88v2.17h4.04v-2.17h2.1L15.04 9.3h-1.04L12 6.17l-2 3.13h1.04z"/>
            </svg>
          </div>
          <div class="flex flex-col">
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ t('featurePaymentTitle') }}</h3>
          <p class="text-gray-600">
            {{ t('featurePaymentDesc') }}
          </p>
          </div>
        </div>

        <!-- Feature 7: Comfortable Seat -->
        <div class="flex items-start space-x-4">
          <div class="bg-orange-500 rounded-lg p-4 mb-4">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
            </svg>
          </div>
          <div class="flex flex-col">
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ t('featureSeatTitle') }}</h3>
          <p class="text-gray-600">
            {{ t('featureSeatDesc') }}
          </p>
          </div>
        </div>

        <!-- Feature 8: GPS Tracking System -->
        <div class="flex items-start space-x-4">
          <div class="bg-orange-500 rounded-lg p-4 mb-4">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <div class="flex flex-col">
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ t('featureGpsTitle') }}</h3>
          <p class="text-gray-600">
            {{ t('featureGpsDesc') }}
          </p>
          </div>
        </div>

        <!-- Feature 9: Our Driver -->
        <div class="flex items-start space-x-4">
          <div class="bg-orange-500 rounded-lg p-4 mb-4">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div class="flex flex-col">
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ t('featureDriverTitle') }}</h3>
          <p class="text-gray-600">
            {{ t('featureDriverDesc') }}
          </p>
          </div>
        </div>

        <!-- Feature 10: Schedule -->
        <div class="flex items-start space-x-4">
          <div class="bg-orange-500 rounded-lg p-4 mb-4">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
            </svg>
          </div>
          <div class="flex flex-col">
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ t('featureScheduleTitle') }}</h3>
          <p class="text-gray-600">
            {{ t('featureScheduleDesc') }}
          </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>

<style scoped>
/* Custom styles if needed */
</style>

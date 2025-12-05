<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from '@/components/ui/card.vue'
import brandIcon from '@/assets/images/vireak-buntham.png'

const allCards = [
    {
        id: 1,
        title: 'Phnom Penh to Poi Pet (07:00)',
        period: '2025-03-05 to 2035-03-31',
        price: 18,
        oldPrice: 23,
        icon: brandIcon,
    },
    {
        id: 2,
        title: 'Phnom Penh to Poi Pet (07:00)',
        period: '2025-03-05 to 2035-03-31',
        price: 20,
        oldPrice: 23,
        icon: brandIcon,
    },
    {
        id: 3,
        title: 'Battambang to Bangkok (08:00)',
        period: '2024-06-01 to 2025-12-31',
        price: 23,
        oldPrice: 27,
        icon: brandIcon,
    },
    {
        id: 4,
        title: 'Bangkok to Poi Pet (11:00)',
        period: '2023-11-17 to 2033-11-30',
        price: 11,
        oldPrice: 15,
        icon: brandIcon,
    },
    {
        id: 5,
        title: 'Siem Reap to Phnom Penh (09:00)',
        period: '2024-05-01 to 2025-10-31',
        price: 15,
        oldPrice: 20,
        icon: brandIcon,
    },
    {
        id: 6,
        title: 'Phnom Penh to Ho Chi Minh City (10:00)',
        period: '2024-07-01 to 2025-12-31',
        price: 25,
        oldPrice: 30,
        icon: brandIcon,
    },
    {
        id: 7,
        title: 'Siem Reap to Bangkok (12:00)',
        period: '2024-08-01 to 2025-11-30',
        price: 30,
        oldPrice: 35,
        icon: brandIcon,
    },
    {
        id: 8,
        title: 'Phnom Penh to Sihanoukville (14:00)',
        period: '2024-09-01 to 2025-12-31',
        price: 12,
        oldPrice: 18,
        icon: brandIcon,
    },
]

const showAll = ref(false)
const visibleCards = computed(() => showAll.value ? allCards : allCards.slice(0, 4))

function handleToggleShow() {
    showAll.value = !showAll.value
}
</script>

<template>
    <section class="flex items-center justify-center py-8">
        <div class="container mx-auto ">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-3xl font-bold text-slate-800 flex items-center gap-2">
                    Flash Sale
                    <span class="text-blue-500 text-2xl">⚡</span>
                </h2>
                <button v-if="!showAll" @click="handleToggleShow" class="text-orange-600 hover:underline font-medium">
                    See More
                </button>
            </div>
            <div>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <Card v-for="card in visibleCards" :key="card.id" :title="card.title" :period="card.period"
                        :price="card.price" :oldPrice="card.oldPrice" :icon="card.icon" />
                </div>
                <div v-if="showAll" class="w-full text-end py-4 border-b border-slate-200">
                    <button @click="handleToggleShow"
                        class="text-white bg-orange-500 py-2 px-6 rounded-md text-end hover:underline font-medium">
                        See Less
                    </button>
                </div>
            </div>


        </div>

    </section>
</template>

<style scoped></style>

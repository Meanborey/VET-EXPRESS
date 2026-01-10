<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from '@/components/ui/card.vue'
import { useFlashSaleStore } from '~/stores/useFlashSaleStore'

// Initialize the flash sale store
const flashSaleStore = useFlashSaleStore()
const { t } = useI18n()

// Fetch flash sales on component mount
onMounted(() => {
    flashSaleStore.fetchFlashSales()
})

const showAll = ref(false)
const visibleCards = computed(() => {
    const allCards = flashSaleStore.getAllFlashSales
    return showAll.value ? allCards : allCards.slice(0, 4)
})

const toggleLabel = computed(() => (showAll.value ? t('seeLess') : t('seeMore')))

function handleToggleShow() {
    showAll.value = !showAll.value
}
</script>

<template>
    <section class="flex items-center justify-center py-8">
        <div class="container mx-auto">
            <!-- Loading State -->
            <div v-if="flashSaleStore.isLoading" class="text-center py-8">
                <p class="text-gray-600">{{ t('flashSaleLoading') }}</p>
            </div>

            <!-- Error State -->
            <div v-else-if="flashSaleStore.error" class="text-center py-8">
                <p class="text-red-600">{{ flashSaleStore.error }}</p>
            </div>

            <!-- Flash Sales Content -->
            <template v-else>
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-3xl font-bold text-slate-800 flex items-center gap-2">
                                                {{ t('flashSaleTitle') }}
                        <span class="text-blue-500 text-2xl">⚡</span>
                    </h2>
                    <button  @click="handleToggleShow" class="text-orange-600 hover:underline font-medium">
                                            {{ toggleLabel }}
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
                            {{ t('seeLess') }}
                        </button>
                    </div>
                </div>
            </template>
        </div>
    </section>
</template>

<style scoped></style>

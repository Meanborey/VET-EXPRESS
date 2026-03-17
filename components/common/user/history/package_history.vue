<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { PackageHistoryItem } from '~/stores/usePackageHistoryStore'

const authStore = useAuthStore()
const packageHistoryStore = usePackageHistoryStore()
const { packages, loading } = storeToRefs(packageHistoryStore)

const defaultPhoto = '/images/vireak-buntham.png'

const showPrice = (item: PackageHistoryItem): string => {
    const price = String(item.amount || '').trim()
    if (!price) return '0 USD'
    return /\$|usd/i.test(price) ? price : `${price} USD`
}

const termsList = (item: PackageHistoryItem): string[] => {
    const rawTerms = String(item.termCondition || '').trim()
    if (!rawTerms) return []

    const normalized = rawTerms
        .replace(/\r/g, '\n')
        .replace(/\u00A0/g, ' ')
        .replace(/[ \t]+/g, ' ')
        .replace(/\n{2,}/g, '\n')
        .trim()

    const numberedMatches = Array.from(
        normalized.matchAll(/(?:^|\n)\s*\d+\s*[.)]\s*([\s\S]*?)(?=(?:\n\s*\d+\s*[.)]\s*)|$)/g)
    )
        .map((match) => String(match[1] || '').replace(/\s*\n\s*/g, ' ').trim())
        .filter((entry) => entry.length > 0 && !/^\d+[.)]?$/.test(entry))

    if (numberedMatches.length) return numberedMatches

    return normalized
        .split('\n')
        .map((line) => line.replace(/^\d+\s*[.)-]?\s*/, '').trim())
        .filter((line) => line.length > 0 && !/^\d+$/.test(line))
}

const fetchPackageHistory = async () => {
    authStore.restoreAuth()
    await packageHistoryStore.fetchPackages({
        sessionToken: authStore.token,
    })
}

onMounted(async () => {
    await fetchPackageHistory()
})
</script>

<template>
    <section class="w-full bg-[#f3f3f3]">
        <div class="container mx-auto min-h-[calc(100vh-180px)] py-8 md:py-10">
            <div class="mx-auto w-full border-b border-[#d4d4d4]">
                <button
                    type="button"
                    class="border-b-[3px] border-[#3a3297] px-3 pb-3 text-left text-base font-semibold text-[#121212]"
                >
                    Travel Package History
                </button>
            </div>

            <div v-if="loading" class="grid min-h-[520px] place-items-center">
                <p class="text-base font-medium text-[#4b5563]">Loading travel package history...</p>
            </div>

            <div v-else-if="packages.length" class="space-y-7">
                <article
                    v-for="item in packages"
                    :key="item.id"
                    class="rounded-lg bg-[#f3f3f3] p-2"
                >
                    <h3 class="text-lg font-semibold text-[#2f2d90]">{{ item.packageName }}</h3>

                    <div class="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
                        <img
                            :src="item.photo || defaultPhoto"
                            alt="Package"
                            class="h-[160px] w-[160px] rounded-full object-cover"
                            @error="($event.target as HTMLImageElement).src = defaultPhoto"
                        >

                        <ul class="list-disc space-y-2 pl-6 text-base text-[#666666]">
                            <li>{{ item.name }}</li>
                            <li>{{ item.email }}</li>
                            <li>Price {{ showPrice(item) }}</li>
                        </ul>
                    </div>

                    <div class="mt-5 flex gap-4 bg-[#352f92] px-5 py-4 text-white">
                        <div class="flex-shrink-0 pt-1">
                            <svg class="h-12 w-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 41.5L15.5 33H27V21H50V41.5" stroke="currentColor" stroke-width="3"/>
                                <circle cx="19" cy="46" r="6" stroke="currentColor" stroke-width="3"/>
                                <circle cx="43" cy="46" r="6" stroke="currentColor" stroke-width="3"/>
                                <path d="M3 42H58" stroke="currentColor" stroke-width="3"/>
                            </svg>
                        </div>
                        <div class="space-y-1 text-base">
                            <p>Code travel: {{ item.code }}</p>
                            <p>Issue Date: {{ item.travelDate }}</p>
                            <p>Expired Date: {{ item.expiredDate }}</p>
                        </div>
                    </div>

                    <div class="mt-4">
                        <h4 class="text-xl font-semibold text-[#2f2d90] md:text-[30px]">Terms &amp; Conditions:</h4>
                        <ol v-if="termsList(item).length" class="mt-2 list-decimal space-y-1 pl-6 text-sm text-[#555555] md:text-[30px]">
                            <li class="text-base" v-for="(term, index) in termsList(item)" :key="`${item.id}-${index}`">{{ term }}</li>
                        </ol>
                    </div>
                </article>
            </div>

            <div v-else class="grid min-h-[520px] place-items-center">
                <div class="flex flex-col items-center">
                    <img
                        src="/images/vireak-buntham.png"
                        alt="VET"
                        class="h-[80px] w-[80px] object-contain"
                    >
                    <p class="mt-2 text-2xl font-semibold text-[#df6512]">Data Not Found</p>
                </div>
            </div>
        </div>
    </section>
</template>
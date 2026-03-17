<script setup lang="ts">
import { storeToRefs } from 'pinia'
import cambodiaImg from '@/assets/images/explore/vireak-buntham-cambodia.jpg'
import thailandImg from '@/assets/images/explore/vireak-buntham-thailand.jpg'

const travelPackageStore = useTravelPackageStore()
const { description: apiDescription, loading: descriptionLoading } = storeToRefs(travelPackageStore)

const fallbackDescription =
	'Are you a travel enthusiast with an ever-itchy foot? Look no further! Our Travel Package offers unparalleled opportunities for unforgettable experiences. Let us explain why our package is the perfect choice for your next adventure: Cost-Effective, great value for your money with best rate offer. Variety of Destinations from 25 provinces in Cambodia, Thailand, Vietnam and Laos. Peace of Mind with safety and comfort ensured. Customization tailored to your preferences of Air Bus, VIP Van, Luxury Bus, Rental Car and Speed Boat any dates within your package validity.'

const displayDescription = computed(() => String(apiDescription.value || '').trim() || fallbackDescription)

onMounted(async () => {
	await travelPackageStore.fetchDescription()
})

const packages = [
	{
		id: 1,
		duration: '12months',
		price: '$350',
		title: 'Domestic Travel Package (Cambodia) 12 Months - 350 USD',
		description:
			'This domestic travel service (Cambodia) 12 months helps local tourists, expatriates, private companies, NGOs, and students save travel costs while enjoying unlimited trips.',
		image: cambodiaImg
	},
	{
		id: 2,
		duration: '6months',
		price: '$175',
		title: 'Domestic Travel Package (Cambodia) 6 Months - 175 USD',
		description:
			'This domestic travel package (Cambodia) aims to save travel fees for international and local tourists by offering unlimited trips for six months.',
		image: cambodiaImg
	},
	{
		id: 3,
		duration: '30days',
		price: '$90',
		title: 'International Travel Package (Cambodia-Thailand-Vietnam-Laos) - 90 USD',
		description:
			'Our international travel package is designed to save on travel fees for local and international passengers with unlimited trips during package validity.',
		image: thailandImg
	}
]
</script>

<template>
	<section class="bg-[#f3f4f6] py-12 sm:py-16">
		<div class="container mx-auto px-4">
			<div class="mx-auto">
				<h2 class="text-3xl font-extrabold leading-tight text-[#1f2a8a]">
					Why Choose VET Travel Package?
				</h2>

				<p class="mt-5 text-base font-medium leading-relaxed text-[#1f2937]">
					{{ displayDescription }}
				</p>

				<!-- <p v-if="descriptionLoading && !apiDescription" class="mt-2 text-sm text-[#4b5563]">
					Loading travel package description...
				</p> -->

				<div class="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
					<PackageCard
						v-for="travelPackage in packages"
						:key="travelPackage.id"
						:image="travelPackage.image"
						:duration="travelPackage.duration"
						:price="travelPackage.price"
						:title="travelPackage.title"
						:description="travelPackage.description"
					/>
				</div>
			</div>
		</div>
	</section>
</template>

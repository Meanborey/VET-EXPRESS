<script setup lang="ts">
interface Props {
	image: string
	duration: string
	price: string
	title: string
	description: string
	buttonText?: string
}

withDefaults(defineProps<Props>(), {
	buttonText: 'Buy Now'
})
</script>

<template>
	<article class="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_4px_16px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(15,23,42,0.16)]">
		<div class="relative h-44 w-full sm:h-48">
			<img :src="image" :alt="title" class="h-full w-full object-cover" >
			<span class="absolute left-1/2 top-3 -translate-x-1/2 rounded-xl bg-gradient-to-b from-[#ffb04d] to-[#ff7b00] px-5 py-1 text-base font-semibold leading-none text-white shadow-md">
				{{ duration }}
			</span>
		</div>

		<div class="p-4 sm:p-5">
			<p class="mb-2 text-base font-medium leading-none text-[#ff7b00]">
				{{ price }}
			</p>

			<h3 class="line-clamp-2 text-xl font-semibold leading-tight text-[#1f2937]">
				{{ title }}
			</h3>

			<p class="mt-3 line-clamp-3 text-base font-medium leading-relaxed text-[#6b7280]">
				{{ description }}
			</p>

			<button type="button" class="mt-5 w-full rounded-lg bg-[#de8c55] px-4 py-2.5 text-base font-bold text-white transition duration-200 hover:bg-[#c97845]">
				{{ buttonText }}
			</button>
		</div>
	</article>
</template>

<script setup lang="ts">
defineProps<{
	title: string
	period: string
	price: number
	oldPrice: number
	icon: string
}>()
</script>

<template>
	<div class="bg-white rounded-xl shadow border border-slate-200 p-5 flex flex-col min-w-[260px] max-w-[320px] h-full">
		<div class="flex items-center gap-2 mb-2">
			<img  :src="icon" alt="Icon" class="w-7 h-7 object-contain" />
			<span class="font-semibold text-slate-800">{{ title }}</span>
		</div>
		<div class="text-xs text-slate-500 mb-4">Apply Period: {{ period }}</div>
		<div class="flex items-center gap-2 mb-4">
			<span class="text-slate-400 text-lg">🏷️</span>
			<span class="text-orange-600 font-bold text-lg">${{ price }}</span>
			<span class="line-through text-slate-400 text-base">${{ oldPrice }}</span>
		</div>
		<button class="mt-auto w-full border border-orange-500 text-orange-600 rounded-lg py-2 font-semibold hover:bg-orange-50 transition">Book Now</button>
	</div>
</template>

<script setup lang="ts">
import type { TicketHistoryItem } from '~/types/ticketHistory'

interface Props {
	ticket: TicketHistoryItem
}

defineProps<Props>()

const emit = defineEmits<{
	select: []
}>()

const handleSelect = () => {
	emit('select')
}
</script>

<template>
	<article
		class="cursor-pointer rounded-2xl bg-white px-5 py-5 shadow-md transition-shadow hover:shadow-xl"
		role="button"
		tabindex="0"
		@click="handleSelect"
		@keydown.enter="handleSelect"
		@keydown.space.prevent="handleSelect"
	>
		<div class="mb-5 flex items-center gap-4">
			<img src="/images/vireak-buntham.png" alt="VET" class="h-12 w-12 object-contain" >
			<h3 class="text-base font-semibold text-[#111827]">{{ ticket.destinationFrom }} - {{ ticket.destinationTo }}</h3>
		</div>
		<div class="grid grid-cols-1 gap-4 text-base text-[#111827] sm:grid-cols-2">
			<div class="flex items-center gap-3">
				<i class="fa-regular fa-id-card text-base text-[#9ca3af]" />
				<span>{{ ticket.code }}</span>
			</div>
			<div class="flex items-center gap-3">
				<i class="fa-regular fa-calendar text-base text-[#9ca3af]" />
				<span>{{ ticket.bookingDate }} ({{ ticket.departure }})</span>
			</div>
			<div class="flex items-center gap-3">
				<i class="fa-solid fa-bus text-base text-[#9ca3af]" />
				<span>{{ ticket.transportationType }}</span>
			</div>
			<div class="flex items-center gap-3">
				<i class="fa-regular fa-user text-base text-[#9ca3af]" />
				<span>{{ ticket.totalSeat }} Seats</span>
			</div>
		</div>
	</article>
</template>

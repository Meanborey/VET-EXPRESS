<script setup lang="ts">
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const ticketHistoryStore = useTicketHistoryStore()

const {
	tickets,
	currentPage,
	rowsPerPage,
} = storeToRefs(ticketHistoryStore)

const isDetailModalOpen = ref(false)
const selectedTicket = ref<(typeof tickets.value)[number] | null>(null)
const isLoadingDetail = ref(false)

const openTicketDetail = async (ticket: (typeof tickets.value)[number]) => {
	selectedTicket.value = ticket
	isDetailModalOpen.value = true
	isLoadingDetail.value = true

	authStore.restoreAuth()
	const detail = await ticketHistoryStore.fetchTicketDetail({
		sessionToken: authStore.token,
		id: ticket.id,
	})

	if (detail && selectedTicket.value?.id === ticket.id) {
		selectedTicket.value = {
			...ticket,
			...detail,
		}
	}

	isLoadingDetail.value = false
}

const closeTicketDetail = () => {
	isDetailModalOpen.value = false
	isLoadingDetail.value = false
	selectedTicket.value = null
}

const fetchTickets = async (page = currentPage.value) => {
	authStore.restoreAuth()
	await ticketHistoryStore.fetchTickets({
		sessionToken: authStore.token,
		page,
		rowsPerPage: rowsPerPage.value,
	})
}

onMounted(async () => {
	await fetchTickets(1)
})
</script>

<template>
	<section class="container mx-auto py-12 min-h-[calc(70vh-80px)]">
		<div class="border-b border-gray-300">
			<button type="button"
				class="border-b-[3px] border-[#21279a] px-3 py-3 text-base font-semibold leading-tight text-black">
				Ticket History
			</button>
		</div>
		<div v-if="tickets.length" class="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-2">
			<TicketHistoryCard
				v-for="ticket in tickets"
				:key="ticket.code"
				:ticket="ticket"
				@select="openTicketDetail(ticket)"
			/>
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

		<TicketHistoryDetailModal
			:is-open="isDetailModalOpen"
			:ticket="selectedTicket"
			:is-loading="isLoadingDetail"
			@close="closeTicketDetail"
		/>


	</section>
</template>

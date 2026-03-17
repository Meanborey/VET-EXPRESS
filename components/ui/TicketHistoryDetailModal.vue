<script setup lang="ts">
import QRCode from 'qrcode'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { TicketHistoryItem } from '~/types/ticketHistory'

interface Props {
	isOpen: boolean
	ticket: TicketHistoryItem | null
	isLoading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
	close: []
}>()

const closeModal = () => {
	emit('close')
}

const onKeydown = (event: KeyboardEvent) => {
	if (event.key === 'Escape' && props.isOpen) {
		closeModal()
	}
}

onMounted(() => {
	window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
	window.removeEventListener('keydown', onKeydown)
})

const routeTitle = computed(() => {
	if (!props.ticket) return '-'
	return `${props.ticket.destinationFrom} - ${props.ticket.destinationTo}`
})


const seatLabel = computed(() => {
	if (!props.ticket) return '-'
	const seatNo = String(props.ticket.seatNo || '-').trim() || '-'
	const gender = String(props.ticket.passengerGender || 'Passenger').trim() || 'Passenger'
	return `${seatNo}, ${gender}`
})

const qrCodeDataUrl = ref('')

const qrPayload = computed(() => {
	if (!props.ticket) return ''
	const code = String(props.ticket.code || '').trim()
	const seatNo = String(props.ticket.seatNo || '').trim()
	if (!code && !seatNo) return ''
	return `CODE:${code}\nSEAT:${seatNo}`
})

watch(
	() => qrPayload.value,
	async (payload) => {
		if (!payload) {
			qrCodeDataUrl.value = ''
			return
		}

		try {
			qrCodeDataUrl.value = await QRCode.toDataURL(payload, {
				width: 210,
				margin: 1,
				errorCorrectionLevel: 'H',
			})
		} catch (error) {
			console.error('Failed to generate QR code:', error)
			qrCodeDataUrl.value = ''
		}
	},
	{ immediate: true }
)

const createMapUrl = (lat: string, lng: string, fallbackText: string) => {
	const latText = String(lat || '').trim()
	const lngText = String(lng || '').trim()
	if (latText && lngText) {
		return `https://www.google.com/maps?q=${encodeURIComponent(`${latText},${lngText}`)}`
	}

	const fallback = String(fallbackText || '').trim()
	if (!fallback || fallback === '-') return ''
	return `https://www.google.com/maps?q=${encodeURIComponent(fallback)}`
}

const boardingMapUrl = computed(() => {
	if (!props.ticket) return ''
	return createMapUrl(
		props.ticket.boardingPointLat,
		props.ticket.boardingPointLong,
		props.ticket.boardingPointAddress || props.ticket.boardingPoint
	)
})

const dropOffMapUrl = computed(() => {
	if (!props.ticket) return ''
	return createMapUrl(
		props.ticket.dropOffPointLat,
		props.ticket.dropOffPointLong,
		props.ticket.dropOffPointAddress || props.ticket.dropOffPoint
	)
})

const currency = (value: string) => {
	const parsed = Number.parseFloat(String(value || '').replace(/,/g, ''))
	if (Number.isNaN(parsed)) return `${value || '0'} $`
	return `${parsed.toFixed(2)} $`
}
</script>

<template>
	<Teleport to="body">
		<div
			v-if="isOpen"
			class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 "
			@click.self="closeModal"
			role="dialog"
			aria-modal="true"
		>
			<div class=" container overflow-hidden rounded-2xl bg-white shadow-2xl transition-transform">
				<div class="flex items-center justify-end border-b border-[#e5e7eb] px-3 py-2 md:py-3">
					<button
						type="button"
						class="text-3xl leading-none text-[#6b7280] transition-colors hover:text-[#111827]"
						@click="closeModal"
						aria-label="Close ticket detail"
					>
						&times;
					</button>
				</div>

			

				<template v-if="!isLoading && ticket">
				<div class="grid grid-cols-1 gap-5 border-b border-[#e5e7eb] px-4 py-4 md:gap-7 md:px-8 md:py-5 lg:grid-cols-[255px_1fr]">
					<div class="rounded-lg bg-[#d8d8d8] p-3 md:p-4">
						<div class="grid place-items-center rounded-md bg-white/70 p-2">
							<img
								v-if="qrCodeDataUrl"
								:src="qrCodeDataUrl"
								alt="Ticket QR Code"
								class="h-[185px] w-[185px] rounded bg-white p-1 md:h-[200px] md:w-[200px]"
							>
							<div v-else class="grid h-[150px] w-[150px] place-items-center rounded border border-[#d1d5db] bg-[#111827] text-center text-xs font-semibold text-white">
								<span>QR</span>
								<span class="px-2">{{ ticket.code }}</span>
							</div>
						</div>
						<div class="mt-2 flex items-center justify-between px-1">
							<p class="text-base font-normal leading-none text-[#374151]">{{ seatLabel }}</p>
							<svg class="h-8 w-8 text-[#2b2f8f]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M5 12h13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
								<path d="m13 6 6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</div>
					</div>

					<div>
						<div class="mb-4 flex items-center gap-3 md:mb-5">
							<img src="/images/vireak-buntham.png" alt="VET" class="h-10 w-10 object-contain md:h-11 md:w-11">
							<h3 class="text-lg font-semibold leading-tight text-[#232529]">{{ routeTitle }}</h3>
						</div>

						<div class="grid grid-cols-1 gap-x-10 gap-y-2 text-base text-[#404040] md:grid-cols-2 md:gap-y-3">
							<p>Code: <span class="text-[#353535]">{{ ticket.code }}</span></p>
							<p>Departure Date: <span class="text-[#353535]">{{ ticket.travelDate }} ({{ ticket.departure }})</span></p>
							<p>Booked Date: <span class="text-[#353535]">{{ ticket.bookingDate }}</span></p>
							<p>Transaction ID: <span class="text-[#353535]">{{ ticket.transactionId }}</span></p>
							<p>Phone Number: <span class="text-[#353535]">{{ ticket.telephone }}</span></p>
							<p>Seat No: <span class="text-[#353535]">{{ ticket.seatNo }}</span></p>
							<p>
								Boarding Point:
								<a
									v-if="boardingMapUrl"
									:href="boardingMapUrl"
									target="_blank"
									rel="noopener noreferrer"
									class="text-[#2563eb] underline"
								>
									View Map
								</a>
								<span v-else class="text-[#9ca3af]">View Map</span>
							</p>
							<p>
								Drop Off Point:
								<a
									v-if="dropOffMapUrl"
									:href="dropOffMapUrl"
									target="_blank"
									rel="noopener noreferrer"
									class="text-[#2563eb] underline"
								>
									View Map
								</a>
								<span v-else class="text-[#9ca3af]">View Map</span>
							</p>
							<p>Payment Type: <span class="font-semibold text-[#ef6b14]">{{ ticket.paymentType }}</span></p>
							<p><span class="text-[#2563eb] underline">Take a survey</span></p>
						</div>
					</div>
				</div>

				<div class="grid grid-cols-1 gap-6 px-4 py-6 text-base text-[#374151] md:px-8 lg:grid-cols-2 lg:gap-10">
					<div>
						<h4 class="mb-4 text-lg font-semibold text-[#12335a]">Information Customer</h4>
						<div class="grid grid-cols-3 gap-4">
							<p class="font-semibold text-[#2f3136]">Nationality</p>
							<p class="font-semibold text-[#2f3136]">Seat No.</p>
							<p class="font-semibold text-[#2f3136]">Gender</p>
							<p class="text-[#2f3136]">{{ ticket.nationalityName }}</p>
							<p class="text-[#2f3136]">{{ ticket.seatNo }}</p>
							<p class="text-[#2f3136]">{{ ticket.passengerGender }}</p>
						</div>
					</div>

					<div>
						<h4 class="mb-4 text-lg font-semibold text-[#12335a]">Summary Payment</h4>
						<div class="space-y-2">
							<p class="flex items-center justify-between gap-4">
								<span class="text-[#2f3136]">Grand Total</span>
								<span class="text-[#2f3136]">{{ currency(ticket.subTotal) }}</span>
							</p>
							<p class="flex items-center justify-between gap-4">
								<span class="text-[#2f3136]">Total</span>
								<span class="text-[#2f3136]">{{ currency(ticket.totalAmount) }}</span>
							</p>
						</div>
					</div>
				</div>
				</template>

				<div v-else class="grid min-h-[320px] place-items-center px-7 py-6">
					<p class="text-base text-[#4b5563]">No ticket detail found.</p>
				</div>
			</div>
		</div>
	</Teleport>
</template>

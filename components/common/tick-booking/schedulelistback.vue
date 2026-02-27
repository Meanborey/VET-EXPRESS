<template>
	<div class="container mx-auto py-8">
		<SeatSelectionModal
			:is-open="showSeatModal"
			:seat-data="seatData"
			:schedule-info="selectedScheduleInfo"
			:unavailable-seats="unavailableSeats"
			:journey-id="currentSchedule?.id"
			:fetch-from-api="true"
			@close="showSeatModal = false"
			@continue="handleSeatContinue"
		/>

		<div class="">
			<div v-if="!showModifyForm" class="grid grid-cols-5 gap-6 items-center bg-white border-t border-x-gray-500 border-b p-3 mb-6">
				<div>
					<p class="text-sm text-gray-500">From</p>
					<p class="text-base">{{ searchParams.from }}</p>
				</div>
				<div>
					<svg class="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
					</svg>
				</div>
				<div class="flex items-center gap-2">
					<div>
						<p class="text-sm text-gray-500">To</p>
						<p class="text-base">{{ searchParams.to }}</p>
					</div>
				</div>
				<div>
					<p class="text-sm text-gray-500">Return Date</p>
					<p class="text-base">{{ searchParams.departure }}</p>
				</div>
				<div class="flex justify-end">
					<button @click="showModifyForm = true"
						class="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors">
						Modify
					</button>
				</div>
			</div>
			<div v-else class=" mb-6">
				<destination-form @submit="handleModifySubmit" />
			</div>
		</div>


		<div class="space-y-4">
			<div v-if="isLoading" class="flex justify-center items-center py-12">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
			</div>

			<cardlistschedule v-else v-for="schedule in schedules" :key="schedule.id" :schedule="schedule"
				@book-now="handleBookNow" @trip-info="handleTripInfo" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import DestinationForm from '~/components/form/destination-form.vue'
import { useDestinationStore } from '~/stores/useDestinationStore'
import { useScheduleStore } from '~/stores/useScheduleStore'

interface SearchParams {
	from: string
	to: string
	departure: string
}

const route = useRoute()
const router = useRouter()
const destinationStore = useDestinationStore()
const scheduleStore = useScheduleStore()
const showModifyForm = ref(false)

const getStoredValue = (key: string): string => {
	if (typeof localStorage === 'undefined') return ''
	return localStorage.getItem(key) || ''
}

const showSeatModal = ref(false)
const currentSchedule = ref<any>(null)
const selectedScheduleInfo = ref({
	routeTitle: '',
	routeType: '',
	vehicleType: '',
	departure: '',
	departureTime: '',
	arrivalTime: '',
	price: 0
})

const formatTime = (time: string): string => {
	if (!time) return ''

	if (/^\d{2}:\d{2}$/.test(time)) {
		return time
	}

	if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
		return time.substring(0, 5)
	}

	try {
		const date = new Date(time)
		if (!isNaN(date.getTime())) {
			const hours = date.getHours().toString().padStart(2, '0')
			const minutes = date.getMinutes().toString().padStart(2, '0')
			return `${hours}:${minutes}`
		}
	} catch {
		// ignore parse error and fall back to regex extraction
	}

	const timeMatch = time.match(/(\d{1,2}):(\d{2})/)
	if (timeMatch) {
		const hours = timeMatch[1]?.padStart(2, '0') ?? ''
		const minutes = timeMatch[2] ?? ''
		return `${hours}:${minutes}`
	}

	return time
}

const searchParams = ref<SearchParams>({
	from: (route.query.from as string) || destinationStore.searchParams.origin || '',
	to: (route.query.to as string) || destinationStore.searchParams.destination || '',
	departure: (route.query.returnDate as string) || destinationStore.searchParams.returnDate || getStoredValue('returnDate') || ''
})

const schedules = computed(() => scheduleStore.getAllSchedules)
const isLoading = computed(() => scheduleStore.isLoading)

const seatData = computed(() => currentSchedule.value?.seatLayout || '[]')
const unavailableSeats = computed(() => currentSchedule.value?.unavailableSeats || [])

const getReturnDestinationIds = () => {
	const fromStorage = typeof localStorage !== 'undefined' ? localStorage.getItem('destinationToId') || '' : ''
	const toStorage = typeof localStorage !== 'undefined' ? localStorage.getItem('departureFromId') || '' : ''

	return {
		destinationFrom: fromStorage || destinationStore.searchParams.destinationTo || (route.query.toId as string) || (route.query.destinationTo as string) || '',
		destinationTo: toStorage || destinationStore.searchParams.destinationFrom || (route.query.fromId as string) || (route.query.destinationFrom as string) || ''
	}
}

const fetchReturnSchedules = async () => {
	const returnDate = searchParams.value.departure
	const { destinationFrom, destinationTo } = getReturnDestinationIds()
	const nationally = (route.query.nationally as string) || destinationStore.searchParams.nationally || 'local'
	const type = (route.query.type as string) || destinationStore.searchParams.type || destinationStore.currentType || '1'

	if (destinationFrom && destinationTo && returnDate && type) {
		await scheduleStore.fetchSchedulesByDate(
			returnDate,
			destinationFrom,
			destinationTo,
			nationally,
			type
		)
	}
}

const handleBookNow = (schedule: any) => {
	currentSchedule.value = schedule

	localStorage.setItem('journeyid', schedule.id)
	localStorage.setItem('dateFrom', searchParams.value.departure)

	selectedScheduleInfo.value = {
		routeTitle: `${searchParams.value.from} - ${searchParams.value.to}`,
		routeType: schedule.routeInfo || '(Direct)',
		vehicleType: schedule.transportationType || schedule.vehicleName || String(schedule.vehicleType || ''),
		departure: searchParams.value.departure,
		departureTime: formatTime(String(schedule.departure || '')),
		arrivalTime: formatTime(String(schedule.arrival || '')),
		price: schedule.price
	}

	showSeatModal.value = true
}

const handleSeatContinue = (selectedSeats: any[]) => {
	showSeatModal.value = false

	const returnSeatLabels = selectedSeats.map(s => s.label).join(',')
	const returnTotalFare = (selectedSeats.length * currentSchedule.value?.price).toFixed(2)
	const returnDepartureTime = formatTime(String(currentSchedule.value?.departure || ''))
	const returnArrivalTime = formatTime(String(currentSchedule.value?.arrival || ''))
	const returnVehicleType =
		currentSchedule.value?.transportationType ||
		currentSchedule.value?.vehicleName ||
		String(currentSchedule.value?.vehicleType || '')

	router.push({
		path: '/passenger',
		query: {
			tripType: 'round-trip',
			scheduleId: currentSchedule.value?.id,
			from: searchParams.value.from,
			to: searchParams.value.to,
			departDate: (route.query.departDate as string) || destinationStore.searchParams.departDate || '',
			seats: returnSeatLabels,
			totalFare: returnTotalFare,
			returnDate: searchParams.value.departure,
			outboundScheduleId: (route.query.outboundScheduleId as string) || undefined,
			outboundSeats: (route.query.outboundSeats as string) || undefined,
			outboundTotalFare: (route.query.outboundTotalFare as string) || undefined,
			outboundVehicleType: (route.query.outboundVehicleType as string) || undefined,
			outboundDepartureTime: (route.query.outboundDepartureTime as string) || undefined,
			outboundArrivalTime: (route.query.outboundArrivalTime as string) || undefined,
			returnScheduleId: currentSchedule.value?.id,
			returnSeats: returnSeatLabels,
			returnTotalFare: returnTotalFare,
			returnVehicleType,
			returnDepartureTime,
			returnArrivalTime
		}
	})
}

const handleTripInfo = (schedule: any) => {
	console.log('Trip info:', schedule)
}

const handleModifySubmit = async () => {
	showModifyForm.value = false

	const fromName = destinationStore.searchParams.origin || ''
	const toName = destinationStore.searchParams.destination || ''
	const returnDate = destinationStore.searchParams.returnDate || ''

	searchParams.value = {
		from: fromName,
		to: toName,
		departure: returnDate
	}

	await fetchReturnSchedules()
}

const retryFetch = async () => {
	await fetchReturnSchedules()
}

onMounted(async () => {
	if (searchParams.value.from || searchParams.value.to || searchParams.value.departure) {
		const fromId = (route.query.fromId as string) || (route.query.destinationFrom as string) || ''
		const toId = (route.query.toId as string) || (route.query.destinationTo as string) || ''
		const nationally = (route.query.nationally as string) || 'local'
		const type = (route.query.type as string) || destinationStore.currentType || '1'

		destinationStore.setSearchParams({
			origin: searchParams.value.from,
			destinationFrom: fromId,
			destination: searchParams.value.to,
			destinationTo: toId,
			departDate: (route.query.departDate as string) || destinationStore.searchParams.departDate || '',
			returnDate: searchParams.value.departure,
			nationally: nationally,
			type: type
		})

		await fetchReturnSchedules()
	}
})
</script>

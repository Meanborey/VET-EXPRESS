<template>
	<section class="py-8 lg:py-10">
		<div class="container">
			<h1 class="text-[36px] font-semibold leading-tight text-[#1F2A37]">Payment Completed</h1>
			<div class="mt-4 h-px w-full bg-[#E2E8F0]" />

			<div class="mt-8 max-w-[1160px]">
				<p class="text-[15px] font-semibold text-[#2A3342]">
					Thank you, your payment has been successful. A confirmation email has been send to
					<span class="break-all">{{ booking.emailAddress }}</span>.
				</p>
				<p class="mt-5 text-[15px] font-semibold text-[#2A3342]">
					If you haven't received your E-ticket via email, please click button resend your email.
				</p>

				<button
					type="button"
					class="mt-4 inline-flex h-11 items-center justify-center rounded-[2px] bg-[#168AF4] px-8 text-base font-semibold text-white transition hover:bg-[#0c7de3]"
					:disabled="isResending"
					@click="resendEmail"
				>
					{{ isResending ? 'Resending...' : 'Resend Email' }}
				</button>

				<p v-if="resendMessage" class="mt-3 text-sm text-green-600">{{ resendMessage }}</p>
				<p v-if="resendError" class="mt-2 text-sm text-red-600">{{ resendError }}</p>

				<div class="mt-5 space-y-2 text-[15px] font-semibold text-[#2A3342]">
					<p>
						<span class="text-[#E53E3E]">*</span>
						In Case You Still Have Not Received Your E-Ticket. Please Contact Us Via:
					</p>
					<p>Email address: support@vireakbuntham.com</p>
					<p>Hotline: (+855) 81 911 911</p>
				</div>

				<div class="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
					<article class="rounded-[6px] border border-[#8B9BB4] p-5">
						<h2 class="text-[30px] font-semibold text-[#1F2A37]">Trip Detail</h2>

						<div class="mt-3 space-y-2.5 text-[15px] text-[#4A5565]">
							<div class="grid grid-cols-[200px_16px_1fr]">
								<span>Ticket code</span>
								<span>:</span>
								<span class="font-semibold text-[#2B7FFF]">{{ trip.ticketCode }}</span>
							</div>
							<div class="grid grid-cols-[200px_16px_1fr]">
								<span>Destination From</span>
								<span>:</span>
								<span>{{ trip.destinationFrom }}</span>
							</div>
							<div class="grid grid-cols-[200px_16px_1fr]">
								<span>Travel Date</span>
								<span>:</span>
								<span>{{ trip.travelDate }}</span>
							</div>
							<div class="grid grid-cols-[200px_16px_1fr]">
								<span>Phone number</span>
								<span>:</span>
								<span>{{ trip.departurePhone }}</span>
							</div>
							<div class="grid grid-cols-[200px_16px_1fr]">
								<span>Departure Name</span>
								<span>:</span>
								<span>{{ trip.departureName }}</span>
							</div>
							<div class="grid grid-cols-[200px_16px_1fr]">
								<span>Departure address</span>
								<span>:</span>
								<span>{{ trip.departureAddress }}</span>
							</div>
							<div class="grid grid-cols-[200px_16px_1fr]">
								<span>Destination To</span>
								<span>:</span>
								<span>{{ trip.destinationTo }}</span>
							</div>
							<div class="grid grid-cols-[200px_16px_1fr]">
								<span>Arrival Date</span>
								<span>:</span>
								<span>{{ trip.arrivalDate }}</span>
							</div>
							<div class="grid grid-cols-[200px_16px_1fr]">
								<span>Phone number</span>
								<span>:</span>
								<span>{{ trip.arrivalPhone }}</span>
							</div>
							<div class="grid grid-cols-[200px_16px_1fr]">
								<span>Arrival Name</span>
								<span>:</span>
								<span>{{ trip.arrivalName }}</span>
							</div>
							<div class="grid grid-cols-[200px_16px_1fr]">
								<span>Arrival address</span>
								<span>:</span>
								<span>{{ trip.arrivalAddress }}</span>
							</div>
						</div>

						<div class="mt-6">
							<h3 class="text-[30px] font-semibold text-[#1F2A37]">Passenger Details</h3>

							<div class="mt-3 overflow-x-auto">
								<table class="w-full min-w-[520px] text-left text-[15px] text-[#2A3342]">
									<thead>
										<tr>
											<th class="pb-2 font-semibold">Seat</th>
											<th class="pb-2 font-semibold">Name</th>
											<th class="pb-2 font-semibold">Gender</th>
											<th class="pb-2 font-semibold">Nationality</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="(passenger, index) in passengerDetails" :key="`passenger-${index}`">
											<td class="py-0.5">{{ passenger.seat }}</td>
											<td class="py-0.5">{{ passenger.name }}</td>
											<td class="py-0.5">{{ passenger.gender }}</td>
											<td class="py-0.5">{{ passenger.nationality }}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</article>

					<article class="rounded-[6px] border border-[#8B9BB4] p-5">
						<h2 class="text-[30px] font-semibold text-[#1F2A37]">Booking Detail</h2>

						<div class="mt-3 space-y-2.5 text-[15px] text-[#4A5565]">
							<div class="grid grid-cols-[180px_16px_1fr]">
								<span>Booking ID</span>
								<span>:</span>
								<span class="font-semibold text-[#2A3342]">{{ booking.bookingId }}</span>
							</div>
							<div class="grid grid-cols-[180px_16px_1fr]">
								<span>Booking Date</span>
								<span>:</span>
								<span>{{ booking.bookingDate }}</span>
							</div>
							<div class="grid grid-cols-[180px_16px_1fr]">
								<span>Email address</span>
								<span>:</span>
								<span class="break-all">{{ booking.emailAddress }}</span>
							</div>
							<div class="grid grid-cols-[180px_16px_1fr]">
								<span>Phone number</span>
								<span>:</span>
								<span>{{ booking.phoneNumber }}</span>
							</div>
							<div class="grid grid-cols-[180px_16px_1fr]">
								<span>Payment Type</span>
								<span>:</span>
								<span class="font-semibold text-[#2A3342]">{{ booking.paymentType }}</span>
							</div>
							<div class="grid grid-cols-[180px_16px_1fr]">
								<span>Grand Total</span>
								<span>:</span>
								<span class="font-semibold text-[#2A3342]">{{ formatCurrency(booking.grandTotal) }}</span>
							</div>
							<div class="grid grid-cols-[180px_16px_1fr]">
								<span>Discount({{ booking.discountPercent }}%)</span>
								<span>:</span>
								<span class="font-semibold text-[#2A3342]">{{ formatCurrency(booking.discountAmount) }}</span>
							</div>
							<div class="grid grid-cols-[180px_16px_1fr]">
								<span>Total</span>
								<span>:</span>
								<span class="font-semibold text-[#2A3342]">{{ formatCurrency(booking.total) }}</span>
							</div>
						</div>
					</article>
				</div>

				<button
					type="button"
					class="mt-8 inline-flex items-center gap-2 text-[36px] font-semibold text-[#2B7FFF] hover:underline"
					@click="bookMore"
				>
					<span aria-hidden="true">←</span>
					<span>BOOK MORE</span>
				</button>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'

const route = useRoute()
const router = useRouter()
const paymentStore = usePaymentStore()
const { isResending, resendMessage, resendError, transactionDetails } = storeToRefs(paymentStore)

const getQueryValue = (value: string | string[] | undefined): string => {
	if (Array.isArray(value)) return value[0] || ''
	return value || ''
}

const getStoredValue = (key: string): string => {
	if (typeof localStorage === 'undefined') return ''
	return localStorage.getItem(key) || ''
}

const getRecordString = (record: Record<string, unknown>, keys: string[]): string => {
	for (const key of keys) {
		const value = record[key]
		if (typeof value === 'string' && value.trim()) return value.trim()
		if (typeof value === 'number') return String(value)
	}
	return ''
}

const getRecordList = (record: Record<string, unknown>, keys: string[]): string[] => {
	for (const key of keys) {
		const value = record[key]

		if (Array.isArray(value)) {
			return value.map((item) => String(item).trim()).filter(Boolean)
		}

		if (typeof value === 'string') {
			const parsed = parseList(value)
			if (parsed.length > 0) return parsed
		}
	}

	return []
}

const parseList = (value: string | string[] | undefined): string[] => {
	const raw = getQueryValue(value)
	if (!raw) return []

	const normalized = raw.trim()
	if (!normalized) return []

	if (normalized.startsWith('[')) {
		try {
			const parsed = JSON.parse(normalized)
			if (Array.isArray(parsed)) {
				return parsed.map((item) => String(item).trim()).filter(Boolean)
			}
		} catch {
			// fallback to comma-separated
		}
	}

	return normalized.split(',').map((item) => item.trim()).filter(Boolean)
}

const toNumber = (value: string): number | null => {
	const parsed = Number(value)
	return Number.isFinite(parsed) ? parsed : null
}

const formatGender = (value: string): string => {
	if (!value) return '-'
	return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}

const formatDateTime = (dateValue: string, timeValue?: string): string => {
	const dateText = dateValue?.trim() || ''
	const timeText = timeValue?.trim() || ''

	if (dateText && timeText) return `${dateText} ${timeText}`
	return dateText || timeText || '-'
}

const routeTitle = computed(() => {
	return getQueryValue(route.query.routeTitle as string | string[] | undefined) || getStoredValue('selectedRouteTitle')
})

const resolvedTransactionId = computed(() => {
	return (
		getQueryValue(route.query.transactionId as string | string[] | undefined) ||
		getQueryValue(route.query.transaction_id as string | string[] | undefined) ||
		getQueryValue(route.query.bookingCode as string | string[] | undefined) ||
		getQueryValue(route.query.booking_code as string | string[] | undefined) ||
		getQueryValue(route.query.orderId as string | string[] | undefined) ||
		getQueryValue(route.query.bookingId as string | string[] | undefined) ||
		getStoredValue('lastOrderId')
	)
})

const loadTransactionDetails = async (): Promise<void> => {
	if (!resolvedTransactionId.value) return
	await paymentStore.fetchTransactionDetails(resolvedTransactionId.value)
}

const routeParts = computed(() => {
	const raw = routeTitle.value
	if (!raw) return { from: '-', to: '-' }

	const parts = raw.split('-').map((part) => part.trim()).filter(Boolean)
	if (parts.length >= 2) {
		return {
			from: parts[0] || '-',
			to: parts.slice(1).join(' - ') || '-'
		}
	}

	return { from: raw, to: '-' }
})

const trip = computed(() => {
	const apiData = transactionDetails.value
	const apiDestinationFrom = apiData ? getRecordString(apiData, ['destinationFrom', 'origin', 'from', 'fromName']) : ''
	const apiDestinationTo = apiData ? getRecordString(apiData, ['destinationTo', 'destination', 'to', 'toName']) : ''
	const apiDeparturePhone = apiData ? getRecordString(apiData, ['departurePhone', 'originPhone', 'phoneFrom']) : ''
	const apiDepartureName = apiData ? getRecordString(apiData, ['departureName', 'boardingPoint', 'originName']) : ''
	const apiDepartureAddress = apiData ? getRecordString(apiData, ['departureAddress', 'boardingAddress', 'originAddress']) : ''
	const apiArrivalPhone = apiData ? getRecordString(apiData, ['arrivalPhone', 'destinationPhone', 'phoneTo']) : ''
	const apiArrivalName = apiData ? getRecordString(apiData, ['arrivalName', 'dropOffPoint', 'destinationName']) : ''
	const apiArrivalAddress = apiData ? getRecordString(apiData, ['arrivalAddress', 'dropOffAddress', 'destinationAddress']) : ''

	const departDate = getQueryValue(route.query.departDate as string | string[] | undefined) || getStoredValue('selectedDepartureDate') || getStoredValue('dateFrom')
	const departureTime = getQueryValue(route.query.departureTime as string | string[] | undefined) || getStoredValue('selectedDepartureTime') || getStoredValue('departureTime')
	const arrivalDate = getQueryValue(route.query.arrivalDate as string | string[] | undefined)
	const arrivalTime = getQueryValue(route.query.arrivalTime as string | string[] | undefined)
	const apiDepartDate = apiData ? getRecordString(apiData, ['departDate', 'departureDate', 'travelDate']) : ''
	const apiDepartureTime = apiData ? getRecordString(apiData, ['departureTime', 'departTime']) : ''
	const apiArrivalDate = apiData ? getRecordString(apiData, ['arrivalDate', 'arriveDate']) : ''
	const apiArrivalTime = apiData ? getRecordString(apiData, ['arrivalTime', 'arriveTime']) : ''

	const ticketCode =
		(apiData ? getRecordString(apiData, ['ticketCode', 'ticket_code', 'transactionId', 'transaction_id', 'bookingCode', 'orderId', 'bookingId']) : '') ||
		getQueryValue(route.query.ticketCode as string | string[] | undefined) ||
		getQueryValue(route.query.ticket_code as string | string[] | undefined) ||
		getQueryValue(route.query.transactionId as string | string[] | undefined) ||
		getQueryValue(route.query.transaction_id as string | string[] | undefined) ||
		getQueryValue(route.query.bookingCode as string | string[] | undefined) ||
		getQueryValue(route.query.orderId as string | string[] | undefined) ||
		getQueryValue(route.query.bookingId as string | string[] | undefined) ||
		getStoredValue('lastOrderId') ||
		'-'

	return {
		ticketCode,
		destinationFrom: apiDestinationFrom || getQueryValue(route.query.destinationFrom as string | string[] | undefined) || routeParts.value.from || '-',
		travelDate: formatDateTime(apiDepartDate || departDate, apiDepartureTime || departureTime),
		departurePhone: apiDeparturePhone || getQueryValue(route.query.departurePhone as string | string[] | undefined) || getQueryValue(route.query.phone as string | string[] | undefined) || '-',
		departureName: apiDepartureName || getQueryValue(route.query.departureName as string | string[] | undefined) || getQueryValue(route.query.boardingPoint as string | string[] | undefined) || '-',
		departureAddress: apiDepartureAddress || getQueryValue(route.query.departureAddress as string | string[] | undefined) || getQueryValue(route.query.boardingAddress as string | string[] | undefined) || '-',
		destinationTo: apiDestinationTo || getQueryValue(route.query.destinationTo as string | string[] | undefined) || routeParts.value.to || '-',
		arrivalDate: formatDateTime(apiArrivalDate || arrivalDate || departDate, apiArrivalTime || arrivalTime),
		arrivalPhone: apiArrivalPhone || getQueryValue(route.query.arrivalPhone as string | string[] | undefined) || '-',
		arrivalName: apiArrivalName || getQueryValue(route.query.arrivalName as string | string[] | undefined) || getQueryValue(route.query.dropOffPoint as string | string[] | undefined) || '-',
		arrivalAddress: apiArrivalAddress || getQueryValue(route.query.arrivalAddress as string | string[] | undefined) || getQueryValue(route.query.dropOffAddress as string | string[] | undefined) || '-'
	}
})

const booking = computed(() => {
	const apiData = transactionDetails.value
	const apiGrandTotal = apiData ? toNumber(getRecordString(apiData, ['grandTotal', 'totalFare', 'subTotal', 'amount'])) : null
	const apiDiscount = apiData ? toNumber(getRecordString(apiData, ['discount', 'discountAmount'])) : null
	const apiDiscountPercent = apiData ? toNumber(getRecordString(apiData, ['discountPercent', 'discount_rate'])) : null
	const apiPaymentType = apiData ? getRecordString(apiData, ['paymentType', 'paymentMethod']) : ''
	const apiBookingDate = apiData ? getRecordString(apiData, ['bookingDate', 'booking_date', 'createdAt']) : ''
	const apiEmail = apiData ? getRecordString(apiData, ['email', 'emailAddress']) : ''
	const apiPhone = apiData ? getRecordString(apiData, ['phone', 'telephone', 'phoneNumber']) : ''
	const apiBookingId = apiData ? getRecordString(apiData, ['bookingId', 'booking_code', 'bookingCode', 'transactionId', 'orderId']) : ''

	const grandTotalFromQuery =
		toNumber(getQueryValue(route.query.grandTotal as string | string[] | undefined)) ??
		toNumber(getQueryValue(route.query.totalFare as string | string[] | undefined)) ??
		toNumber(getQueryValue(route.query.total as string | string[] | undefined))

	const grandTotalFromStorage = toNumber(getStoredValue('selectedTotalFare'))
	const grandTotal = apiGrandTotal ?? grandTotalFromQuery ?? grandTotalFromStorage ?? 0
	const discountAmount = apiDiscount ?? toNumber(getQueryValue(route.query.discount as string | string[] | undefined)) ?? 0
	const discountPercent = apiDiscountPercent ?? toNumber(getQueryValue(route.query.discountPercent as string | string[] | undefined)) ?? 0

	const bookingDateRaw =
		apiBookingDate ||
		getQueryValue(route.query.bookingDate as string | string[] | undefined) ||
		getQueryValue(route.query.booking_date as string | string[] | undefined) ||
		new Date().toISOString().slice(0, 10)

	return {
		bookingId:
			apiBookingId ||
			getQueryValue(route.query.bookingId as string | string[] | undefined) ||
			getQueryValue(route.query.booking_code as string | string[] | undefined) ||
			getQueryValue(route.query.bookingCode as string | string[] | undefined) ||
			getQueryValue(route.query.transactionId as string | string[] | undefined) ||
			getQueryValue(route.query.orderId as string | string[] | undefined) ||
			getStoredValue('lastOrderId') ||
			'-',
		bookingDate: bookingDateRaw,
		emailAddress: apiEmail || getQueryValue(route.query.email as string | string[] | undefined) || '-',
		phoneNumber:
			apiPhone ||
			getQueryValue(route.query.phone as string | string[] | undefined) ||
			getQueryValue(route.query.telephone as string | string[] | undefined) ||
			'-',
		paymentType:
			apiPaymentType ||
			getQueryValue(route.query.paymentType as string | string[] | undefined) ||
			getQueryValue(route.query.paymentMethod as string | string[] | undefined) ||
			'ABA KHQR',
		grandTotal,
		discountAmount,
		discountPercent,
		total: grandTotal - discountAmount
	}
})

const passengerDetails = computed(() => {
	const apiData = transactionDetails.value
	const seatsFromApi = apiData ? getRecordList(apiData, ['seatNo', 'seats', 'seatLabels']) : []
	const namesFromApi = apiData ? getRecordList(apiData, ['seatName', 'passengerNames', 'passengers']) : []
	const gendersFromApi = apiData ? getRecordList(apiData, ['genders', 'gender']) : []
	const nationalitiesFromApi = apiData ? getRecordList(apiData, ['nationalities', 'nationality']) : []

	const seatsFromQuery = parseList(route.query.seatNo as string | string[] | undefined)
	const seatsFromStorage = parseList(getStoredValue('selectedSeats'))
	const seatLabels = seatsFromApi.length > 0 ? seatsFromApi : (seatsFromQuery.length > 0 ? seatsFromQuery : seatsFromStorage)

	const names = namesFromApi.length > 0 ? namesFromApi : parseList(
		(route.query.seatName as string | string[] | undefined) ||
		(route.query.passengerNames as string | string[] | undefined)
	)
	const genders = (gendersFromApi.length > 0 ? gendersFromApi : parseList(
		(route.query.genders as string | string[] | undefined) ||
		(route.query.gender as string | string[] | undefined)
	)).map((value) => formatGender(value))
	const nationalities = nationalitiesFromApi.length > 0 ? nationalitiesFromApi : parseList(
		(route.query.nationalities as string | string[] | undefined) ||
		(route.query.nationality as string | string[] | undefined)
	)

	const count = Math.max(seatLabels.length, names.length, genders.length, nationalities.length, 1)

	return Array.from({ length: count }, (_, index) => ({
		seat: seatLabels[index] ? `#${seatLabels[index]}` : '-',
		name: names[index] || '-',
		gender: genders[index] || '-',
		nationality: nationalities[index] || '-'
	}))
})

const formatCurrency = (value: number): string => `$ ${value.toFixed(2)}`

const resendEmail = async (): Promise<void> => {
	await paymentStore.resendTicketEmail(resolvedTransactionId.value)
}

const bookMore = (): void => {
	router.push('/schedulelist')
}

watch(resolvedTransactionId, () => {
	loadTransactionDetails()
})

onMounted(() => {
	loadTransactionDetails()
})
</script>

import { defineStore } from 'pinia'
import { FetchError } from 'ofetch'

import type {
	FetchTicketDetailPayload,
	FetchTicketHistoryPayload,
	TicketHistoryApiResponse,
	TicketHistoryItem,
} from '~/types/ticketHistory'

const toRecord = (value: unknown): Record<string, unknown> | null => {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return null
	return value as Record<string, unknown>
}

const readString = (source: unknown, keys: string[]): string => {
	const record = toRecord(source)
	if (!record) return ''

	for (const key of keys) {
		const value = record[key]
		if (typeof value === 'string' && value.trim()) return value.trim()
		if (typeof value === 'number' && Number.isFinite(value)) return String(value)
	}

	const lowerMap = Object.entries(record).reduce<Record<string, unknown>>((acc, [k, v]) => {
		acc[k.toLowerCase()] = v
		return acc
	}, {})

	for (const key of keys) {
		const value = lowerMap[key.toLowerCase()]
		if (typeof value === 'string' && value.trim()) return value.trim()
		if (typeof value === 'number' && Number.isFinite(value)) return String(value)
	}

	return ''
}

const readNumber = (source: unknown, keys: string[]): number | null => {
	const stringValue = readString(source, keys)
	if (!stringValue) return null

	const parsed = Number.parseInt(stringValue, 10)
	if (Number.isNaN(parsed)) return null

	return parsed
}

const readSeatNo = (source: unknown): string => {
	const direct = readString(source, ['seatNo', 'seatNumber'])
	if (direct) return direct

	const record = toRecord(source)
	if (!record) return '-'

	const detailList = record.bookingSeatDetailList
	if (!Array.isArray(detailList) || detailList.length === 0) return '-'

	const seats = detailList
		.map((detail) => readString(detail, ['seatNo', 'seatNumber', 'seat', 'name']))
		.filter((seat) => seat.length > 0)

	if (!seats.length) return '-'

	return seats.join(', ')
}

const readPassengerGender = (source: unknown): string => {
	const directGender = readString(source, ['passengerGender', 'gender'])
	if (directGender) {
		const normalized = directGender.toLowerCase()
		if (normalized === '1' || normalized === 'male') return 'Male'
		if (normalized === '2' || normalized === 'female') return 'Female'
		return directGender
	}

	const record = toRecord(source)
	if (!record) return 'Passenger'

	const detailList = record.bookingSeatDetailList
	if (!Array.isArray(detailList) || detailList.length === 0) return 'Passenger'

	const first = detailList[0]
	const firstGender = readString(first, ['gender', 'passengerGender'])
	if (!firstGender) return 'Passenger'

	const normalized = firstGender.toLowerCase()
	if (normalized === '1' || normalized === 'male') return 'Male'
	if (normalized === '2' || normalized === 'female') return 'Female'

	return firstGender
}

const readNationalityName = (source: unknown): string => {
	const directNationality = readString(source, ['nationalityName', 'nationality'])
	if (directNationality) return directNationality

	const record = toRecord(source)
	if (!record) return '-'

	const detailList = record.bookingSeatDetailList
	if (!Array.isArray(detailList) || detailList.length === 0) return '-'

	for (const detail of detailList) {
		const nationality = readString(detail, ['nationalityName', 'nationality'])
		if (nationality) return nationality
	}

	return '-'
}

const extractList = (payload: unknown): unknown[] => {
	if (Array.isArray(payload)) return payload
	if (!payload || payload === 0) return []

	const record = toRecord(payload)
	if (!record) return []

	const listKeys = ['rows', 'list', 'items', 'data', 'result', 'bookingList', 'bookings']
	for (const key of listKeys) {
		const candidate = record[key]
		if (Array.isArray(candidate)) return candidate
	}

	const nestedBody = record.body
	if (Array.isArray(nestedBody)) return nestedBody

	return []
}

const extractSingleItem = (payload: unknown): unknown | null => {
	if (!payload || payload === 0) return null

	if (Array.isArray(payload)) {
		return payload[0] ?? null
	}

	const record = toRecord(payload)
	if (!record) return null

	const detailKeys = ['row', 'item', 'booking', 'data', 'result', 'body']
	for (const key of detailKeys) {
		const candidate = record[key]
		if (candidate && typeof candidate === 'object') {
			if (Array.isArray(candidate)) {
				return candidate[0] ?? null
			}

			return candidate
		}
	}

	return record
}

const mapTicket = (item: unknown): TicketHistoryItem => {
	const id = readString(item, ['id', 'ticketId', 'orderId']) || '-'
	const code = readString(item, ['code', 'bookingCode']) || id
	const bookingDate = readString(item, ['bookingDate', 'journeyDate', 'departDate', 'date']) || '-'
	const travelDate = readString(item, ['travelDate', 'departureDate', 'departDate', 'journeyDate']) || bookingDate
	const departure = readString(item, ['departure', 'departTime', 'departureTime', 'time']) || '-'
	const arrival = readString(item, ['arrival', 'arrivalTime']) || '-'
	const destinationFrom = readString(item, ['destinationFrom', 'origin', 'from', 'fromName']) || '-'
	const destinationTo = readString(item, ['destinationTo', 'destination', 'to', 'toName']) || '-'
	const boardingPoint = readString(item, ['boardingPoint', 'boardingPointName']) || '-'
	const boardingPointAddress = readString(item, ['boardingPointAddress']) || '-'
	const boardingPointLat = readString(item, ['boardingPointLat', 'boardingPointLats', 'boardingPointLatitude']) || ''
	const boardingPointLong = readString(item, ['boardingPointLong', 'boardingPointLongs', 'boardingPointLongitude']) || ''
	const dropOffPoint = readString(item, ['dropOffPoint', 'dropOffPointName']) || '-'
	const dropOffPointAddress = readString(item, ['dropOffPointAddress']) || '-'
	const dropOffPointLat = readString(item, ['dropOffPointLat', 'dropOffPointLats', 'dropOffPointLatitude']) || ''
	const dropOffPointLong = readString(item, ['dropOffPointLong', 'dropOffPointLongs', 'dropOffPointLongitude']) || ''
	const duration = readString(item, ['duration']) || '-'
	const transportationType = readString(item, ['transportationType', 'vehicleType', 'busType', 'transportType']) || '-'
	const totalSeatRaw = readNumber(item, ['totalSeat', 'seats', 'seat', 'qty', 'quantity'])
	const seatNo = readSeatNo(item)
	const passengerGender = readPassengerGender(item)
	const nationalityName = readNationalityName(item)
	const telephone = readString(item, ['telephone', 'phone', 'phoneNumber']) || '-'
	const transactionId = readString(item, ['transactionId']) || '-'
	const paymentType = readString(item, ['paymentType']) || '-'
	const subTotal = readString(item, ['subTotal']) || '0'
	const totalAmount = readString(item, ['totalAmount']) || '0'
	const totalVat = readString(item, ['totalVat']) || '0'
	const discount = readString(item, ['discount']) || '0'

	return {
		id,
		code,
		bookingDate,
		travelDate,
		departure,
		arrival,
		destinationFrom,
		destinationTo,
		boardingPoint,
		boardingPointAddress,
		boardingPointLat,
		boardingPointLong,
		dropOffPoint,
		dropOffPointAddress,
		dropOffPointLat,
		dropOffPointLong,
		duration,
		transportationType,
		totalSeat: totalSeatRaw && totalSeatRaw > 0 ? totalSeatRaw : 1,
		seatNo,
		nationalityName,
		passengerGender,
		telephone,
		transactionId,
		paymentType,
		subTotal,
		totalAmount,
		totalVat,
		discount,
	}
}

const extractTotalRows = (payload: unknown): number | null => {
	const direct = readNumber(payload, ['total', 'totalRows', 'totalData', 'count'])
	if (direct !== null) return direct

	const record = toRecord(payload)
	if (!record) return null

	const pagination = record.pagination
	return readNumber(pagination, ['total', 'totalRows', 'count'])
}

export const useTicketHistoryStore = defineStore('ticket-history', {
	state: () => ({
		tickets: [] as TicketHistoryItem[],
		loading: false,
		error: null as string | null,
		currentPage: 1,
		rowsPerPage: 10,
		totalRows: 0,
	}),

	getters: {
		hasTickets: (state) => state.tickets.length > 0,
		hasMore: (state) => {
			if (state.totalRows > 0) {
				return state.currentPage * state.rowsPerPage < state.totalRows
			}

			return state.tickets.length === state.rowsPerPage
		},
	},

	actions: {
		async fetchTickets(payload: FetchTicketHistoryPayload = {}) {
			this.loading = true
			this.error = null

			try {
				const runtimeConfig = useRuntimeConfig()
				const baseUrl = String(runtimeConfig.public.apiBaseUrl || '').trim().replace(/\/$/, '')
				const apiToken = String(runtimeConfig.public.apiToken || '').trim()

				if (!baseUrl) {
					throw new Error('Missing API base URL. Set NUXT_PUBLIC_API_BASE_URL in your environment.')
				}

				const sessionToken = String(payload.sessionToken || '').trim()
				if (!sessionToken) {
					throw new Error('Missing session token. Please login again.')
				}

				const page = Number.isFinite(payload.page) && (payload.page || 0) > 0 ? Number(payload.page) : this.currentPage
				const rowsPerPage = Number.isFinite(payload.rowsPerPage) && (payload.rowsPerPage || 0) > 0
					? Number(payload.rowsPerPage)
					: this.rowsPerPage

				this.currentPage = page
				this.rowsPerPage = rowsPerPage

				const requestHeaders: Record<string, string> = {
					'Content-Type': 'application/json',
				}
				if (apiToken) {
					requestHeaders.Authorization = `Bearer ${apiToken}`
				}

				const requestData = {
					session: sessionToken,
					page,
					rowsPerPage,
				}

				const response = await $fetch<TicketHistoryApiResponse>(`${baseUrl}/booking/list`, {
					method: 'POST',
					headers: requestHeaders,
					body: requestData,
				})
                console.log('Raw API response:', response)

				const headerResult = response?.header?.result
				const statusCode = response?.header?.statusCode
				const headerMessage = String(response?.header?.message || response?.message || '').trim()

				const hasFailureSignal =
					headerResult === false ||
					(typeof statusCode === 'number' && statusCode >= 400)

				if (hasFailureSignal) {
					throw new Error(headerMessage || 'Failed to load ticket history.')
				}

				const payloadBody = response?.body
				const payloadData = response?.data
				const rawList = extractList(payloadBody)
				const list = rawList.length ? rawList : extractList(payloadData)

				this.tickets = list.map(mapTicket)
				this.totalRows = extractTotalRows(payloadBody) ?? extractTotalRows(payloadData) ?? this.tickets.length
			} catch (err: unknown) {
				this.tickets = []
				this.totalRows = 0

				if (err instanceof FetchError) {
					const errorData = (err.data ?? {}) as Record<string, unknown>
					this.error = String(errorData.message || errorData.error || err.message || 'Failed to load ticket history.')
				} else {
					this.error = err instanceof Error ? err.message : 'Failed to load ticket history.'
				}
			} finally {
				this.loading = false
			}
		},

		async fetchTicketDetail(payload: FetchTicketDetailPayload = {}): Promise<TicketHistoryItem | null> {
			try {
				const runtimeConfig = useRuntimeConfig()
				const baseUrl = String(runtimeConfig.public.apiBaseUrl || '').trim().replace(/\/$/, '')
				const apiToken = String(runtimeConfig.public.apiToken || '').trim()

				if (!baseUrl) {
					throw new Error('Missing API base URL. Set NUXT_PUBLIC_API_BASE_URL in your environment.')
				}

				const ticketId = String(payload.id || '').trim()
				const sessionToken = String(payload.sessionToken || '').trim()
				if (!ticketId) {
					throw new Error('Missing ticket id for detail request.')
				}

				const requestHeaders: Record<string, string> = {}
				if (apiToken) {
					requestHeaders.Authorization = `Bearer ${apiToken}`
				}

				const formData = new FormData()
				formData.append('id', ticketId)
				if (sessionToken) {
					formData.append('session', sessionToken)
				}

				const response = await $fetch<TicketHistoryApiResponse>(`${baseUrl}/booking/find/${encodeURIComponent(ticketId)}`, {
					method: 'POST',
					headers: requestHeaders,
					body: formData,
				})
				console.log('Ticket detail raw response:', response)

				const headerResult = response?.header?.result
				const statusCode = response?.header?.statusCode
				const headerMessage = String(response?.header?.message || response?.message || '').trim()

				const hasFailureSignal =
					headerResult === false ||
					(typeof statusCode === 'number' && statusCode >= 400)

				if (hasFailureSignal) {
					throw new Error(headerMessage || 'Failed to load ticket detail.')
				}

				const detailPayload = extractSingleItem(response?.body) ?? extractSingleItem(response?.data)
				if (!detailPayload) {
					return null
				}

				return mapTicket(detailPayload)
			} catch (err: unknown) {
				if (err instanceof FetchError) {
					const errorData = (err.data ?? {}) as Record<string, unknown>
					this.error = String(errorData.message || errorData.error || err.message || 'Failed to load ticket detail.')
				} else {
					this.error = err instanceof Error ? err.message : 'Failed to load ticket detail.'
				}

				return null
			}
		},
	},
})

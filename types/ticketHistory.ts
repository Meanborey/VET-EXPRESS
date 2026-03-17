export interface TicketHistoryItem {
	id: string
	code: string
	bookingDate: string
	travelDate: string
	departure: string
	arrival: string
	destinationFrom: string
	destinationTo: string
	boardingPoint: string
	boardingPointAddress: string
	boardingPointLat: string
	boardingPointLong: string
	dropOffPoint: string
	dropOffPointAddress: string
	dropOffPointLat: string
	dropOffPointLong: string
	duration: string
	transportationType: string
	totalSeat: number
	seatNo: string
	nationalityName: string
	passengerGender: string
	telephone: string
	transactionId: string
	paymentType: string
	subTotal: string
	totalAmount: string
	totalVat: string
	discount: string
}

export interface TicketHistoryApiHeader {
	result?: boolean
	statusCode?: number
	message?: string
	serverTimestamp?: number
}

export interface TicketHistoryApiResponse {
	header?: TicketHistoryApiHeader
	body?: unknown
	data?: unknown
	message?: string
}

export interface FetchTicketHistoryPayload {
	sessionToken?: string
	page?: number
	rowsPerPage?: number
}

export interface FetchTicketDetailPayload {
	sessionToken?: string
	id?: string
}

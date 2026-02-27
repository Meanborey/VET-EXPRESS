<template>
    <section class="py-8 lg:py-10">
        <div class="container">
            <button
                type="button"
                class="text-[#2B7FFF] text-sm font-semibold hover:underline"
                @click="cancelBooking"
            >
                Cancel Booking
            </button>

            <div class="my-2 h-px w-full bg-[#E2E8F0]" />

            <div class="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-40">
                <article class="rounded-lg p-6 lg:p-7 border border-[#D7DFE7] ">
                    <h2 class="text-base font-semibold text-[#2A3342]">Trip Summary</h2>

                    <h3 class="mt-4 text-base font-semibold text-[#2A3342]">Billing Details</h3>

                    <div class="mt-4 space-y-3 text-base leading-tight text-[#4A5565]">
                        <div class="grid grid-cols-[150px_14px_1fr]">
                            <span>Order ID</span>
                            <span>:</span>
                            <span class="break-all">{{ trip.orderId }}</span>
                        </div>
                        <div class="grid grid-cols-[150px_14px_1fr]">
                            <span>Email address</span>
                            <span>:</span>
                            <span class="break-all">{{ trip.email }}</span>
                        </div>
                    </div>

                    <div class="my-5 h-px w-full bg-[#D7DFE7]" />

                    <template v-if="isRoundTripSummary">
                        <template v-for="(segment, segmentIndex) in roundTripSections" :key="`${segment.route}-${segmentIndex}`">
                            <div v-if="segmentIndex > 0" class="my-5 h-px w-full bg-[#D7DFE7]" />

                            <div class="flex items-center justify-between gap-4 text-base text-[#4A5565]">
                                <p>{{ segment.route }}</p>
                            </div>

                            <div class="mt-3 space-y-3 text-base leading-tight text-[#4A5565]">
                                <div class="grid grid-cols-[150px_14px_1fr]">
                                    <span>Vehicle Type</span>
                                    <span>:</span>
                                    <span>{{ segment.vehicleType }}</span>
                                </div>
                                <div class="grid grid-cols-[150px_14px_1fr]">
                                    <span>Departure</span>
                                    <span>:</span>
                                    <span>{{ segment.departure }}</span>
                                </div>

                                <template v-for="(passenger, index) in segment.passengers" :key="`${segment.route}-${passenger.seatNo}-${index}`">
                                    <div v-if="index > 0"
                                        class="my-2 border-t border-dashed border-[#D7DFE7]"
                                    />
                                    <div class="grid grid-cols-[150px_14px_1fr]">
                                        <span>Seat No.</span>
                                        <span>:</span>
                                        <span>{{ passenger.seatNo }}</span>
                                    </div>
                                    <div class="grid grid-cols-[150px_14px_1fr]">
                                        <span>Gender</span>
                                        <span>:</span>
                                        <span>{{ passenger.gender }}</span>
                                    </div>
                                    <div class="grid grid-cols-[150px_14px_1fr]">
                                        <span>Nationality</span>
                                        <span>:</span>
                                        <span>{{ passenger.nationality }}</span>
                                    </div>
                                </template>
                            </div>
                        </template>
                    </template>

                    <template v-else>
                        <p class="text-base text-[#4A5565]">{{ trip.route }}</p>

                        <div class="mt-3 space-y-3 text-base leading-tight text-[#4A5565]">
                            <div class="grid grid-cols-[150px_14px_1fr]">
                                <span>Vehicle Type</span>
                                <span>:</span>
                                <span>{{ trip.vehicleType }}</span>
                            </div>
                            <div class="grid grid-cols-[150px_14px_1fr]">
                                <span>Departure</span>
                                <span>:</span>
                                <span>{{ trip.departure }}</span>
                            </div>

                            <template v-for="(passenger, index) in passengerDetails" :key="`${passenger.seatNo}-${index}`">
                                <div
                                    v-if="index > 0"
                                    class="my-2 border-t border-dashed border-[#D7DFE7]"
                                />

                                <div class="grid grid-cols-[150px_14px_1fr]">
                                    <span>Seat No.</span>
                                    <span>:</span>
                                    <span>{{ passenger.seatNo }}</span>
                                </div>
                                <div class="grid grid-cols-[150px_14px_1fr]">
                                    <span>Gender</span>
                                    <span>:</span>
                                    <span>{{ passenger.gender }}</span>
                                </div>
                                <div class="grid grid-cols-[150px_14px_1fr]">
                                    <span>Nationality</span>
                                    <span>:</span>
                                    <span>{{ passenger.nationality }}</span>
                                </div>
                            </template>
                        </div>
                    </template>
                </article>

                <section>
                    <div v-html="paymentFormPost" class="hidden" />

                    <h2 class="text-lg font-semibold text-[#2A3342]">Payment Methods</h2>

                    <div class="mt-5 space-y-4">
                        <button
                            v-for="method in paymentMethods"
                            :key="method.id"
                            type="button"
                            @click="selectedPayment = method.id"
                            class="w-full rounded-[8px] border p-4 text-left transition"
                            :class="selectedPayment === method.id ? 'border-[#E4EAF0] bg-slate-400/10 hover:bg-slate-400/20' : 'border-[#EEF2F6] bg-slate-400/10'"
                        >
                            <div class="flex items-center justify-between gap-4">
                                <div class="flex items-center gap-4">
                                    <span
                                        class="inline-flex h-11 min-w-11 items-center justify-center rounded-[6px] px-2 text-[14px] font-semibold"
                                        :class="method.badgeClass"
                                    >
                                        {{ method.badgeText }}
                                    </span>

                                    <div>
                                        <p class="text-lg font-semibold leading-tight text-[#2A3342]">{{ method.name }}</p>
                                        <p class="text-base leading-tight text-[#7A8796]">{{ method.description }}</p>
                                    </div>
                                </div>

                                <span
                                    class="inline-flex h-7 w-7 items-center justify-center rounded-full border-2"
                                    :class="selectedPayment === method.id ? 'border-[#F97316]' : 'border-[#7A8796]'"
                                >
                                    <span
                                        v-if="selectedPayment === method.id"
                                        class="h-3 w-3 rounded-full bg-[#F97316]"
                                    />
                                </span>
                            </div>
                        </button>
                    </div>

                    <div class="mt-6 space-y-4 text-base text-[#2A3342]">
                        <div class="flex items-center justify-between">
                            <span class="">Payment Type:</span>
                            <span class="">{{ selectedPaymentLabel }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="">Grand Total:</span>
                            <span>${{ amount.grandTotal.toFixed(2) }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="">Discount:</span>
                            <span>${{ amount.discount.toFixed(2) }}</span>
                        </div>

                        <div class="h-px w-full bg-[#D7DFE7]" />

                        <div class="flex items-center justify-between">
                            <span class="">Service Fee ({{ amount.serviceFeeRate }}%):</span>
                            <span>${{ amount.serviceFee.toFixed(2) }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="">Total:</span>
                            <span class="text-base">${{ totalAmount.toFixed(2) }}</span>
                        </div>
                    </div>

                    <p class="mt-6 text-base leading-snug text-[#5B6675]">
                        By clicking on 'Process Payment', you agree to the
                        <NuxtLink to="/term-condition" target="_blank" class="text-[#2B7FFF] hover:underline">Terms &amp; Conditions</NuxtLink>
                        and
                        <NuxtLink to="/privacy-policy" target="_blank" class="text-[#2B7FFF] hover:underline">Privacy Policy</NuxtLink>
                    </p>

                    <p v-if="paymentError" class="mt-4 text-sm text-red-600">{{ paymentError }}</p>

                    <button
                        type="button"
                        :disabled="isProcessing"
                        @click="processPayment"
                        class="mt-5 flex h-14 w-full items-center justify-between rounded-[6px] bg-[#F97316] px-5 text-lg font-semibold text-white transition hover:bg-[#ea690f]"
                        :class="isProcessing ? 'cursor-not-allowed opacity-70' : ''"
                    >
                        <span>{{ isProcessing ? 'Processing...' : 'Pay Now' }}</span>
                        <span aria-hidden="true" class="text-lg leading-none">→</span>
                    </button>
                </section>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, nextTick, ref } from 'vue'

const route = useRoute()
const paymentStore = usePaymentStore()
const { isProcessing, paymentError } = storeToRefs(paymentStore)

declare global {
    interface Window {
        AbaPayway?: {
            checkout: () => void
        }
    }
}

type AbaCheckoutApi = {
    checkout: () => void
}

const getQueryValue = (value: string | string[] | undefined): string => {
    if (Array.isArray(value)) return value[0] || ''
    return value || ''
}

const getStoredValue = (key: string): string => {
    if (typeof localStorage === 'undefined') return ''
    return localStorage.getItem(key) || ''
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
            // Fallback to comma-separated parsing
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

const getOrderId = (): string => {
    return (
        getQueryValue(route.query.transactionId as string | string[] | undefined) ||
        getQueryValue(route.query.transaction_id as string | string[] | undefined) ||
        getQueryValue(route.query.orderId as string | string[] | undefined) ||
        getQueryValue(route.query.bookingCode as string | string[] | undefined) ||
        getQueryValue(route.query.bookingId as string | string[] | undefined) ||
        getQueryValue(route.query.booking_code as string | string[] | undefined) ||
        getQueryValue(route.query.order_id as string | string[] | undefined) ||
        getStoredValue('lastOrderId') ||
        '-'
    )
}

const trip = computed(() => {
    const departDate = getQueryValue(route.query.departDate as string | string[] | undefined) || getStoredValue('selectedDepartureDate') || getStoredValue('dateFrom')
    const departureTime = getQueryValue(
        (route.query.departureTime as string | string[] | undefined) ||
        (route.query.departure as string | string[] | undefined)
    ) || getStoredValue('selectedDepartureTime') || getStoredValue('departureTime')

    return {
        orderId: getOrderId(),
        email: getQueryValue(route.query.email as string | string[] | undefined) || '-',
        route: getQueryValue(route.query.routeTitle as string | string[] | undefined) || getStoredValue('selectedRouteTitle') || '-',
        vehicleType: getQueryValue(route.query.vehicleType as string | string[] | undefined) || getStoredValue('selectedVehicleType') || '-',
        departure: departDate && departureTime ? `${departDate}, at ${departureTime}` : (departDate || departureTime || '-'),
        seatNo: getQueryValue(route.query.seatNo as string | string[] | undefined) || getStoredValue('selectedSeats') || '-',
        gender: formatGender(getQueryValue(route.query.gender as string | string[] | undefined)),
        nationality: getQueryValue(route.query.nationality as string | string[] | undefined) || '-'
    }
})

const passengerDetails = computed(() => {
    const seatList = parseList(route.query.seatNo as string | string[] | undefined)
    const fallbackSeats = parseList(getStoredValue('selectedSeats'))
    const seats = seatList.length > 0 ? seatList : fallbackSeats

    const genders = parseList(
        (route.query.genders as string | string[] | undefined) ||
        (route.query.gender as string | string[] | undefined)
    ).map((value) => formatGender(value))

    const nationalities = parseList(
        (route.query.nationalities as string | string[] | undefined) ||
        (route.query.nationality as string | string[] | undefined)
    )

    const count = Math.max(seats.length, genders.length, nationalities.length, 1)

    return Array.from({ length: count }, (_, index) => ({
        seatNo: seats[index] || (index === 0 ? trip.value.seatNo : '-'),
        gender: genders[index] || (index === 0 ? trip.value.gender : '-'),
        nationality: nationalities[index] || (index === 0 ? trip.value.nationality : '-')
    }))
})

const isRoundTripSummary = computed(() => {
    const tripType = getQueryValue(route.query.tripType as string | string[] | undefined)
    if (tripType === 'round-trip') return true
    return !!getQueryValue(route.query.returnRouteTitle as string | string[] | undefined)
})

const buildDepartureText = (date: string, time: string): string => {
    if (date && time) return `${date}, at ${time}`
    return date || time || '-'
}

const buildSegmentPassengers = (seats: string[], genders: string[], nationalities: string[]) => {
    const count = Math.max(seats.length, genders.length, nationalities.length, 1)
    return Array.from({ length: count }, (_, index) => ({
        seatNo: seats[index] || '-',
        gender: genders[index] || '-',
        nationality: nationalities[index] || '-'
    }))
}

const roundTripSections = computed(() => {
    const outboundSeats = parseList(route.query.outboundSeats as string | string[] | undefined)
    const returnSeats = parseList(route.query.returnSeats as string | string[] | undefined)
    const outboundGenders = parseList(route.query.outboundGenders as string | string[] | undefined).map((value) => formatGender(value))
    const returnGenders = parseList(route.query.returnGenders as string | string[] | undefined).map((value) => formatGender(value))
    const outboundNationalities = parseList(route.query.outboundNationalities as string | string[] | undefined)
    const returnNationalities = parseList(route.query.returnNationalities as string | string[] | undefined)
    const outboundSeatCount = toNumber(getQueryValue(route.query.outboundSeatCount as string | string[] | undefined)) ?? outboundSeats.length
    const returnSeatCount = toNumber(getQueryValue(route.query.returnSeatCount as string | string[] | undefined)) ?? returnSeats.length

    const outboundDepartDate =
        getQueryValue(route.query.outboundDepartDate as string | string[] | undefined) ||
        getQueryValue(route.query.departDate as string | string[] | undefined) ||
        getStoredValue('selectedDepartureDate') ||
        getStoredValue('dateFrom')
    const returnDepartDate =
        getQueryValue(route.query.returnDepartDate as string | string[] | undefined) ||
        getStoredValue('returnDate') ||
        getStoredValue('dateTo')
    const outboundDepartTime =
        getQueryValue(route.query.outboundDepartureTime as string | string[] | undefined) ||
        getQueryValue(route.query.departureTime as string | string[] | undefined) ||
        getStoredValue('selectedDepartureTime') ||
        getStoredValue('departureTime')
    const returnDepartTime =
        getQueryValue(route.query.returnDepartureTime as string | string[] | undefined) ||
        getStoredValue('returnDepartureTime') ||
        getStoredValue('departureTime')

    return [
        {
            route: getQueryValue(route.query.outboundRouteTitle as string | string[] | undefined) || trip.value.route,
            vehicleType: getQueryValue(route.query.outboundVehicleType as string | string[] | undefined) || trip.value.vehicleType,
            departure: buildDepartureText(outboundDepartDate, outboundDepartTime),
            seatCount: outboundSeatCount,
            passengers: buildSegmentPassengers(outboundSeats, outboundGenders, outboundNationalities)
        },
        {
            route: getQueryValue(route.query.returnRouteTitle as string | string[] | undefined) || '-',
            vehicleType: getQueryValue(route.query.returnVehicleType as string | string[] | undefined) || '-',
            departure: buildDepartureText(returnDepartDate, returnDepartTime),
            seatCount: returnSeatCount,
            passengers: buildSegmentPassengers(returnSeats, returnGenders, returnNationalities)
        }
    ]
})

const paymentMethods = [
    {
        id: 'ABA KHQR',
        paymentMethodId: 5,
        name: 'ABA KHQR',
        description: 'Scan to pay with member bank app',
        badgeText: 'KHQR',
        badgeClass: 'bg-[#EF4444] text-white'
    },
    {
        id: 'Credit / Debit Card',
        paymentMethodId: 6,
        name: 'Credit / Debit Card',
        description: 'VISA / MasterCard / JCB',
        badgeText: 'CARD',
        badgeClass: 'bg-[#0E7490] text-white'
    },
    {
        id: 'Wing Bank',
        paymentMethodId: 4,
        name: 'Wing Bank',
        description: 'Pay securely with Wing Bank',
        badgeText: 'WING',
        badgeClass: 'bg-[#65A30D] text-white'
    }
]

const selectedPayment = ref(paymentMethods[0]?.id ?? '')
const paymentFormPost = ref('')

const selectedPaymentLabel = computed(() => {
    return paymentMethods.find((method) => method.id === selectedPayment.value)?.name ?? ''
})

const selectedPaymentMethod = computed(() => {
    return paymentMethods.find((method) => method.id === selectedPayment.value) ?? null
})

const amount = computed(() => {
    const grandTotalFromQuery = toNumber(getQueryValue(route.query.totalFare as string | string[] | undefined))
    const grandTotalFromStorage = toNumber(getStoredValue('selectedTotalFare'))
    const discount = toNumber(getQueryValue(route.query.discount as string | string[] | undefined)) ?? 0
    const serviceFeeRate = toNumber(getQueryValue(route.query.serviceFeeRate as string | string[] | undefined)) ?? 0
    const serviceFee = toNumber(getQueryValue(route.query.serviceFee as string | string[] | undefined)) ?? 0

    return {
        grandTotal: grandTotalFromQuery ?? grandTotalFromStorage ?? 0,
        discount,
        serviceFeeRate,
        serviceFee
    }
})

const totalAmount = computed(() => amount.value.grandTotal - amount.value.discount + amount.value.serviceFee)

const ABA_SCRIPT_URL = 'https://checkout.payway.com.kh/plugins/checkout2-0.js'
let abaScriptPromise: Promise<void> | null = null

const getAbaCheckoutApi = (): AbaCheckoutApi | null => {
    const windowAba = (window as Window & { AbaPayway?: { checkout?: () => void } }).AbaPayway
    if (windowAba && typeof windowAba.checkout === 'function') {
        return windowAba as AbaCheckoutApi
    }

    try {
        const lexicalAba = (0, eval)('typeof AbaPayway !== "undefined" ? AbaPayway : null') as AbaCheckoutApi | null
        if (lexicalAba && typeof lexicalAba.checkout === 'function') {
            return lexicalAba
        }
    } catch {
        // ignore lookup error and fallback to null
    }

    return null
}

const hasAbaCheckout = (): boolean => {
    const aba = getAbaCheckoutApi()
    return !!aba && typeof aba.checkout === 'function'
}

const ensureAbaScript = (): Promise<void> => {
    if (typeof window === 'undefined') return Promise.resolve()

    if (hasAbaCheckout()) {
        return Promise.resolve()
    }

    if (abaScriptPromise) {
        return abaScriptPromise
    }

    abaScriptPromise = new Promise((resolve, reject) => {
        const existingScript = document.querySelector(`script[src="${ABA_SCRIPT_URL}"]`) as HTMLScriptElement | null
        if (existingScript) {
            if (hasAbaCheckout()) {
                resolve()
                return
            }

            const onLoaded = () => resolve()
            existingScript.addEventListener('load', onLoaded, { once: true })
            existingScript.addEventListener('error', () => reject(new Error('Failed to load ABA checkout script.')), { once: true })

            setTimeout(() => {
                resolve()
            }, 1200)
            return
        }

        const script = document.createElement('script')
        script.src = ABA_SCRIPT_URL
        script.async = true
        script.onload = () => {
            script.dataset.loaded = 'true'
            resolve()
        }
        script.onerror = () => reject(new Error('Failed to load ABA checkout script.'))
        document.head.appendChild(script)
    })

    return abaScriptPromise
}

const waitForAbaCheckout = async (timeoutMs = 5000): Promise<AbaCheckoutApi | null> => {
    const startedAt = Date.now()

    while (Date.now() - startedAt < timeoutMs) {
        const aba = getAbaCheckoutApi()
        if (aba && typeof aba.checkout === 'function') {
            return aba
        }

        await new Promise((resolve) => setTimeout(resolve, 120))
    }

    return null
}

const submitEmbeddedPaymentForm = (): boolean => {
    if (typeof document === 'undefined') return false
    const host = document.createElement('div')
    host.innerHTML = paymentFormPost.value
    const form = host.querySelector('form') as HTMLFormElement | null

    if (!form) return false

    form.style.display = 'none'
    document.body.appendChild(form)
    form.submit()
    return true
}

const extractRequestedAmount = (requestHtml: string): number | null => {
    if (!requestHtml) return null

    const amountMatch = requestHtml.match(/name=["']amount["'][^>]*value=["']([^"']+)["']/i)
    if (!amountMatch?.[1]) return null

    const parsed = Number(amountMatch[1])
    return Number.isFinite(parsed) ? parsed : null
}

const resolvePayableAmount = (): number => {
    const value = Number(totalAmount.value)
    if (!Number.isFinite(value)) return 0
    return Number(value.toFixed(2))
}

const resolveTransactionId = (): string => {
    return (
        getQueryValue(route.query.orderId as string | string[] | undefined) ||
        getQueryValue(route.query.transactionId as string | string[] | undefined) ||
        getQueryValue(route.query.transaction_id as string | string[] | undefined) ||
        getQueryValue(route.query.bookingCode as string | string[] | undefined) ||
        getQueryValue(route.query.bookingId as string | string[] | undefined) ||
        getQueryValue(route.query.booking_code as string | string[] | undefined) ||
        getQueryValue(route.query.order_id as string | string[] | undefined) ||
        getStoredValue('lastOrderId')
    )
}

const cancelBooking = async (): Promise<void> => {
    const confirmed = window.confirm('Do you want to cancel booking?')
    if (!confirmed) return

    paymentStore.clearPaymentError()
    const transactionId = resolveTransactionId()

    if (!transactionId || transactionId === '-') {
        await navigateTo('/')
        return
    }

    await paymentStore.cancelBooking(transactionId)
    await navigateTo('/')
}

const processPayment = async (): Promise<void> => {
    if (isProcessing.value) return

    paymentError.value = ''

    const payableAmount = resolvePayableAmount()
    const transactionCode = resolveTransactionId()
    const method = selectedPaymentMethod.value

    if (!method) {
        paymentError.value = 'Please select a payment method.'
        return
    }

    if (payableAmount <= 0) {
        paymentError.value = 'Total amount must be greater than 0.'
        return
    }

    if (!transactionCode || transactionCode === '-') {
        paymentError.value = 'Missing transaction ID.'
        return
    }

    try {
        const request = await paymentStore.processPayment({
            code: transactionCode,
            paymentMethodId: method.paymentMethodId
        })
        console.log('Process payment request result:', request)

        if (!request) {
            return
        }

        const requestedAmount = extractRequestedAmount(request)
        if (requestedAmount !== null && requestedAmount <= 0) {
            paymentError.value = 'Unable to process zero-amount payment. Please re-check your booking total.'
            return
        }

        if (method.paymentMethodId === 4) {
            window.location.href = request
            return
        }

        paymentFormPost.value = request
        await nextTick()

        let abaCheckoutApi: AbaCheckoutApi | null = null
        try {
            await ensureAbaScript()
            abaCheckoutApi = await waitForAbaCheckout()
        } catch (scriptError) {
            console.warn('ABA script initialization failed, trying form-submit fallback.', scriptError)
        }

        if (abaCheckoutApi) {
            abaCheckoutApi.checkout()
            return
        }

        const submitted = submitEmbeddedPaymentForm()
        if (submitted) {
            return
        }

        console.error('Unable to initialize ABA checkout and fallback form submit was not available.', {
            hasAbaPaywayWindow: !!(window as Window & { AbaPayway?: unknown }).AbaPayway,
            hasAbaPaywayResolved: !!getAbaCheckoutApi(),
            scriptUrl: ABA_SCRIPT_URL
        })
        paymentError.value = 'Unable to initialize ABA checkout.'
        return
    } catch (error) {
        console.error('Process payment error:', error)
        paymentError.value = 'Unable to process payment right now. Please try again.'
    }
}
</script>
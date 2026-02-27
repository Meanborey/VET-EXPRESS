import { defineStore } from 'pinia'

type ApiEnvelope<T> = {
    header?: {
        result?: boolean
        statusCode?: number
        message?: string
    }
    body?: T
    data?: T
}

type ProcessPaymentBody = {
    status?: number
    request?: string
}

export const usePaymentStore = defineStore('payment', {
    state: () => ({
        isProcessing: false,
        isResending: false,
        isLoadingTransaction: false,
        paymentError: '',
        resendError: '',
        resendMessage: '',
        transactionDetails: null as Record<string, unknown> | null
    }),

    actions: {
        clearPaymentError() {
            this.paymentError = ''
        },

        clearResendState() {
            this.resendError = ''
            this.resendMessage = ''
        },

        async cancelBooking(transactionId: string): Promise<boolean> {
            if (!transactionId || transactionId === '-') return false

            this.paymentError = ''

            try {
                const api = useApi()
                const response = await api.post('/booking/cancel', { transactionId })
                console.log('Cancel booking response:', response)
                return !!response
            } catch (error) {
                console.error('Cancel booking error:', error)
                this.paymentError = 'Unable to cancel booking right now. Please try again.'
                return false
            }
        },

        async processPayment(payload: { code: string; paymentMethodId: number }): Promise<string | null> {
            if (!payload.code || !payload.paymentMethodId) {
                this.paymentError = 'Missing transaction ID or payment method.'
                return null
            }

            this.isProcessing = true
            this.paymentError = ''

            try {
                const api = useApi()
                const response = await api.post<ApiEnvelope<ProcessPaymentBody>>('/booking/processPayment', {
                    code: payload.code,
                    paymentMethodId: payload.paymentMethodId
                })
                console.log('Process payment response:', response)

                const envelope = response?.data
                const isSuccess = envelope?.header?.result === true && envelope?.header?.statusCode === 200
                const body = envelope?.body
                console.log('Process payment response envelope:', envelope)
                console.log('Process payment response body:', body)
                console.log('Is payment successful:', isSuccess)


                if (!isSuccess || !body || body.status !== 1 || !body.request) {
                    this.paymentError = 'Sorry, the payment process failed. Please try again.'
                    return null
                }

                return body.request
            } catch (error) {
                console.error('Process payment error:', error)
                this.paymentError = 'Unable to process payment right now. Please try again.'
                return null
            } finally {
                this.isProcessing = false
            }
        },

        async fetchTransactionDetails(transactionId: string): Promise<Record<string, unknown> | null> {
            if (!transactionId) {
                this.transactionDetails = null
                return null
            }

            this.isLoadingTransaction = true
            this.transactionDetails = null

            try {
                const api = useApi()
                const endpoints = [
                    '/booking/checkTransaction'
                ]

                for (const endpoint of endpoints) {
                    const response = await api.post<ApiEnvelope<Record<string, unknown>>>(endpoint, {
                        transactionId
                    })

                    const payload = response?.data
                    console.log(`Response from ${endpoint}:`, payload)
                    const body = payload?.body ?? payload?.data ?? payload
                    console.log(`Extracted body from ${endpoint}:`, body)

                    if (body && typeof body === 'object') {
                        this.transactionDetails = body as Record<string, unknown>
                        return this.transactionDetails
                    }
                }

                return null
            } catch (error) {
                console.error('Fetch transaction details error:', error)
                return null
            } finally {
                this.isLoadingTransaction = false
            }
        },

        async resendTicketEmail(transactionId: string): Promise<boolean> {
            this.clearResendState()

            if (!transactionId) {
                this.resendError = 'Transaction ID is missing.'
                return false
            }

            this.isResending = true

            try {
                const api = useApi()
                const response = await api.post('/booking/ticketSendEmail', { transactionId })

                if (!response) {
                    this.resendError = 'Unable to resend email right now. Please contact support.'
                    return false
                }

                this.resendMessage = 'E-ticket email has been resent successfully.'
                return true
            } catch (error) {
                console.error('Resend email error:', error)
                this.resendError = 'Unable to resend email right now. Please contact support.'
                return false
            } finally {
                this.isResending = false
            }
        }
    }
})

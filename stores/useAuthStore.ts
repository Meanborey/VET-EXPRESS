import { defineStore } from 'pinia'
import { FetchError } from 'ofetch'

import type {
  AuthUser,
  ForgotPasswordRequestPayload,
  ForgotPasswordResponse,
  ForgotPasswordResult,
  LoginApiResponse,
  LoginRequestPayload,
  LogoutApiResponse,
  LogoutResult,
  RegisterApiResponse,
  RegisterRequestPayload,
  ResetPasswordRequestPayload,
  ResetPasswordResponse,
  ResetPasswordResult,
  VerifyOtpRequestPayload,
  VerifyOtpResponse,
  VerifyOtpResult,
} from '~/types/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '' as string,
    user: null as AuthUser | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async resetPassword(payload: ResetPasswordRequestPayload): Promise<ResetPasswordResult> {
      this.loading = true
      this.error = null

      try {
        const runtimeConfig = useRuntimeConfig()
        const baseUrl = String(runtimeConfig.public.apiBaseUrl || '').trim().replace(/\/$/, '')
        const apiToken = String(runtimeConfig.public.apiToken || '').trim()

        if (!baseUrl) {
          throw new Error('Missing API base URL. Set NUXT_PUBLIC_API_BASE_URL in your environment.')
        }

        const newPassword = String(payload.newPassword || '')
        if (!newPassword.trim()) {
          throw new Error('Please enter new password.')
        }

        const tokenUser = process.client ? String(localStorage.getItem('tokenUser') || '').trim() : ''
        if (!tokenUser) {
          throw new Error('Reset token is missing. Please request forgot password again.')
        }

        const requestHeaders: Record<string, string> = {}
        if (apiToken) {
          requestHeaders.Authorization = `Bearer ${apiToken}`
        }

        const formData = new FormData()
        formData.append('newPassword', newPassword)
        formData.append('token', tokenUser)

        const response = await $fetch<ResetPasswordResponse>(`${baseUrl}/user-register/new-password`, {
          method: 'POST',
          headers: {
            ...requestHeaders,
          },
          body: formData,
        })

        const headerResult = response?.header?.result
        const headerStatusCode = response?.header?.statusCode
        const headerMessage = response?.header?.message || ''
        const bodyPayload = response?.body && typeof response.body === 'object' ? response.body : null
        const dataPayload = response?.data && typeof response.data === 'object' ? response.data : null
        const bodyStatus = typeof bodyPayload?.status === 'boolean' ? bodyPayload.status : undefined
        const dataStatus = typeof dataPayload?.status === 'boolean' ? dataPayload.status : undefined
        const bodyMessage = typeof bodyPayload?.message === 'string' ? bodyPayload.message : ''
        const dataMessage = typeof dataPayload?.message === 'string' ? dataPayload.message : ''

        const hasFailureSignal =
          headerResult === false ||
          bodyStatus === false ||
          dataStatus === false ||
          (typeof headerStatusCode === 'number' && headerStatusCode >= 400)

        const hasSuccessSignal =
          bodyStatus === true ||
          dataStatus === true ||
          (headerResult === true && (headerStatusCode === 200 || headerStatusCode === undefined))

        if (hasFailureSignal || !hasSuccessSignal) {
          throw new Error(headerMessage || bodyMessage || dataMessage || response?.message || 'Reset password failed')
        }

        if (process.client) {
          localStorage.removeItem('tokenUser')
          localStorage.removeItem('handleRemamberPage')
        }

        return {
          success: true,
          message: headerMessage || bodyMessage || dataMessage || response?.message || 'Password reset successful.',
          redirectTo: '/auth/login',
        }
      } catch (err: unknown) {
        if (err instanceof FetchError) {
          const errorData = (err.data ?? {}) as Record<string, unknown>
          this.error = String(errorData.message || errorData.error || err.message || 'Reset password failed')
        } else {
          this.error = err instanceof Error ? err.message : 'Reset password failed'
        }

        return {
          success: false,
          message: this.error || 'Reset password failed',
        }
      } finally {
        this.loading = false
      }
    },

    async forgotPassword(payload: ForgotPasswordRequestPayload): Promise<ForgotPasswordResult> {
      this.loading = true
      this.error = null

      try {
        const runtimeConfig = useRuntimeConfig()
        const baseUrl = String(runtimeConfig.public.apiBaseUrl || '').trim().replace(/\/$/, '')
        const apiToken = String(runtimeConfig.public.apiToken || '').trim()

        if (!baseUrl) {
          throw new Error('Missing API base URL. Set NUXT_PUBLIC_API_BASE_URL in your environment.')
        }

        const username = String(payload.username || '').trim()
        if (!username) {
          throw new Error('Please enter email address or phone number.')
        }

        if (process.client) {
          localStorage.removeItem('tokenUser')
        }

        const requestHeaders: Record<string, string> = {}
        if (apiToken) {
          requestHeaders.Authorization = `Bearer ${apiToken}`
        }

        const formData = new FormData()
        formData.append('username', username)

        const response = await $fetch<ForgotPasswordResponse>(`${baseUrl}/user-register/forgot-password`, {
          method: 'POST',
          headers: {
            ...requestHeaders,
          },
          body: formData,
        })

        const headerResult = response?.header?.result
        const headerStatusCode = response?.header?.statusCode
        const headerMessage = response?.header?.message || ''
        const bodyPayload = response?.body && typeof response.body === 'object' ? response.body : null
        const dataPayload = response?.data && typeof response.data === 'object' ? response.data : null
        const bodyStatus = typeof bodyPayload?.status === 'boolean' ? bodyPayload.status : undefined
        const dataStatus = typeof dataPayload?.status === 'boolean' ? dataPayload.status : undefined
        const bodyMessage = typeof bodyPayload?.message === 'string' ? bodyPayload.message : ''
        const dataMessage = typeof dataPayload?.message === 'string' ? dataPayload.message : ''

        const hasFailureSignal =
          headerResult === false ||
          bodyStatus === false ||
          dataStatus === false ||
          (typeof headerStatusCode === 'number' && headerStatusCode >= 400)

        const hasSuccessSignal =
          bodyStatus === true ||
          dataStatus === true ||
          (headerResult === true && (headerStatusCode === 200 || headerStatusCode === undefined))

        const isSuccess = !hasFailureSignal && hasSuccessSignal

        const temporaryToken = String(
          bodyPayload?.token ||
          dataPayload?.token ||
          bodyPayload?.temporaryToken ||
          dataPayload?.temporaryToken ||
          bodyMessage ||
          dataMessage
        ).trim()

        if (!isSuccess) {
          throw new Error(headerMessage || bodyMessage || dataMessage || response?.message || 'Forgot password failed')
        }

        if (!temporaryToken) {
          throw new Error('Forgot password succeeded but OTP token is missing. Please try again.')
        }

        if (process.client) {
          localStorage.setItem('tokenUser', temporaryToken)
          localStorage.setItem('handleRemamberPage', '2')
        }

        return {
          success: true,
          message: headerMessage || bodyMessage || dataMessage || response?.message || 'OTP has been sent.',
        }
      } catch (err: unknown) {
        if (err instanceof FetchError) {
          const errorData = (err.data ?? {}) as Record<string, unknown>
          this.error = String(errorData.message || errorData.error || err.message || 'Forgot password failed')
        } else {
          this.error = err instanceof Error ? err.message : 'Forgot password failed'
        }

        return {
          success: false,
          message: this.error || 'Forgot password failed',
        }
      } finally {
        this.loading = false
      }
    },

    async register(payload: RegisterRequestPayload) {
      this.loading = true
      this.error = null

      try {
        const runtimeConfig = useRuntimeConfig()
        const baseUrl = String(runtimeConfig.public.apiBaseUrl || '').trim().replace(/\/$/, '')
        const apiToken = String(runtimeConfig.public.apiToken || '').trim()

        if (!baseUrl) {
          throw new Error('Missing API base URL. Set NUXT_PUBLIC_API_BASE_URL in your environment.')
        }

        const requestHeaders: Record<string, string> = {}
        if (apiToken) {
          requestHeaders.Authorization = `Bearer ${apiToken}`
        }

        const normalizedEmail = String(payload.email || '').trim().toLowerCase()
        if (!normalizedEmail) {
          throw new Error('Please enter a valid email address.')
        }

        // Clear stale register token before a new register attempt.
        if (process.client) {
          localStorage.removeItem('tokenUser')
        }

        const formData = new FormData()
        formData.append('firstName', payload.firstName)
        formData.append('nationalityId', String(payload.nationalityId))
        formData.append('gender', String(payload.gender))
        formData.append('email', normalizedEmail)
        formData.append('password', payload.password)
        if (payload.telephone) {
          formData.append('telephone', payload.telephone)
        }

        const response = await $fetch<RegisterApiResponse>(`${baseUrl}/user-register/register`, {
          method: 'POST',
          headers: {
            ...requestHeaders,
          },
          body: formData,
        })

        const headerResult = response?.header?.result
        const headerStatusCode = response?.header?.statusCode
        const headerMessage = response?.header?.message || ''
        const bodyPayload = response?.body && typeof response.body === 'object' ? response.body : null
        const dataPayload = response?.data && typeof response.data === 'object' ? response.data : null
        const bodyStatus = typeof bodyPayload?.status === 'boolean' ? bodyPayload.status : undefined
        const dataStatus = typeof dataPayload?.status === 'boolean' ? dataPayload.status : undefined
        const bodyMessage = typeof bodyPayload?.message === 'string' ? bodyPayload.message : ''
        const dataMessage = typeof dataPayload?.message === 'string' ? dataPayload.message : ''

        const hasFailureSignal =
          headerResult === false ||
          bodyStatus === false ||
          dataStatus === false ||
          (typeof headerStatusCode === 'number' && headerStatusCode >= 400)

        const hasSuccessSignal =
          bodyStatus === true ||
          dataStatus === true ||
          (headerResult === true && (headerStatusCode === 200 || headerStatusCode === undefined))

        const isSuccess = !hasFailureSignal && hasSuccessSignal

        const temporaryToken = String(
          bodyPayload?.token ||
          dataPayload?.token ||
          bodyPayload?.temporaryToken ||
          dataPayload?.temporaryToken ||
          (typeof bodyMessage === 'string' ? bodyMessage : '') ||
          (typeof dataMessage === 'string' ? dataMessage : '')
        ).trim()

        if (!isSuccess) {
          throw new Error(
            headerMessage ||
            bodyMessage ||
            dataMessage ||
            response?.message ||
            'Register failed'
          )
        }

        if (!temporaryToken) {
          throw new Error('Register succeeded but OTP token is missing. Please try again.')
        }

        if (process.client && temporaryToken) {
          localStorage.setItem('tokenUser', temporaryToken)
        }

        return response
      } catch (err: unknown) {
        if (err instanceof FetchError) {
          const errorData = (err.data ?? {}) as Record<string, unknown>
          this.error =
            String(errorData.message || errorData.error || err.message || 'Register failed')
        } else {
          this.error = err instanceof Error ? err.message : 'Register failed'
        }
        throw err
      } finally {
        this.loading = false
      }
    },

    async verifyOtp(payload: VerifyOtpRequestPayload): Promise<VerifyOtpResult> {
      this.loading = true
      this.error = null

      try {
        const runtimeConfig = useRuntimeConfig()
        const baseUrl = String(runtimeConfig.public.apiBaseUrl || '').trim().replace(/\/$/, '')
        const apiToken = String(runtimeConfig.public.apiToken || '').trim()

        if (!baseUrl) {
          throw new Error('Missing API base URL. Set NUXT_PUBLIC_API_BASE_URL in your environment.')
        }

        const normalizedOtp = String(payload.code || '').replace(/\D/g, '')
        if (!normalizedOtp) {
          throw new Error('Please enter OTP code.')
        }

        const tokenUser = process.client ? String(localStorage.getItem('tokenUser') || '').trim() : ''
        if (!tokenUser) {
          throw new Error('OTP token is missing. Please register again.')
        }

        const endpoint = payload.remamberPage === 1
          ? '/user-register/verification'
          : '/user-register/reset-password'

        const requestHeaders: Record<string, string> = {}
        if (apiToken) {
          requestHeaders.Authorization = `Bearer ${apiToken}`
        }

        const formData = new FormData()
        formData.append('code', normalizedOtp)
        formData.append('token', tokenUser)

        const response = await $fetch<VerifyOtpResponse>(`${baseUrl}${endpoint}`, {
          method: 'POST',
          headers: {
            ...requestHeaders,
          },
          body: formData,
        })

        const headerResult = response?.header?.result === true
        const headerStatusCode = response?.header?.statusCode
        const bodyPayload = response?.body && typeof response.body === 'object' ? response.body : null
        const dataPayload = response?.data && typeof response.data === 'object' ? response.data : null
        const bodyStatus = typeof bodyPayload?.status === 'boolean' ? bodyPayload.status : undefined
        const dataStatus = typeof dataPayload?.status === 'boolean' ? dataPayload.status : undefined
        const bodyMessage = typeof bodyPayload?.message === 'string' ? bodyPayload.message : ''
        const dataMessage = typeof dataPayload?.message === 'string' ? dataPayload.message : ''
        const verifiedToken = String(
          (bodyPayload && typeof bodyPayload === 'object' ? (bodyPayload as Record<string, unknown>).token : '') ||
          (bodyPayload && typeof bodyPayload === 'object' ? (bodyPayload as Record<string, unknown>).accessToken : '') ||
          (dataPayload && typeof dataPayload === 'object' ? (dataPayload as Record<string, unknown>).token : '') ||
          (dataPayload && typeof dataPayload === 'object' ? (dataPayload as Record<string, unknown>).accessToken : '') ||
          (response as Record<string, unknown>)?.token ||
          (response as Record<string, unknown>)?.accessToken ||
          (bodyStatus === true ? bodyMessage : '') ||
          (dataStatus === true ? dataMessage : '') ||
          ''
        ).trim()

        const successMessage = bodyMessage || dataMessage || response?.header?.message || response?.message || 'OTP verified.'

        const isSuccess =
          headerResult === true &&
          (headerStatusCode === 200 || headerStatusCode === undefined) &&
          (bodyStatus === true || dataStatus === true)

        if (!isSuccess) {
          const failureMessage =
            bodyMessage ||
            dataMessage ||
            response?.header?.message ||
            response?.message ||
            'Invalid OTP code.'

          throw new Error(failureMessage)
        }

        if (process.client) {
          localStorage.removeItem('handleRemamberPage')
        }

        if (payload.remamberPage === 1) {
          if (!verifiedToken) {
            throw new Error('OTP verified but session token is missing. Please try login again.')
          }

          this.token = verifiedToken

          if (process.client) {
            localStorage.setItem('token', verifiedToken)
            localStorage.removeItem('tokenUser')
            const redirectUrl = localStorage.getItem('redirect_after_login') || '/'
            localStorage.removeItem('redirect_after_login')
            return {
              success: true,
              message: successMessage,
              redirectTo: `${redirectUrl}?loginSuccess=1`,
            }
          }

          return {
            success: true,
            message: successMessage,
            redirectTo: '/?loginSuccess=1',
          }
        }

        if (process.client && successMessage) {
          localStorage.setItem('tokenUser', successMessage)
        }

        return {
          success: true,
          message: successMessage,
          redirectTo: '/auth/reset_password',
        }
      } catch (err: unknown) {
        if (err instanceof FetchError) {
          const errorData = (err.data ?? {}) as Record<string, unknown>
          this.error = String(errorData.message || errorData.error || err.message || 'OTP verification failed')
        } else {
          this.error = err instanceof Error ? err.message : 'OTP verification failed'
        }

        return {
          success: false,
          message: this.error || 'OTP verification failed',
        }
      } finally {
        this.loading = false
      }
    },

    async signIn(payload: LoginRequestPayload) {
      this.loading = true
      this.error = null

      try {
        const runtimeConfig = useRuntimeConfig()
        const baseUrl = String(runtimeConfig.public.apiBaseUrl || '').trim().replace(/\/$/, '')
        const apiToken = String(runtimeConfig.public.apiToken || '').trim()

        if (!baseUrl) {
          throw new Error('Missing API base URL. Set NUXT_PUBLIC_API_BASE_URL in your environment.')
        }

        const requestHeaders: Record<string, string> = {}
        if (apiToken) {
          requestHeaders.Authorization = `Bearer ${apiToken}`
        }

        const formData = new FormData()
        formData.append('username', payload.username)
        formData.append('password', payload.password)

        const response = await $fetch<LoginApiResponse>(`${baseUrl}/user-register/login`, {
          method: 'POST',
          headers: {
            ...requestHeaders,
            // Do not force multipart boundary manually
          },
          body: formData,
        })

        const bodyPayload = response?.body && typeof response.body === 'object' ? response.body : null
        const dataPayload = response?.data && typeof response.data === 'object' ? response.data : null
        const nestedBodyData = bodyPayload?.data && typeof bodyPayload.data === 'object'
          ? (bodyPayload.data as Record<string, unknown>)
          : null

        const bodyStatus = typeof bodyPayload?.status === 'boolean' ? bodyPayload.status : undefined
        const dataStatus = typeof dataPayload?.status === 'boolean' ? dataPayload.status : undefined
        const bodyMessage = typeof bodyPayload?.message === 'string' ? bodyPayload.message : ''
        const dataMessage = typeof dataPayload?.message === 'string' ? dataPayload.message : ''

        const token =
          bodyPayload?.token || bodyPayload?.accessToken ||
          nestedBodyData?.token as string || nestedBodyData?.accessToken as string ||
          dataPayload?.token || dataPayload?.accessToken || response?.token || response?.accessToken ||
          (bodyStatus === true ? bodyMessage : '') ||
          (dataStatus === true ? dataMessage : '') ||
          ''

        const user =
          bodyPayload?.user ?? dataPayload?.user ?? response?.user ?? null

        if (!token) {
          console.log('Login response without token:', response)
          throw new Error(
            (bodyStatus === false ? bodyMessage : '') ||
            (dataStatus === false ? dataMessage : '') ||
            response?.header?.message ||
            response?.message ||
            'Login failed'
          )
        }

        this.token = token

        if (process.client) {
          localStorage.setItem('token', token)
        }

        return response
      } catch (err: unknown) {
        if (err instanceof FetchError) {
          const errorData = (err.data ?? {}) as Record<string, unknown>
          this.error =
            String(errorData.message || errorData.error || err.message || 'Login failed')
        } else {
          this.error = err instanceof Error ? err.message : 'Login failed'
        }
        throw err
      } finally {
        this.loading = false
      }
    },

    restoreAuth() {
      if (!process.client) return
      const token = localStorage.getItem('token')
      this.token = token || ''
    },

    async logoutProfile(): Promise<LogoutResult> {
      this.loading = true
      this.error = null

      try {
        const runtimeConfig = useRuntimeConfig()
        const baseUrl = String(runtimeConfig.public.apiBaseUrl || '').trim().replace(/\/$/, '')
        const apiToken = String(runtimeConfig.public.apiToken || '').trim()
        const sessionToken = process.client ? String(localStorage.getItem('token') || '').trim() : ''

        if (!baseUrl) {
          throw new Error('Missing API base URL. Set NUXT_PUBLIC_API_BASE_URL in your environment.')
        }

        if (!sessionToken) {
          this.signOut()
          return {
            success: true,
            message: 'Logged out successfully.',
          }
        }

        const requestHeaders: Record<string, string> = {}
        if (apiToken) {
          requestHeaders.Authorization = `Bearer ${apiToken}`
        }

        const formData = new FormData()
        formData.append('session', sessionToken)

        const response = await $fetch<LogoutApiResponse>(`${baseUrl}/user-register/logout`, {
          method: 'POST',
          headers: {
            ...requestHeaders,
          },
          body: formData,
        })

        const headerResult = response?.header?.result
        const headerStatusCode = response?.header?.statusCode
        const headerMessage = response?.header?.message || ''
        const bodyPayload = response?.body && typeof response.body === 'object' ? response.body : null
        const dataPayload = response?.data && typeof response.data === 'object' ? response.data : null
        const bodyStatus = typeof bodyPayload?.status === 'boolean' ? bodyPayload.status : undefined
        const dataStatus = typeof dataPayload?.status === 'boolean' ? dataPayload.status : undefined
        const bodyMessage = typeof bodyPayload?.message === 'string' ? bodyPayload.message : ''
        const dataMessage = typeof dataPayload?.message === 'string' ? dataPayload.message : ''

        const hasFailureSignal =
          headerResult === false ||
          bodyStatus === false ||
          dataStatus === false ||
          (typeof headerStatusCode === 'number' && headerStatusCode >= 400)

        const hasSuccessSignal =
          bodyStatus === true ||
          dataStatus === true ||
          (headerResult === true && (headerStatusCode === 200 || headerStatusCode === undefined))

        if (hasFailureSignal || !hasSuccessSignal) {
          throw new Error(headerMessage || bodyMessage || dataMessage || response?.message || 'Logout failed')
        }

        this.signOut()

        return {
          success: true,
          message: headerMessage || bodyMessage || dataMessage || response?.message || 'Logged out successfully.',
        }
      } catch (err: unknown) {
        this.signOut()

        if (err instanceof FetchError) {
          const errorData = (err.data ?? {}) as Record<string, unknown>
          this.error = String(errorData.message || errorData.error || err.message || 'Logout failed')
        } else {
          this.error = err instanceof Error ? err.message : 'Logout failed'
        }

        return {
          success: false,
          message: this.error || 'Logout failed',
        }
      } finally {
        this.loading = false
      }
    },

    signOut() {
      this.token = ''
      this.error = null
      if (process.client) {
        localStorage.removeItem('token')
      }
    },
  },
})
import { defineStore } from 'pinia'
import { FetchError } from 'ofetch'

import type { AuthUser, LoginApiResponse, LoginRequestPayload } from '~/types/auth'

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
        this.user = user

        if (process.client) {
          localStorage.setItem('auth_token', token)
          localStorage.setItem('auth_user', JSON.stringify(user))
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
      const token = localStorage.getItem('auth_token') || ''
      const rawUser = localStorage.getItem('auth_user')
      this.token = token
      this.user = rawUser ? JSON.parse(rawUser) : null
    },

    signOut() {
      this.token = ''
      this.user = null
      this.error = null

      if (process.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }
    },
  },
})
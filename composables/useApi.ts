/**
 * Step 3: useApi() Composable
 * Provides reactive API calls with loading/error states
 * Uses runtimeConfig for base URL and token
 */

// Types
export interface ApiResponse<T = unknown> {
  data: T
  status: number
  success: boolean
  message?: string
}

export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string[]>
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  // Get config values
  const baseUrl = (config.public.apiBaseUrl as string).replace(/\/$/, '')
  const token = config.public.apiToken as string

  /**
   * Convert object to URL-encoded form data (application/x-www-form-urlencoded)
   */
  const toFormUrlEncoded = (data: Record<string, unknown>): string => {
    const params = new URLSearchParams()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          params.append(key, JSON.stringify(value))
        } else {
          params.append(key, String(value))
        }
      }
    })
    return params.toString()
  }

  /**
   * Build query string for GET requests
   */
  const buildQuery = (params?: Record<string, unknown>): string => {
    if (!params) return ''
    const query = toFormUrlEncoded(params)
    return query ? `?${query}` : ''
  }

  /**
   * Core request function - POST form-urlencoded + Bearer token
   */
  const request = async <T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
      body?: Record<string, unknown>
      params?: Record<string, unknown>
    } = {}
  ): Promise<ApiResponse<T> | null> => {
    const { method = 'GET', body, params } = options

    loading.value = true
    error.value = null

    const url = `${baseUrl}${endpoint}${buildQuery(params)}`

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }

    const fetchOptions: RequestInit = {
      method,
      headers
    }

    // Add body for POST/PUT/PATCH (form-urlencoded)
    if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
      fetchOptions.body = toFormUrlEncoded(body)
    }

    try {
      const response = await fetch(url, fetchOptions)
      const data = await response.json()

      if (!response.ok) {
        throw {
          status: response.status,
          message: data?.message || `HTTP Error: ${response.status}`,
          errors: data?.errors
        } as ApiError
      }

      return {
        data: data as T,
        status: response.status,
        success: true,
        message: data?.message
      }
    } catch (err) {
      const apiError = err as ApiError
      error.value = apiError.status 
        ? apiError 
        : { status: 0, message: (err as Error).message || 'Network error' }
      
      console.error('API Error:', error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  // HTTP method shortcuts
  const get = <T>(endpoint: string, params?: Record<string, unknown>) => 
    request<T>(endpoint, { method: 'GET', params })

  const post = <T>(endpoint: string, body?: Record<string, unknown>) => 
    request<T>(endpoint, { method: 'POST', body })

  const put = <T>(endpoint: string, body?: Record<string, unknown>) => 
    request<T>(endpoint, { method: 'PUT', body })

  const patch = <T>(endpoint: string, body?: Record<string, unknown>) => 
    request<T>(endpoint, { method: 'PATCH', body })

  const del = <T>(endpoint: string) => 
    request<T>(endpoint, { method: 'DELETE' })

  const clearError = () => { error.value = null }

  return {
    // Reactive state (UI reactive)
    loading: readonly(loading),
    error: readonly(error),
    
    // Methods
    get,
    post,
    put,
    patch,
    del,
    request,
    clearError
  }
}

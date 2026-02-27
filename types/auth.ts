export interface LoginRequestPayload {
  username: string
  password: string
}

export interface AuthUser {
  id?: number | string
  name?: string
  email?: string
  phone?: string
  [key: string]: unknown
}

export interface LoginApiResponse {
  header?: {
    result?: boolean
    statusCode?: number
    message?: string
  }
  body?: {
    status?: boolean
    message?: string
    token?: string
    accessToken?: string
    user?: AuthUser
    [key: string]: unknown
  } | 0
  data?: {
    status?: boolean
    message?: string
    token?: string
    accessToken?: string
    user?: AuthUser
    [key: string]: unknown
  }
  token?: string
  accessToken?: string
  user?: AuthUser
  message?: string
}
export interface LoginRequestPayload {
  username: string
  password: string
}

export interface RegisterRequestPayload {
  firstName: string
  nationalityId: number
  gender: number
  email: string
  password: string
  telephone?: string
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

export interface RegisterApiResponse {
  header?: {
    result?: boolean
    statusCode?: number
    message?: string
  }
  body?: {
    status?: boolean
    message?: string
    [key: string]: unknown
  } | 0
  data?: {
    status?: boolean
    message?: string
    [key: string]: unknown
  }
  message?: string
  [key: string]: unknown
}

export interface VerifyOtpRequestPayload {
  code: string
  remamberPage: number
}

export interface ForgotPasswordRequestPayload {
  username: string
}

export interface ForgotPasswordResponse {
  header?: {
    result?: boolean
    statusCode?: number
    message?: string
  }
  body?: {
    status?: boolean
    message?: string
    token?: string
    temporaryToken?: string
    [key: string]: unknown
  } | 0
  data?: {
    status?: boolean
    message?: string
    token?: string
    temporaryToken?: string
    [key: string]: unknown
  }
  message?: string
  [key: string]: unknown
}

export interface ForgotPasswordResult {
  success: boolean
  message: string
}

export interface ResetPasswordRequestPayload {
  newPassword: string
}

export interface ResetPasswordResponse {
  header?: {
    result?: boolean
    statusCode?: number
    message?: string
  }
  body?: {
    status?: boolean
    message?: string
    [key: string]: unknown
  } | 0
  data?: {
    status?: boolean
    message?: string
    [key: string]: unknown
  }
  message?: string
  [key: string]: unknown
}

export interface ResetPasswordResult {
  success: boolean
  message: string
  redirectTo?: string
}

export interface VerifyOtpResponse {
  header?: {
    result?: boolean
    statusCode?: number
    message?: string
  }
  body?: {
    status?: boolean
    message?: string
    [key: string]: unknown
  } | 0
  data?: {
    status?: boolean
    message?: string
    [key: string]: unknown
  }
  message?: string
  [key: string]: unknown
}

export interface VerifyOtpResult {
  success: boolean
  message: string
  redirectTo?: string
}

export interface LogoutApiResponse {
  header?: {
    result?: boolean
    statusCode?: number
    message?: string
  }
  body?: {
    status?: boolean
    message?: string
    [key: string]: unknown
  } | 0
  data?: {
    status?: boolean
    message?: string
    [key: string]: unknown
  }
  message?: string
  [key: string]: unknown
}

export interface LogoutResult {
  success: boolean
  message: string
}
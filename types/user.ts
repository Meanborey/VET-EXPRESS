export interface UserProfile {
  id: number | string
  name?: string
  username?: string
  email?: string
  dob?: string
  telephone?: string
  filename?: string
  nationality?: string
  address?: string
  gender?: number | string
  nationalityId?: number | string
  [key: string]: unknown
}

export interface UserProfilePayload {
  status?: boolean
  message?: string
  data?: UserProfile
  [key: string]: unknown
}

export interface UserMeResponse {
  header?: {
    serverTimestamp?: number
    result?: boolean
    statusCode?: number
    message?: string
  }
  body?: UserProfile | UserProfilePayload | 0
  data?: UserProfile | UserProfilePayload
  message?: string
}

export interface UpdateProfileRequestPayload {
  firstName?: string
  name?: string
  gender?: number | string
  telephone?: string
  email?: string
  dob?: string
  fileName?: string
  nationalityId?: number | string
  address?: string
}

export interface UserUpdateResponse {
  header?: {
    serverTimestamp?: number
    result?: boolean
    statusCode?: number
    message?: string
  }
  body?: UserProfile | UserProfilePayload | Record<string, unknown> | 0
  data?: UserProfile | UserProfilePayload | Record<string, unknown>
  message?: string
}

export interface UpdateProfileResult {
  success: boolean
  message: string
  profile: UserProfile | null
}

export interface UploadProfileImageResponse {
  header?: {
    serverTimestamp?: number
    result?: boolean
    statusCode?: number
    message?: string
  }
  body?: {
    img?: string
    image?: string
    fileName?: string
    filename?: string
    message?: string
    status?: boolean
    [key: string]: unknown
  } | Record<string, unknown>
  data?: {
    img?: string
    image?: string
    fileName?: string
    filename?: string
    message?: string
    status?: boolean
    [key: string]: unknown
  } | Record<string, unknown>
  img?: string
  image?: string
  fileName?: string
  filename?: string
  message?: string
}

export interface UploadProfileImageResult {
  success: boolean
  message: string
  fileName: string
  fullUrl: string
}

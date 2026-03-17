import { defineStore } from 'pinia'
import { FetchError } from 'ofetch'

import type {
	UploadProfileImageResponse,
	UploadProfileImageResult,
	UpdateProfileRequestPayload,
	UpdateProfileResult,
	UserMeResponse,
	UserProfile,
	UserProfilePayload,
	UserUpdateResponse,
} from '~/types/user'

const isUserProfile = (value: unknown): value is UserProfile => {
	return !!value && typeof value === 'object' && !Array.isArray(value)
}

const extractUserProfile = (response: UserMeResponse): UserProfile | null => {
	const body = response?.body
	const data = response?.data

	if (isUserProfile(body)) {
		const nested = (body as UserProfilePayload).data
		if (isUserProfile(nested)) return nested
		return body
	}

	if (isUserProfile(data)) {
		const nested = (data as UserProfilePayload).data
		if (isUserProfile(nested)) return nested
		return data
	}

	return null
}

const extractHeaderMessage = (response: UserMeResponse | UserUpdateResponse): string => {
	return String(response?.header?.message || response?.message || '').trim()
}

const extractNestedMessage = (payload: unknown): string => {
	if (!payload || typeof payload !== 'object') return ''
	const raw = (payload as Record<string, unknown>).message
	return typeof raw === 'string' ? raw.trim() : ''
}

const extractImageFileName = (response: UploadProfileImageResponse): string => {
	const getAnyKey = (value: unknown, keys: string[]): string => {
		if (!value || typeof value !== 'object') return ''
		const record = value as Record<string, unknown>

		for (const key of keys) {
			const direct = record[key]
			if (typeof direct === 'string' && direct.trim()) return direct.trim()
		}

		const lowerMap = Object.entries(record).reduce<Record<string, unknown>>((acc, [k, v]) => {
			acc[k.toLowerCase()] = v
			return acc
		}, {})

		for (const key of keys) {
			const fromLower = lowerMap[key.toLowerCase()]
			if (typeof fromLower === 'string' && fromLower.trim()) return fromLower.trim()
		}

		return ''
	}

	const normalizedResponse: unknown = (() => {
		if (typeof response !== 'string') return response
		try {
			return JSON.parse(response)
		} catch {
			return null
		}
	})()

	const rootName = getAnyKey(normalizedResponse, ['img', 'image', 'fileName', 'filename'])
	if (rootName) return rootName

	if (!normalizedResponse || typeof normalizedResponse !== 'object') return ''
	const root = normalizedResponse as Record<string, unknown>
	const bodyName = getAnyKey(root.body, ['img', 'image', 'fileName', 'filename'])
	if (bodyName) return bodyName

	return getAnyKey(root.data, ['img', 'image', 'fileName', 'filename'])
}

const normalizeImageFileName = (value: unknown): string => {
	const raw = String(value || '').trim()
	if (!raw) return ''

	// Recover malformed values like: public/user_photo/https://host/public/user_photo/a.jpg
	const nestedUrlMatch = raw.match(/https?:\/\/.+/i)
	const candidate = nestedUrlMatch ? nestedUrlMatch[0] : raw

	if (/^https?:\/\//i.test(candidate)) {
		try {
			const parsed = new URL(candidate)
			return parsed.pathname.replace(/^\/+/, '').trim()
		} catch {
			return candidate
		}
	}

	return candidate.replace(/^\/+/, '').trim()
}

const resolveImageUrl = (value: unknown, imageBaseUrl: string): string => {
	const raw = String(value || '').trim()
	if (!raw) return ''

	if (/^https?:\/\//i.test(raw)) {
		return raw
	}

	const normalizedPath = normalizeImageFileName(raw)
	if (!normalizedPath) return ''
	if (!imageBaseUrl) return normalizedPath

	return `${imageBaseUrl}/${normalizedPath}`
}

export const useUserStore = defineStore('user', {
	state: () => ({
		profile: null as UserProfile | null,
		loading: false,
		error: null as string | null,
	}),

	getters: {
		hasProfile: (state) => !!state.profile,
	},

	actions: {
		clearProfile() {
			this.profile = null
			this.error = null
		},

		async fetchProfile(sessionToken?: string): Promise<UserProfile | null> {
			this.loading = true
			this.error = null

			try {
				const runtimeConfig = useRuntimeConfig()
				const baseUrl = String(runtimeConfig.public.apiBaseUrl || '').trim().replace(/\/$/, '')
				const apiToken = String(runtimeConfig.public.apiToken || '').trim()

				if (!baseUrl) {
					throw new Error('Missing API base URL. Set NUXT_PUBLIC_API_BASE_URL in your environment.')
				}

				const token = String(sessionToken || '').trim()
				if (!token) {
					throw new Error('Missing session token to fetch user profile.')
				}

				const requestHeaders: Record<string, string> = {}
				if (apiToken) {
					requestHeaders.Authorization = `Bearer ${apiToken}`
				}

				const formData = new FormData()
				formData.append('session', token)

				const response = await $fetch<UserMeResponse>(`${baseUrl}/user-register/me`, {
					method: 'POST',
					headers: {
						...requestHeaders,
					},
					body: formData,
				})

				const profile = extractUserProfile(response)
				console.log('Fetched user profile:', profile)
				if (!profile) {
					throw new Error(response?.header?.message || response?.message || 'Failed to load user profile.')
				}

				this.profile = profile
				return profile
			} catch (err: unknown) {
				if (err instanceof FetchError) {
					const errorData = (err.data ?? {}) as Record<string, unknown>
					this.error = String(errorData.message || errorData.error || err.message || 'Failed to load user profile.')
				} else {
					this.error = err instanceof Error ? err.message : 'Failed to load user profile.'
				}

				return null
			} finally {
				this.loading = false
			}
		},

		async updateProfile(payload: UpdateProfileRequestPayload, sessionToken?: string): Promise<UpdateProfileResult> {
			this.loading = true
			this.error = null

			try {
				const runtimeConfig = useRuntimeConfig()
				const baseUrl = String(runtimeConfig.public.apiBaseUrl || '').trim().replace(/\/$/, '')
				const apiToken = String(runtimeConfig.public.apiToken || '').trim()

				if (!baseUrl) {
					throw new Error('Missing API base URL. Set NUXT_PUBLIC_API_BASE_URL in your environment.')
				}

				const token = String(sessionToken || '').trim()
				if (!token) {
					throw new Error('Missing session token to update user profile.')
				}

				const requestHeaders: Record<string, string> = {}
				if (apiToken) {
					requestHeaders.Authorization = `Bearer ${apiToken}`
				}

				const firstName = String(payload.firstName || payload.name || this.profile?.name || '').trim()
				const email = String(payload.email || this.profile?.email || this.profile?.username || '').trim()
				const dob = String(payload.dob || this.profile?.dob || '').trim()
				const rawFileName = String(payload.fileName || '').trim()
				const fileName = normalizeImageFileName(rawFileName)
				const imageBaseUrl = String(runtimeConfig.public.urlImg || '').trim().replace(/\/$/, '')
				const address = String(payload.address || this.profile?.address || '').trim()
				const normalizedPhone = String(payload.telephone || '').replace(/\D/g, '')
				const rawGender = payload.gender ?? this.profile?.gender
				const parsedGender = Number.parseInt(String(rawGender ?? '').trim(), 10)

				const payloadNationalityId = String(payload.nationalityId || '').trim()
				const profileNationalityId = String(this.profile?.nationalityId || '').trim()
				const selectedNationalityId = payloadNationalityId || profileNationalityId
				const parsedNationalityId = Number.parseInt(selectedNationalityId, 10)

				if (!firstName) {
					throw new Error('Missing first name for profile update.')
				}

				if (Number.isNaN(parsedGender)) {
					throw new Error('Missing gender for profile update.')
				}

				const formData = new FormData()
				formData.append('session', token)
				formData.append('firstName', firstName)
				formData.append('gender', String(parsedGender))
				formData.append('telephone', normalizedPhone)
				formData.append('email', email)
				formData.append('dob', dob)
				if (fileName) {
					formData.append('fileName', fileName)
				}
				if (selectedNationalityId && !Number.isNaN(parsedNationalityId)) {
					formData.append('nationalityId', String(parsedNationalityId))
				}
				formData.append('address', address)

				const response = await $fetch<UserUpdateResponse>(`${baseUrl}/user-register/update`, {
					method: 'POST',
					headers: {
						...requestHeaders,
					},
					body: formData,
				})

				const headerResult = response?.header?.result
				const statusCode = response?.header?.statusCode
				const headerMessage = extractHeaderMessage(response)
				const bodyMessage = extractNestedMessage(response?.body)
				const dataMessage = extractNestedMessage(response?.data)

				const hasFailureSignal =
					headerResult === false ||
					(typeof statusCode === 'number' && statusCode >= 400)

				if (hasFailureSignal) {
					throw new Error(headerMessage || bodyMessage || dataMessage || 'Failed to update user profile.')
				}

				const updatedFromApi = extractUserProfile(response as UserMeResponse)
				const resolvedProfileId = updatedFromApi?.id ?? this.profile?.id
				if (resolvedProfileId === undefined || resolvedProfileId === null || String(resolvedProfileId).trim() === '') {
					throw new Error('Profile update succeeded but profile id is missing.')
				}

				const normalizedFileNameForProfile = (() => {
					if (!fileName) return this.profile?.filename
					return resolveImageUrl(fileName, imageBaseUrl)
				})()

				const mergedProfile: UserProfile = {
					id: resolvedProfileId,
					...(this.profile || {}),
					...(updatedFromApi || {}),
					name: firstName,
					gender: parsedGender,
					email: email || this.profile?.email,
					username: email || this.profile?.username,
					telephone: normalizedPhone || this.profile?.telephone,
					dob: dob || this.profile?.dob,
					filename: normalizedFileNameForProfile,
					address: address || this.profile?.address,
					nationalityId: selectedNationalityId || this.profile?.nationalityId,
				}

				this.profile = mergedProfile

				return {
					success: true,
					message: headerMessage || bodyMessage || dataMessage || 'Profile updated successfully.',
					profile: this.profile,
				}
			} catch (err: unknown) {
				if (err instanceof FetchError) {
					const errorData = (err.data ?? {}) as Record<string, unknown>
					this.error = String(errorData.message || errorData.error || err.message || 'Failed to update user profile.')
				} else {
					this.error = err instanceof Error ? err.message : 'Failed to update user profile.'
				}

				return {
					success: false,
					message: this.error || 'Failed to update user profile.',
					profile: this.profile,
				}
			} finally {
				this.loading = false
			}
		},

		async uploadProfileImage(file: File): Promise<UploadProfileImageResult> {
			this.loading = true
			this.error = null

			try {
				if (!(file instanceof File)) {
					throw new Error('Please select a valid image file.')
				}

				const runtimeConfig = useRuntimeConfig()
				const uploadBaseUrl = String(runtimeConfig.public.upload || '').trim().replace(/\/$/, '')
				const uploadToken = String(runtimeConfig.public.token || '').trim()

				if (!uploadBaseUrl) {
					throw new Error('Missing upload base URL. Set NUXT_PUBLIC_URL_BASE_IMAGE_UPLOAD_USER in your environment.')
				}

				const formData = new FormData()
				formData.append('photo', file)
				if (uploadToken) {
					formData.append('token', uploadToken)
				}

				const uploadEndpoint = `${uploadBaseUrl}/uploadPhotoUserProfile`
				console.log('[uploadPhotoUserProfile][request]', {
					url: uploadEndpoint,
					method: 'POST',
					fileName: file.name,
					fileType: file.type,
					fileSize: file.size,
					hasToken: !!uploadToken,
				})

				const response = await $fetch<UploadProfileImageResponse>(uploadEndpoint, {
					method: 'POST',
					body: formData,
				})

				console.log('[uploadPhotoUserProfile][response]', response)

				const headerMessage = String(response?.header?.message || response?.message || '').trim()
				const bodyMessage = extractNestedMessage(response?.body)
				const dataMessage = extractNestedMessage(response?.data)
				const headerResult = response?.header?.result
				const statusCode = response?.header?.statusCode

				const hasFailureSignal =
					headerResult === false ||
					(typeof statusCode === 'number' && statusCode >= 400)

				if (hasFailureSignal) {
					throw new Error(headerMessage || bodyMessage || dataMessage || 'Failed to upload profile image.')
				}

				const uploadedImageValue = extractImageFileName(response)
				if (!uploadedImageValue) {
					throw new Error('Upload succeeded but image filename is missing.')
				}

				const imageBaseUrl = String(runtimeConfig.public.urlImg || '').trim().replace(/\/$/, '')
				const fileName = normalizeImageFileName(uploadedImageValue)
				if (!fileName) {
					throw new Error('Upload succeeded but image path is invalid.')
				}

				const fullUrl = resolveImageUrl(uploadedImageValue, imageBaseUrl)

				if (this.profile) {
					this.profile = {
						...this.profile,
						filename: fullUrl,
					}
				}

				return {
					success: true,
					message: headerMessage || bodyMessage || dataMessage || 'Profile image uploaded successfully.',
					fileName,
					fullUrl,
				}
			} catch (err: unknown) {
				console.error('[uploadPhotoUserProfile][error]', err)

				if (err instanceof FetchError) {
					const errorData = (err.data ?? {}) as Record<string, unknown>
					console.error('[uploadPhotoUserProfile][error-data]', errorData)
					this.error = String(errorData.message || errorData.error || err.message || 'Failed to upload profile image.')
				} else {
					this.error = err instanceof Error ? err.message : 'Failed to upload profile image.'
				}

				return {
					success: false,
					message: this.error || 'Failed to upload profile image.',
					fileName: '',
					fullUrl: '',
				}
			} finally {
				this.loading = false
			}
		},
	},
})

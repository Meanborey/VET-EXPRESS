<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { UserProfile } from '~/types/user'

interface PersonalInfoItem {
	label: string
	value: string
}

interface UpdateProfilePayload {
	name: string
	gender: string
	nationality: string
	nationalityId?: string
	telephone: string
	email: string
	fileName?: string
}

const authStore = useAuthStore()
const userStore = useUserStore()
const { profile, loading, error } = storeToRefs(userStore)

const isEditModalOpen = ref(false)
const isSavingUpdate = ref(false)

const profileName = computed(() => String(profile.value?.name || '-'))
const profileAvatar = computed(() => String(profile.value?.filename || '/images/default_avatar.png'))

const formatGender = (value: unknown): string => {
	if (value === 1 || value === '1') return 'Male'
	if (value === 2 || value === '2') return 'Female'
	const genderText = String(value || '').trim()
	return genderText || '-'
}

const hasDisplayValue = (value: unknown): boolean => String(value || '').trim().length > 0

const personalInfo = computed<PersonalInfoItem[]>(() => {
	const email = String(profile.value?.email || profile.value?.username || '').trim()
	const rawGender = profile.value?.gender
	const gender = formatGender(rawGender)

	const items: PersonalInfoItem[] = [
		{ label: 'Full name', value: String(profile.value?.name || '').trim() },
		{ label: 'Gender', value: gender },
		{ label: 'Nationality', value: String(profile.value?.nationality || '').trim() },
		{ label: 'Email address', value: email },
		{ label: 'Phone number', value: String(profile.value?.telephone || '').trim() },
	]

	return items.filter((item) => {
		if (item.label === 'Gender') {
			return rawGender !== null && rawGender !== undefined && hasDisplayValue(item.value) && item.value !== '-'
		}

		return hasDisplayValue(item.value)
	})
})

const openEditModal = () => {
	isEditModalOpen.value = true
}

const closeEditModal = () => {
	isEditModalOpen.value = false
}

const saveProfileUpdate = async (payload: UpdateProfilePayload) => {
	if (!profile.value) {
		return
	}

	isSavingUpdate.value = true
	try {
		const result = await userStore.updateProfile(
			{
				firstName: payload.name,
				gender: payload.gender,
				telephone: payload.telephone,
				email: payload.email,
				fileName: payload.fileName,
				nationalityId: payload.nationalityId,
			},
			authStore.token
		)

		if (result.success) {
			const updatedProfile: UserProfile = {
				...profile.value,
				...result.profile,
				name: payload.name,
				gender: payload.gender,
				nationality: payload.nationality,
				nationalityId: payload.nationalityId,
				telephone: payload.telephone,
				email: payload.email,
				username: payload.email,
			}

			profile.value = updatedProfile
			closeEditModal()
		}
	} finally {
		isSavingUpdate.value = false
	}
}

onMounted(async () => {
	authStore.restoreAuth()
	if (!userStore.hasProfile) {
		await userStore.fetchProfile(authStore.token)
	}
})
</script>

<template>
	<section class="bg-background-screen">
		<div class="container py-10 lg:py-14">
			<div class="max-w-4xl">
				<h2 class="text-3xl font-bold text-text-main">My Profile</h2>

				<p v-if="loading" class="mt-4 text-text-subtext">Loading profile...</p>
				<p v-else-if="error" class="mt-4 text-red-500">{{ error }}</p>

				<div class="mt-7 flex items-center gap-4">
					<img
						:src="profileAvatar"
						:alt="profileName"
						class="h-24 w-24 rounded-full border border-background-bord object-cover"
					>
					<h3 class="text-4xl font-semibold text-text-main">{{ profileName }}</h3>
				</div>

				<div class="mt-8 flex items-center justify-between gap-4">
					<h4 class="text-lg font-semibold text-text-main">Personal Information</h4>
					<button
						type="button"
						class="inline-flex items-center gap-2 text-lg font-medium text-text-subtext transition-colors hover:text-text-main"
						@click="openEditModal"
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="h-6 w-6" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.971 2.971L8.354 18.94a4.5 4.5 0 0 1-1.897 1.133l-2.534.724.724-2.534a4.5 4.5 0 0 1 1.133-1.897L16.862 4.487Z" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M15 7.5 18 10.5" />
						</svg>
						Edit
					</button>
				</div>

				<div class="mt-8 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-16">
					<div
						v-for="item in personalInfo"
						:key="item.label"
						class="space-y-1"
					>
						<p class="text-lg text-text-subtext">{{ item.label }}</p>
						<p class="text-xl text-text-main">{{ item.value }}</p>
					</div>
				</div>
			</div>

			<UserUpdate
				:is-open="isEditModalOpen"
				:profile="profile"
				:is-saving="isSavingUpdate"
				@close="closeEditModal"
				@save="saveProfileUpdate"
			/>
		</div>
	</section>
</template>

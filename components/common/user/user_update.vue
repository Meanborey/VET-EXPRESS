<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { UserProfile } from '~/types/user'

interface UpdateProfilePayload {
	name: string
	gender: string
	nationality: string
	nationalityId?: string
	telephone: string
	email: string
	fileName?: string
}

interface Props {
	isOpen: boolean
	profile: UserProfile | null
	isSaving?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	isSaving: false
})

const emit = defineEmits<{
	close: []
	save: [payload: UpdateProfilePayload]
}>()

const nationalityStore = useNationalityStore()
const userStore = useUserStore()
const { nationalities } = storeToRefs(nationalityStore)

const defaultAvatar = '/images/default_avatar.png'
const fileInputRef = ref<HTMLInputElement | null>(null)
const uploadedFileName = ref('')
const uploadedAvatarUrl = ref('')
const isUploading = ref(false)
const hasAvatarChanged = ref(false)
const form = ref({
	name: '',
	gender: '1',
	nationality: '',
	nationalityId: '',
	telephone: '',
	email: ''
})

const avatarSrc = computed(() => String(uploadedAvatarUrl.value || props.profile?.filename || defaultAvatar))

const normalizeFileNameForUpdate = (value: unknown): string => {
	const raw = String(value || '').trim()
	if (!raw) return ''

	if (/^https?:\/\//i.test(raw)) {
		try {
			const url = new URL(raw)
			return url.pathname.replace(/^\/+/, '').trim()
		} catch {
			return raw
		}
	}

	if (raw.startsWith('/')) {
		return raw.replace(/^\/+/, '').trim()
	}

	return raw
}

const normalizeGenderForForm = (value: unknown): string => {
	if (value === 1 || value === '1' || String(value || '').toLowerCase() === 'male') return '1'
	if (value === 2 || value === '2' || String(value || '').toLowerCase() === 'female') return '2'
	return '1'
}

const syncForm = () => {
	const selectedNationality = String(props.profile?.nationality || '').trim()
	const selectedNationalityId = String(props.profile?.nationalityId || '').trim()

	form.value = {
		name: String(props.profile?.name || '').trim(),
		gender: normalizeGenderForForm(props.profile?.gender),
		nationality: selectedNationality,
		nationalityId: selectedNationalityId,
		telephone: String(props.profile?.telephone || '').trim(),
		email: String(props.profile?.email || props.profile?.username || '').trim()
	}

	uploadedFileName.value = ''
	uploadedAvatarUrl.value = ''
	hasAvatarChanged.value = false
}

const openFileInput = () => {
	fileInputRef.value?.click()
}

const handleFileChange = async (event: Event) => {
	const target = event.target as HTMLInputElement | null
	const file = target?.files?.item(0) || null
	if (!file) return

	if (!file.type.startsWith('image/')) {
		userStore.error = 'Please select an image file.'
		hasAvatarChanged.value = false
		if (target) target.value = ''
		return
	}

	isUploading.value = true
	try {
		const result = await userStore.uploadProfileImage(file)
		if (result.success) {
			uploadedFileName.value = result.fileName
			uploadedAvatarUrl.value = result.fullUrl
			hasAvatarChanged.value = true
		}
	} finally {
		isUploading.value = false
		if (target) target.value = ''
	}
}

const handleSave = () => {
	const selectedFileName = normalizeFileNameForUpdate(uploadedFileName.value)
	const fileName = hasAvatarChanged.value ? selectedFileName : ''

	emit('save', {
		name: form.value.name.trim(),
		gender: form.value.gender,
		nationality: form.value.nationality.trim(),
		nationalityId: form.value.nationalityId || undefined,
		telephone: form.value.telephone.trim(),
		email: form.value.email.trim(),
		fileName: fileName || undefined
	})
}

const closeModal = () => {
	emit('close')
}

watch(
	() => props.isOpen,
	async (isOpen) => {
		if (!isOpen) return

		syncForm()
		if (!nationalityStore.nationalities.length && !nationalityStore.loading) {
			await nationalityStore.fetchNationalities()
		}
	}
)

watch(
	() => form.value.nationalityId,
	(value) => {
		const selected = nationalities.value.find((item) => item.id === value)
		if (selected) {
			form.value.nationality = selected.name
		}
	}
)

watch(
	() => props.profile,
	() => {
		if (props.isOpen) {
			syncForm()
		}
	}
)
</script>

<template>
	<Teleport to="body">
		<Transition name="modal-fade">
			<div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click="closeModal">
				<div class="absolute inset-0 bg-black/40" />

				<div class="relative z-10 w-full max-w-[560px] rounded-xl bg-white shadow-2xl" @click.stop>
					<div class="flex items-center justify-center border-b border-gray-200 px-6 py-4">
						<h3 class="text-[34px] font-semibold text-[#2f2f2f]">Edit Profile</h3>
						<button
							type="button"
							class="absolute right-6 top-4 text-4xl font-semibold leading-none text-[#272727]"
							@click="closeModal"
						>
							x
						</button>
					</div>

					<form class="px-9 pb-9 pt-8" @submit.prevent="handleSave">
						<div class="mb-6 flex justify-center">
							<div class="relative">
								<img
									:src="avatarSrc"
									alt="Profile avatar"
									class="h-32 w-32 rounded-full border border-[#99a2ad] object-cover"
								>
								<button
									type="button"
									@click="openFileInput"
									:disabled="isUploading"
									class="absolute bottom-2 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#eb6a0a] text-white"
									title="Change avatar"
								>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="h-4 w-4" stroke="currentColor" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.971 2.971L8.354 18.94a4.5 4.5 0 0 1-1.897 1.133l-2.534.724.724-2.534a4.5 4.5 0 0 1 1.133-1.897L16.862 4.487Z" />
										<path stroke-linecap="round" stroke-linejoin="round" d="M15 7.5 18 10.5" />
									</svg>
								</button>
								<input
									ref="fileInputRef"
									type="file"
									accept="image/*"
									class="hidden"
									@change="handleFileChange"
								>
							</div>
						</div>

						<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<input
								v-model="form.name"
								type="text"
								placeholder="Full name"
								class="h-[50px] w-full rounded-xl border border-[#cfd4db] px-4 text-xl text-[#3d3d3d] outline-none focus:border-[#eb6a0a]"
							>

							<select
								v-model="form.gender"
								class="h-[50px] w-full rounded-xl border border-[#cfd4db] px-4 text-xl text-[#3d3d3d] outline-none focus:border-[#eb6a0a]"
							>
								<option value="1">Male</option>
								<option value="2">Female</option>
							</select>

							<select
								v-model="form.nationalityId"
								class="h-[50px] w-full rounded-xl border border-[#cfd4db] px-4 text-xl text-[#3d3d3d] outline-none focus:border-[#eb6a0a]"
							>
								<option value="">{{ form.nationality || 'Select nationality' }}</option>
								<option
									v-for="item in nationalities"
									:key="item.id"
									:value="item.id"
								>
									{{ item.name }}
								</option>
							</select>

							<input
								v-model="form.telephone"
								type="text"
								placeholder="Phone number"
								class="h-[50px] w-full rounded-xl border border-[#cfd4db] px-4 text-xl text-[#3d3d3d] outline-none focus:border-[#eb6a0a]"
							>

							<input
								v-model="form.email"
								type="email"
								placeholder="Email"
								class="h-[50px] w-full rounded-xl border border-[#cfd4db] px-4 text-xl text-[#3d3d3d] outline-none focus:border-[#eb6a0a] sm:col-span-2"
							>
						</div>

						<button
							type="submit"
							:disabled="isSaving"
							class="mt-12 h-[52px] w-full rounded-xl bg-[#eb6402] text-2xl font-semibold text-white transition hover:bg-[#d65800] disabled:cursor-not-allowed disabled:opacity-70"
						>
							{{ isSaving ? 'Saving...' : 'Save' }}
						</button>
					</form>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
	transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
	opacity: 0;
}
</style>

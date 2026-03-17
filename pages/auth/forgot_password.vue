<script setup lang="ts">
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { loading, error } = storeToRefs(authStore)
const emailOrPhone = ref('')

const onSubmit = async () => {
	const username = String(emailOrPhone.value || '').trim()
	if (!username) {
		authStore.error = 'Please enter email address or phone number.'
		return
	}

	const result = await authStore.forgotPassword({ username })
	if (!result.success) return

	await navigateTo({
		path: '/auth/OTP',
		query: {
			email: username,
			handleRemamberPage: '2',
		},
	})
}
</script>

<template>
	<section class="container mx-auto px-4 py-10 min-h-[calc(70vh-80px)]">
		<div class="mx-auto mt-7 w-full max-w-[660px] rounded-2xl bg-white px-14 py-8 shadow-sm">
			<h1 class="text-center text-2xl font-semibold leading-none text-[#0b3765]">Forgot Password?</h1>
			<p class="mt-3 text-center text-base text-[#6b7280]">Please enter your email address/ Phone number!</p>

			<form class="mt-8" @submit.prevent="onSubmit">
				<label class="mb-2 block text-base font-semibold leading-tight text-[#0f172a]">
					Email address or Phone number <span class="text-red-600">*</span>
				</label>

				<input
					v-model="emailOrPhone"
					type="text"
					placeholder="Email address or Phone number"
					class="h-12 w-full rounded-lg border border-[#b6b6b6]  px-4 text-base text-[#374151] outline-none placeholder:text-[#9ca3af] focus:border-[#9ca3af]"
					required
				>

				<button
					type="submit"
					:disabled="loading"
					class="mt-6 h-12 w-full rounded-lg bg-[#e46000] text-base font-semibold leading-none text-white transition hover:bg-[#d75900]"
				>
					{{ loading ? 'Loading...' : 'Continue' }}
				</button>

				<p v-if="error" class="mt-3 text-sm text-red-600">{{ error }}</p>
			</form>
		</div>
	</section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { loading, error } = storeToRefs(authStore)

const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const form = reactive({
	newPassword: '',
	confirmPassword: '',
})

const errorMessage = ref('')

const onSubmit = async () => {
	errorMessage.value = ''
	authStore.error = null

	if (!form.newPassword || !form.confirmPassword) {
		errorMessage.value = 'Please fill all required fields.'
		return
	}

	if (form.newPassword !== form.confirmPassword) {
		errorMessage.value = 'Password and confirm password do not match.'
		return
	}

	const result = await authStore.resetPassword({
		newPassword: form.newPassword,
	})

	if (result.success && result.redirectTo) {
		await navigateTo(result.redirectTo)
	}
}
</script>

<template>
	<section class="min-h-screen bg-[#d9d9d9] px-4 py-10">
		<div class="mx-auto mt-7 w-full max-w-[660px] rounded-2xl bg-[#e3e3e3] px-14 py-8 shadow-sm">
			<h1 class="text-center text-[42px] font-extrabold leading-none text-[#0b3765]">New Password</h1>
			<p class="mt-3 text-center text-[30px] text-[#6b7280]">Please enter your new password / confirm password</p>

			<form class="mt-8" @submit.prevent="onSubmit">
				<label class="mb-2 block text-[34px] font-semibold leading-tight text-[#1f2937]">
					<span class="text-red-600">*</span> New Password
				</label>

				<div class="relative">
					<input
						v-model="form.newPassword"
						:type="showNewPassword ? 'text' : 'password'"
						placeholder="New password"
						class="h-[72px] w-full rounded-lg border border-[#b6b6b6] bg-[#efefef] px-4 pr-12 text-[30px] text-[#374151] outline-none placeholder:text-[#9ca3af] focus:border-[#9ca3af]"
						required
					>
					<button
						type="button"
						class="absolute inset-y-0 right-3 text-[#b5b5b5]"
						@click="showNewPassword = !showNewPassword"
					>
						<i class="fa-solid" :class="showNewPassword ? 'fa-eye' : 'fa-eye-slash'" />
					</button>
				</div>

				<label class="mb-2 mt-6 block text-[34px] font-semibold leading-tight text-[#1f2937]">
					<span class="text-red-600">*</span> Confirm Password
				</label>

				<div class="relative">
					<input
						v-model="form.confirmPassword"
						:type="showConfirmPassword ? 'text' : 'password'"
						placeholder="Confirm password"
						class="h-[72px] w-full rounded-lg border border-[#b6b6b6] bg-[#efefef] px-4 pr-12 text-[30px] text-[#374151] outline-none placeholder:text-[#9ca3af] focus:border-[#9ca3af]"
						required
					>
					<button
						type="button"
						class="absolute inset-y-0 right-3 text-[#b5b5b5]"
						@click="showConfirmPassword = !showConfirmPassword"
					>
						<i class="fa-solid" :class="showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'" />
					</button>
				</div>

				<button
					type="submit"
					:disabled="loading"
					class="mt-6 h-[72px] w-full rounded-lg bg-[#e46000] text-[44px] font-semibold leading-none text-white transition hover:bg-[#d75900]"
				>
					{{ loading ? 'Loading...' : 'Continue' }}
				</button>

				<p v-if="errorMessage" class="mt-3 text-center text-sm text-red-600">{{ errorMessage }}</p>
				<p v-if="error" class="mt-2 text-center text-sm text-red-600">{{ error }}</p>
			</form>
		</div>
	</section>
</template>

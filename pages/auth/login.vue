<!-- filepath: d:\VET EXPRESS\components\auth\SignInAccount.vue -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthStore } from '~/stores/useAuthStore'

const authStore = useAuthStore()

const userForm = reactive({
    email_or_phone: '',
    password: '',
})

const showPassword = ref(false)

async function onSubmit() {
    try {
        await authStore.signIn({
            username: userForm.email_or_phone,
            password: userForm.password,
        })

        await navigateTo('/')
    } catch {
    }
}
</script>

<template>
    <div class="container mx-auto py-12 px-4">
        <div class="max-w-[460px] mx-auto bg-white rounded-2xl p-10 shadow">
            <h1 class="text-4xl font-bold text-center mb-2">Login Account</h1>
            <p class="text-center text-slate-600 mb-8">Please enter your credential to login!</p>

            <form @submit.prevent="onSubmit" class="space-y-5">
                <div>
                    <label class="block font-semibold mb-2">Email address or Phone number <span
                            class="text-red-500">*</span></label>
                    <input v-model="userForm.email_or_phone" type="text" class="w-full border rounded-md px-4 py-3"
                        placeholder="Email address or Phone number" required />
                </div>

                <div>
                    <label class="block font-semibold mb-2">Password <span class="text-red-500">*</span></label>
                    <div class="relative">
                        <input v-model="userForm.password" :type="showPassword ? 'text' : 'password'"
                            class="w-full border rounded-md px-4 py-3 pr-12" placeholder="Password" required />
                        <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2"
                            @click="showPassword = !showPassword">
                            👁️
                        </button>
                    </div>
                </div>

                <p v-if="authStore.error" class="text-red-600 text-sm">{{ authStore.error }}</p>

                <button type="submit"
                    class="w-full bg-orange-600 text-white rounded-md py-3 font-bold disabled:opacity-60"
                    :disabled="authStore.loading">
                    {{ authStore.loading ? 'Signing in...' : 'Login' }}
                </button>
            </form>
        </div>
    </div>
</template>
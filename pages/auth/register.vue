<script setup lang="ts">
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const nationalityStore = useNationalityStore()
const { nationalities, loading: nationalityLoading } = storeToRefs(nationalityStore)

const showPassword = ref(false)

const form = reactive({
  firstName: '',
  nationalityId: '',
  genderId: '',
  email: '',
  phone: '',
  password: '',
})

const genders = [
  { id: '1', label: 'Male' },
  { id: '2', label: 'Female' },
]

const normalizePhoneNumber = (rawValue: string): string => {
  const digits = String(rawValue || '').replace(/\D/g, '')
  if (!digits) return ''

  if (digits.startsWith('855')) {
    return `+${digits}`
  }

  return `+855${digits}`
}

const normalizeEmail = (rawValue: string): string => String(rawValue || '').trim().toLowerCase()

onMounted(async () => {
  if (!nationalities.value.length) {
    await nationalityStore.fetchNationalities()
  }
})

const onSubmit = async () => {
  authStore.error = null

  const nationalityId = Number.parseInt(form.nationalityId, 10)
  const gender = Number.parseInt(form.genderId, 10)

  if (!form.firstName || !form.nationalityId || !form.genderId || !form.email || !form.password) {
    authStore.error = 'Please fill all required fields'
    return
  }

  if (Number.isNaN(nationalityId) || Number.isNaN(gender)) {
    authStore.error = 'Invalid nationality or gender'
    return
  }

  const formattedPhoneNumber = normalizePhoneNumber(form.phone)
  const normalizedEmail = normalizeEmail(form.email)

  if (!normalizedEmail) {
    authStore.error = 'Please enter a valid email address'
    return
  }

  try {
    await authStore.register({
      firstName: form.firstName,
      nationalityId,
      gender,
      email: normalizedEmail,
      password: form.password,
      ...(formattedPhoneNumber ? { telephone: formattedPhoneNumber } : {}),
    })

    form.email = normalizedEmail

    await navigateTo({
      path: '/auth/OTP',
      query: {
        email: normalizedEmail,
        handleRemamberPage: '1',
      },
    })
  } catch {
  }
}
</script>

<template>
  <section class="container mx-auto py-12">
    <div class="mx-auto max-w-2xl rounded-2xl bg-white px-7 py-10 shadow-sm md:px-8">
      <h1 class="text-center text-3xl font-bold leading-none text-[#153b6d]">Register Account</h1>
      <p class="mt-3 text-center text-base text-slate-500">Please enter your credential to register</p>

      <form class="mt-10 space-y-6 px-8" @submit.prevent="onSubmit">
        <div>
          <label class="mb-2 block text-base font-semibold text-slate-700">
            Username <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.firstName"
            type="text"
            placeholder="Username"
            class="h-14 w-full rounded-lg border border-slate-300 px-4 text-base text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-400"
            required
          >
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-2 block text-base font-semibold text-slate-700">
              Nationality <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <select
                v-model="form.nationalityId"
                class="h-14 w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 pr-10 text-base text-slate-700 outline-none focus:border-slate-400"
                :disabled="nationalityLoading"
                required
              >
                <option value="" disabled>Nationality</option>
                <option v-for="item in nationalities" :key="item.id" :value="item.id">{{ item.name }}</option>
              </select>
              <span class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500"><i class="fa-solid fa-chevron-down" /></span>
            </div>
          </div>

          <div>
            <label class="mb-2 block text-base font-semibold text-slate-700">
              Gender <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <select
                v-model="form.genderId"
                class="h-14 w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 pr-10 text-base text-slate-700 outline-none focus:border-slate-400"
                required
              >
                <option value="" disabled>Gender</option>
                <option v-for="item in genders" :key="item.id" :value="item.id">{{ item.label }}</option>
              </select>
              <span class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500"><i class="fa-solid fa-chevron-down" /></span>
            </div>
          </div>
        </div>

        <div>
          <label class="mb-2 block text-base font-semibold text-slate-700">
            Email Address <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.email"
            type="email"
            placeholder="Email Address"
            class="h-14 w-full rounded-lg border border-slate-300 px-4 text-base text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-400"
            required
          >
        </div>

        <div>
          <label class="mb-2 block text-base font-semibold text-slate-700">Phone number</label>
          <div class="flex h-14 w-full rounded-lg border border-slate-300 bg-white">
            <span class="flex items-center border-r border-slate-300 px-4 text-base text-slate-500">+855</span>
            <input
              v-model="form.phone"
              type="text"
              placeholder="Phone number"
              class="w-full px-4 text-base text-slate-700 outline-none placeholder:text-slate-400"
            >
          </div>
        </div>

        <div>
          <label class="mb-2 block text-base font-semibold text-slate-700">
            Password <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter Password"
              class="h-14 w-full rounded-lg border border-slate-300 px-4 pr-12 text-base text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-400"
              required
            >
            <button
              type="button"
              class="absolute inset-y-0 right-4 text-slate-500"
              @click="showPassword = !showPassword"
            >
              <i class="fa-solid" :class="showPassword ? 'fa-eye' : 'fa-eye-slash'" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          class="mt-2 h-14 w-full rounded-lg bg-orange-600 text-2xl font-semibold text-white transition hover:bg-orange-700"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? 'Registering...' : 'Register' }}
        </button>

        <p v-if="authStore.error" class="text-sm text-red-600">{{ authStore.error }}</p>
      </form>
    </div>
  </section>
</template>

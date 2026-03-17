<script setup lang="ts">
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { loading, error } = storeToRefs(authStore)

const email = computed(() => String(route.query.email))
const remamberPage = computed(() => Number.parseInt(String(route.query.handleRemamberPage || '0'), 10) || 0)
const otpDigits = ref<string[]>(['', '', '', ''])
const otpRefs = ref<Array<HTMLInputElement | null>>([])
const hasSubmitted = ref(false)

const setOtpRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  otpRefs.value[index] = el as HTMLInputElement | null
}

const handleInput = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  const onlyNumber = target.value.replace(/\D/g, '').slice(-1)

  otpDigits.value[index] = onlyNumber
  target.value = onlyNumber

  if (onlyNumber && index < otpRefs.value.length - 1) {
    otpRefs.value[index + 1]?.focus()
  }

  const otp = otpDigits.value.join('')
  if (otp.length === otpDigits.value.length && !hasSubmitted.value) {
    void submitOtp()
  }
}

const handleKeydown = (event: KeyboardEvent, index: number) => {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    otpRefs.value[index - 1]?.focus()
  }
}

const resendCode = () => {
  console.log('Resend OTP to:', email.value)
}

const submitOtp = async () => {
  const otp = otpDigits.value.join('').replace(/\D/g, '')
  if (otp.length !== otpDigits.value.length) return

  hasSubmitted.value = true
  const result = await authStore.verifyOtp({
    code: otp,
    remamberPage: remamberPage.value,
  })

  if (result.success && result.redirectTo) {
    await router.push(result.redirectTo)
    return
  }

  otpDigits.value = ['', '', '', '']
  otpRefs.value[0]?.focus()
  hasSubmitted.value = false
}
</script>

<template>
  <section class="min-h-screen bg-slate-100 px-4 py-10">
    <div class="mx-auto mt-8 w-full max-w-[520px] rounded-2xl bg-white px-8 py-9 shadow-sm">
      <h1 class="text-center text-5xl font-bold text-slate-900">Verification Code</h1>
      <p class="mt-3 text-center text-2xl text-slate-500">Please type the verification code send to</p>
      <p class="mt-1 text-center text-2xl font-semibold text-slate-900">{{ email }}</p>

      <div class="mt-7 flex items-center justify-center gap-3">
        <input
          v-for="(digit, index) in otpDigits"
          :key="index"
          :ref="(el) => setOtpRef(el, index)"
          :value="digit"
          inputmode="numeric"
          maxlength="1"
          autocomplete="one-time-code"
          class="h-14 w-14 rounded-md border border-slate-400 bg-white text-center text-2xl font-semibold text-slate-800 outline-none focus:border-slate-500"
          @input="handleInput($event, index)"
          @keydown="handleKeydown($event, index)"
        >
      </div>

      <div class="mt-4 flex items-center justify-center gap-16 text-2xl">
        <p class="text-slate-500">Didn't received code ?</p>
        <button type="button" class="font-medium text-slate-900 hover:underline" @click="resendCode">
          Resend Code
        </button>
      </div>

      <p v-if="loading" class="mt-4 text-center text-sm text-slate-600">Verifying OTP...</p>
      <p v-if="error" class="mt-2 text-center text-sm text-red-600">{{ error }}</p>
    </div>
  </section>
</template>

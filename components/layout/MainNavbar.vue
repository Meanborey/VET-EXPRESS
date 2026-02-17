<script setup lang="ts">
const { t, locale, setLocale } = useI18n()

const navigation = computed(() => [
  { label: t('about'), to: '/aboutUs' },
  { label: t('travelPackage'), to: '/travel-package' },
  { label: t('vehicleRental'), to: '/vehicle-rental' },
  { label: t('gallery'), to: '/gallery' },
  { label: t('blog'), to: '/blogs' },
  { label: t('contact'), action: 'scroll' }
])

const subsidiaryDropdownOpen = ref(false)
const languageDropdownOpen = ref(false)

type LanguageKey = 'en' | 'cn' 

const languages: Record<LanguageKey, { icon: string; label: string }> = {
  en: {
    icon: '/icons/ic_english.png',
    label: 'English'
  },
  cn: {
    icon: '/icons/ic_chinese.png',
    label: '中文'
  }
}

const toggleSubsidiary = () => {
  subsidiaryDropdownOpen.value = !subsidiaryDropdownOpen.value
}

const toggleLanguage = () => {
  languageDropdownOpen.value = !languageDropdownOpen.value
}

const selectLanguage = (language: LanguageKey) => {
  setLocale(language)
  languageDropdownOpen.value = false
}

const scrollToContact = () => {
  const element = document.getElementById('contact')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// Image error handling
const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  if (img) {
    img.style.display = 'none'
    console.warn(`Failed to load image: ${img.src}`)
  }
}
</script>

<template>
  <nav class="flex items-center justify-between w-full">
    <!-- Logo -->
    <div class="flex items-center">
      <NuxtLink to="/" class="w-8 h-8 rounded flex items-center justify-center text-white font-bold text-sm">
        <img 
          src="/images/vireak-buntham.png" 
          alt="VET Express Logo" 
          class="w-8 h-8 object-contain"
          @error="onImageError">
      </NuxtLink>
    </div>

    <!-- Main Navigation -->
    <div class="flex items-center gap-8 text-sm font-medium text-gray-700">
      <template v-for="item in navigation" :key="item.label">
        <NuxtLink v-if="!item.action" :to="item.to" class="hover:text-orange-500 transition-colors">
          {{ item.label }}
        </NuxtLink>
        <button v-else @click="scrollToContact" class="hover:text-orange-500 transition-colors cursor-pointer">
          {{ item.label }}
        </button>
      </template>
      <!-- Subsidiary Dropdown -->
      <div class="relative" @mouseenter="subsidiaryDropdownOpen = true" @mouseleave="subsidiaryDropdownOpen = false">
        <button
          class="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors">
          {{ t('subsidiary') }}
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        <div v-if="subsidiaryDropdownOpen"
          class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg py-1 min-w-40 z-50">
          <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{{ t('subsidiaryOne') }}</a>
          <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{{ t('subsidiaryTwo') }}</a>
        </div>
      </div>
      <div class="relative">
        <button @click="toggleLanguage"
          class="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors">
          <!-- Selected Language Flag -->
          <img 
            class="w-6 h-4 object-cover" 
            :src="languages[locale as LanguageKey]?.icon || languages.en.icon" 
            :alt="`${languages[locale as LanguageKey]?.label || languages.en.label} flag`"
            @error="onImageError">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        <div v-if="languageDropdownOpen" 
          class="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg py-1 min-w-36 z-50">
          <div v-for="(lang, key) in languages" :key="key" @click="selectLanguage(key as LanguageKey)" class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
            <img 
              class="w-6 h-4 object-cover" 
              :src="lang.icon" 
              :alt="`${lang.label} flag`"
              @error="onImageError">
            <span>{{ lang.label }}</span>
          </div>
        </div>
      </div>
      <!-- Sign In Button -->
      <NuxtLink to="/auth/login"
        class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
        {{ t('signIn') }}
      </NuxtLink>
    </div>
  </nav>
</template>

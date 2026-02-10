<script setup lang="ts">
import { root } from 'postcss';
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import Router from '../common/home-component/router.vue';
import { useDestinationStore } from '~/stores/useDestinationStore'

const emit = defineEmits<{
    (e: 'submit', payload: DestinationFormPayload): void
}>()

const { t, locale } = useI18n()
const destinationStore = useDestinationStore()

type DestinationFormPayload = {
    origin: string
    destination: string
    departDate: string
    returnDate: string
}

type DateField = 'depart' | 'return'

const toInputDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

const today = new Date()

const form = reactive<DestinationFormPayload>({
    origin: '',
    destination: '',
    departDate: toInputDate(today),
    returnDate: ''
})

const calendarCursor = ref(new Date(form.departDate + 'T00:00:00'))
const isCalendarOpen = ref(false)
const calendarContainerRef = ref<HTMLElement | null>(null)
const calendarPanelRef = ref<HTMLElement | null>(null)
const activeDateField = ref<DateField>('depart')

// Location selector
const isOriginDropdownOpen = ref(false)
const isDestinationDropdownOpen = ref(false)
const originInputRef = ref<HTMLElement | null>(null)
const destinationInputRef = ref<HTMLElement | null>(null)
const selectedOriginId = ref<string>('')
const selectedDestinationId = ref<string>('')

// Get unique locations from destination store (API-based)
const availableOrigins = computed(() => {
  return destinationStore.origins
})

const availableDestinations = computed(() => {
  return destinationStore.destinations
})

const filteredOrigins = computed(() => {
  if (!form.origin) return availableOrigins.value
  return availableOrigins.value.filter(origin => 
    origin.name.toLowerCase().includes(form.origin.toLowerCase())
  )
})

const filteredDestinations = computed(() => {
  if (!form.destination) return availableDestinations.value
  return availableDestinations.value.filter(dest => 
    dest.name.toLowerCase().includes(form.destination.toLowerCase())
  )
})

// Debounce timer for search
let originSearchTimeout: ReturnType<typeof setTimeout> | null = null
let destinationSearchTimeout: ReturnType<typeof setTimeout> | null = null

const selectOrigin = (origin: { id: string; name: string }) => {
  form.origin = origin.name
  selectedOriginId.value = origin.id
  isOriginDropdownOpen.value = false
  
  // Fetch destinations based on selected origin
  destinationStore.fetchDestinations('', origin.id)
  
  // Auto-open destination dropdown after selecting origin
  setTimeout(() => {
    isDestinationDropdownOpen.value = true
  }, 100)
}

const selectDestination = (destination: { id: string; name: string }) => {
  form.destination = destination.name
  selectedDestinationId.value = destination.id
  isDestinationDropdownOpen.value = false
}

// Handle origin input change with debounce
const handleOriginInput = () => {
  isOriginDropdownOpen.value = true
  
  if (originSearchTimeout) {
    clearTimeout(originSearchTimeout)
  }
  
  originSearchTimeout = setTimeout(() => {
    destinationStore.fetchOrigins(form.origin)
  }, 300)
}

// Handle destination input change with debounce
const handleDestinationInput = () => {
  isDestinationDropdownOpen.value = true
  
  if (destinationSearchTimeout) {
    clearTimeout(destinationSearchTimeout)
  }
  
  destinationSearchTimeout = setTimeout(() => {
    destinationStore.fetchDestinations(form.destination, selectedOriginId.value)
  }, 300)
}

// Handle origin focus - fetch origins if empty
const handleOriginFocus = () => {
  isOriginDropdownOpen.value = true
  if (availableOrigins.value.length === 0) {
    destinationStore.fetchOrigins('')
  }
}

// Handle destination focus - fetch destinations if empty
const handleDestinationFocus = () => {
  isDestinationDropdownOpen.value = true
  if (availableDestinations.value.length === 0) {
    destinationStore.fetchDestinations('', selectedOriginId.value)
  }
}

// Watch for origin changes to auto-open destination dropdown
watch(
    () => form.origin,
    (newValue, oldValue) => {
        // Only auto-open if origin was just filled and destination is empty
        if (newValue && !oldValue && !form.destination) {
            setTimeout(() => {
                isDestinationDropdownOpen.value = true
            }, 100)
        }
        // Clear selected origin ID if input is cleared
        if (!newValue) {
            selectedOriginId.value = ''
        }
    }
)

// Watch for destination changes
watch(
    () => form.destination,
    (newValue) => {
        // Clear selected destination ID if input is cleared
        if (!newValue) {
            selectedDestinationId.value = ''
        }
    }
)

const departDateObj = computed(() =>
    form.departDate ? new Date(form.departDate + 'T00:00:00') : null
)

const returnDateObj = computed(() =>
    form.returnDate ? new Date(form.returnDate + 'T00:00:00') : null
)

const localeCode = computed(() =>
    locale.value === 'cn' ? 'zh-CN' : 'en-US'
)

watch(
    () => form.departDate,
    value => {
        if (value) {
            calendarCursor.value = new Date(value + 'T00:00:00')
            if (form.returnDate && form.returnDate < value) {
                form.returnDate = value
            }
        }
    }
)

watch(
    () => form.returnDate,
    value => {
        if (value && value < form.departDate) {
            form.returnDate = form.departDate
        }
    }
)

const calendarMonthLabel = computed(() =>
    new Intl.DateTimeFormat(localeCode.value, { month: 'long', year: 'numeric' }).format(
        calendarCursor.value
    )
)

const dateHeaderLabel = computed(() =>
    (() => {
        const activeDate = activeDateField.value === 'depart' ? departDateObj.value : returnDateObj.value
        if (!activeDate) {
            return t('selectDate')
        }
        return new Intl.DateTimeFormat(localeCode.value, {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        }).format(activeDate)
    })()
)

const dateYearLabel = computed(() =>
    (() => {
        const activeDate = activeDateField.value === 'depart' ? departDateObj.value : returnDateObj.value
        return activeDate ? activeDate.getFullYear() : '--'
    })()
)

const departDateDisplay = computed(() =>
    departDateObj.value
        ? toInputDate(departDateObj.value)
        : ''
)

const returnDateDisplay = computed(() =>
    returnDateObj.value
        ? toInputDate(returnDateObj.value)
        : ''
)

const buildCalendar = (anchor: Date) => {
    const firstOfMonth = new Date(anchor.getFullYear(), anchor.getMonth(), 1)
    const startOffset = firstOfMonth.getDay()
    const firstVisible = new Date(firstOfMonth)
    firstVisible.setDate(firstOfMonth.getDate() - startOffset)

    const weeks: Array<Array<{ date: Date; inCurrentMonth: boolean }>> = []
    const cursor = new Date(firstVisible)

    for (let weekIndex = 0; weekIndex < 6; weekIndex += 1) {
        const week: Array<{ date: Date; inCurrentMonth: boolean }> = []
        for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
            week.push({
                date: new Date(cursor),
                inCurrentMonth: cursor.getMonth() === anchor.getMonth()
            })
            cursor.setDate(cursor.getDate() + 1)
        }
        weeks.push(week)
    }

    return weeks
}

const calendarWeeks = computed(() => buildCalendar(calendarCursor.value))

const isSelectedDate = (date: Date) => {
    const compareValue = activeDateField.value === 'depart' ? form.departDate : form.returnDate
    return compareValue === toInputDate(date)
}

const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
}

const goToPreviousMonth = () => {
    const next = new Date(calendarCursor.value)
    next.setMonth(next.getMonth() - 1)
    calendarCursor.value = next
}

const goToNextMonth = () => {
    const next = new Date(calendarCursor.value)
    next.setMonth(next.getMonth() + 1)
    calendarCursor.value = next
}

const selectCalendarDay = (date: Date) => {
    const dayValue = toInputDate(date)
    if (activeDateField.value === 'depart') {
        form.departDate = dayValue
        if (form.returnDate && form.returnDate < dayValue) {
            form.returnDate = dayValue
        }
    } else {
        const departDate = form.departDate ? new Date(form.departDate + 'T00:00:00') : null
        if (departDate && date < departDate) {
            return
        }
        form.returnDate = dayValue
    }
    isCalendarOpen.value = false
}

const onSubmit = async () => {
    // Set search parameters in store with IDs for API calls
    destinationStore.setSearchParams({
        origin: form.origin,
        destinationFrom: selectedOriginId.value,
        destination: form.destination,
        destinationTo: selectedDestinationId.value,
        departDate: form.departDate,
        returnDate: form.returnDate
    })

    // Emit for parent component
    emit('submit', { ...form })
    
    // Navigate to schedulelist page
    await navigateTo({
        path: '/schedulelist',
        query: {
            from: form.origin,
            fromId: selectedOriginId.value || undefined,
            to: form.destination,
            toId: selectedDestinationId.value || undefined,
            departDate: form.departDate,
            returnDate: form.returnDate || undefined
        }
    })
}

const openCalendar = (field: DateField) => {
    activeDateField.value = field
    let baseDate: Date | null = null
    if (field === 'depart') {
        baseDate = departDateObj.value ?? new Date(form.departDate + 'T00:00:00')
    } else {
        baseDate = returnDateObj.value ?? departDateObj.value ?? new Date(form.departDate + 'T00:00:00')
    }
    if (!baseDate) {
        baseDate = new Date()
    }
    calendarCursor.value = new Date(baseDate.getTime())
    isCalendarOpen.value = true
}

const handleDocumentClick = (event: MouseEvent) => {
    const target = event.target as Node
    
    // Close calendar
    if (
        calendarPanelRef.value &&
        calendarPanelRef.value.contains(target)
    ) {
        return
    }
    if (
        calendarContainerRef.value &&
        calendarContainerRef.value.contains(target)
    ) {
        return
    }
    isCalendarOpen.value = false
    
    // Close location dropdowns
    if (originInputRef.value && !originInputRef.value.contains(target)) {
        isOriginDropdownOpen.value = false
    }
    if (destinationInputRef.value && !destinationInputRef.value.contains(target)) {
        isDestinationDropdownOpen.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleDocumentClick)
    // Fetch initial origins on mount
    destinationStore.fetchOrigins('')
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleDocumentClick)
    // Clear debounce timers
    if (originSearchTimeout) {
        clearTimeout(originSearchTimeout)
    }
    if (destinationSearchTimeout) {
        clearTimeout(destinationSearchTimeout)
    }
})
</script>

<template>
    <div class=" flex-col gap-6 lg:flex-row">
        <form ref="calendarContainerRef" class="w-full rounded-lg bg-white/95 p-4 shadow-xl backdrop-blur"
            @submit.prevent="onSubmit">
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(7,minmax(0,1fr))]">
                <!-- Departing From -->
                <label class="flex flex-col gap-1 col-span-2">
                    <div ref="originInputRef" class="relative">
                        <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="1.5" class="h-5 w-5">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3Zm0 0c2.21 0 4 1.79 4 4v2H8v-2c0-2.21 1.79-4 4-4Z" />
                            </svg>
                        </span>
                        <input 
                            v-model="form.origin" 
                            type="text" 
                            :placeholder="t('destinationFromPlaceholder')"
                            @focus="handleOriginFocus"
                            @input="handleOriginInput"
                            class="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200" />
                        
                        <!-- Loading indicator -->
                        <span v-if="destinationStore.loading && isOriginDropdownOpen" 
                            class="absolute inset-y-0 right-3 flex items-center text-orange-400">
                            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </span>
                        
                        <!-- Origin Dropdown -->
                        <transition name="fade">
                            <div v-if="isOriginDropdownOpen && filteredOrigins.length > 0"
                                class="absolute left-0 top-[calc(100%+0.5rem)] z-30 w-full rounded-xl bg-white shadow-xl border border-slate-200 max-h-60 overflow-y-auto">
                                <button
                                    v-for="origin in filteredOrigins"
                                    :key="origin.id"
                                    type="button"
                                    @click="selectOrigin(origin)"
                                    class="w-full px-4 py-3 text-left text-sm hover:bg-orange-50 transition-colors border-b border-slate-100 last:border-b-0 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-orange-500">
                                        <path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd" />
                                    </svg>
                                    <span class="font-medium text-slate-700">{{ origin.name }}</span>
                                </button>
                            </div>
                        </transition>
                    </div>
                </label>
                <!-- Going To -->
                <label class="flex flex-col col-span-2 gap-1">
                    <div ref="destinationInputRef" class="relative">
                        <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="1.5" class="h-5 w-5">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M21 11.5l-9-9-9 9m18 0l-9 9-9-9" />
                            </svg>
                        </span>
                        <input 
                            v-model="form.destination" 
                            type="text" 
                            :placeholder="t('destinationToPlaceholder')"
                            @focus="handleDestinationFocus"
                            @input="handleDestinationInput"
                            class="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200" />
                        
                        <!-- Loading indicator -->
                        <span v-if="destinationStore.loading && isDestinationDropdownOpen" 
                            class="absolute inset-y-0 right-3 flex items-center text-orange-400">
                            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </span>
                        
                        <!-- Destination Dropdown -->
                        <transition name="fade">
                            <div v-if="isDestinationDropdownOpen && filteredDestinations.length > 0"
                                class="absolute left-0 top-[calc(100%+0.5rem)] z-30 w-full rounded-xl bg-white shadow-xl border border-slate-200 max-h-60 overflow-y-auto">
                                <button
                                    v-for="destination in filteredDestinations"
                                    :key="destination.id"
                                    type="button"
                                    @click="selectDestination(destination)"
                                    class="w-full px-4 py-3 text-left text-sm hover:bg-orange-50 transition-colors border-b border-slate-100 last:border-b-0 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-orange-500">
                                        <path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd" />
                                    </svg>
                                    <span class="font-medium text-slate-700">{{ destination.name }}</span>
                                </button>
                            </div>
                        </transition>
                    </div>
                </label>
                <!-- Departing Date -->
                <label class="flex flex-col gap-1">
                    <div ref="calendarContainerRef" class="relative" @click.stop="openCalendar('depart')">
                        <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="1.5" class="h-5 w-5">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M6.75 3v2.25M17.25 3v2.25M3 9.75h18M4.5 7.5h15a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18V9a1.5 1.5 0 0 1 1.5-1.5Z" />
                            </svg>
                        </span>
                        <input :value="departDateDisplay" readonly
                            class="w-full cursor-pointer rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                            @click.stop="openCalendar('depart')" @focus.prevent="openCalendar('depart')" />
                        <transition name="fade">
                            <aside v-if="isCalendarOpen && activeDateField === 'depart'" ref="calendarPanelRef"
                                class="absolute left-0 top-[calc(100%+0.75rem)] z-20 w-80 rounded-3xl bg-white text-slate-800 shadow-2xl"
                                @click.stop>
                                <div class="rounded-t-3xl bg-orange-500 p-6 text-white">
                                    <p class="text-sm uppercase tracking-[0.25em]">{{ dateYearLabel }}</p>
                                    <p class="mt-2 text-3xl font-semibold">{{ dateHeaderLabel }}</p>
                                </div>
                                <div class="p-6">
                                    <div
                                        class="mb-4 flex items-center justify-between text-sm font-medium text-slate-600">
                                        <button type="button" class="rounded-full p-1 transition hover:bg-slate-100"
                                            @click.stop="goToPreviousMonth">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="1.5" class="h-5 w-5">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M15 18l-6-6 6-6" />
                                            </svg>
                                        </button>
                                        <span>{{ calendarMonthLabel }}</span>
                                        <button type="button" class="rounded-full p-1 transition hover:bg-slate-100"
                                            @click.stop="goToNextMonth">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="1.5" class="h-5 w-5">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div
                                        class="grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        <span v-for="day in ['S', 'M', 'T', 'W', 'T', 'F', 'S']" :key="day">{{ day
                                            }}</span>
                                    </div>
                                    <div class="mt-2 grid grid-cols-7 gap-1 text-sm">
                                        <template v-for="(week, weekIndex) in calendarWeeks" :key="`week-${weekIndex}`">
                                            <button v-for="day in week" :key="day.date.toISOString()" type="button"
                                                class="flex h-10 w-full items-center justify-center rounded-lg transition"
                                                :class="[
                                                    day.inCurrentMonth ? 'text-slate-700' : 'text-slate-300',
                                                    isSelectedDate(day.date)
                                                        ? 'bg-orange-500 text-white shadow'
                                                        : isToday(day.date)
                                                        ? 'bg-blue-100 text-blue-600 font-semibold'
                                                        : 'hover:bg-orange-100 hover:text-orange-600'
                                                ]" @click.stop="selectCalendarDay(day.date)">
                                                {{ day.date.getDate() }}
                                            </button>
                                        </template>
                                    </div>
                                </div>
                            </aside>
                        </transition>
                    </div>
                </label>
                
                <label class="flex flex-col gap-1">
                    <div class="relative" @click.stop="openCalendar('return')">
                        <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="1.5" class="h-5 w-5">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M8.25 15H15m-6.75-3H12M6.75 3v2.25M17.25 3v2.25M3 9.75h18M4.5 7.5h15a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18V9a1.5 1.5 0 0 1 1.5-1.5Z" />
                            </svg>
                        </span>
                        <input :value="returnDateDisplay" readonly :placeholder="t('returnDate')"
                            class="w-full cursor-pointer rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                            @click.stop="openCalendar('return')" @focus.prevent="openCalendar('return')" />
                        <transition name="fade">
                            <aside v-if="isCalendarOpen && activeDateField === 'return'" ref="calendarPanelRef"
                                class="absolute left-0 top-[calc(100%+0.75rem)] z-20 w-80 rounded-3xl bg-white text-slate-800 shadow-2xl"
                                @click.stop>
                                <div class="rounded-t-3xl bg-orange-500 p-6 text-white">
                                    <p class="text-sm uppercase tracking-[0.25em]">{{ dateYearLabel }}</p>
                                    <p class="mt-2 text-3xl font-semibold">{{ dateHeaderLabel }}</p>
                                </div>
                                <div class="p-6">
                                    <div
                                        class="mb-4 flex items-center justify-between text-sm font-medium text-slate-600">
                                        <button type="button" class="rounded-full p-1 transition hover:bg-slate-100"
                                            @click.stop="goToPreviousMonth">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="1.5" class="h-5 w-5">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M15 18l-6-6 6-6" />
                                            </svg>
                                        </button>
                                        <span>{{ calendarMonthLabel }}</span>
                                        <button type="button" class="rounded-full p-1 transition hover:bg-slate-100"
                                            @click.stop="goToNextMonth">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="1.5" class="h-5 w-5">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div
                                        class="grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        <span v-for="day in ['S', 'M', 'T', 'W', 'T', 'F', 'S']" :key="day">{{ day
                                            }}</span>
                                    </div>
                                    <div class="mt-2 grid grid-cols-7 gap-1 text-sm">
                                        <template v-for="(week, weekIndex) in calendarWeeks" :key="`week-${weekIndex}`">
                                            <button v-for="day in week" :key="day.date.toISOString()" type="button"
                                                class="flex h-10 w-full items-center justify-center rounded-lg transition"
                                                :class="[
                                                    day.inCurrentMonth ? 'text-slate-700' : 'text-slate-300',
                                                    isSelectedDate(day.date)
                                                        ? 'bg-orange-500 text-white shadow'
                                                        : isToday(day.date)
                                                        ? 'bg-blue-100 text-blue-600 font-semibold'
                                                        : 'hover:bg-orange-100 hover:text-orange-600'
                                                ]" @click.stop="selectCalendarDay(day.date)">
                                                {{ day.date.getDate() }}
                                            </button>
                                        </template>
                                    </div>
                                </div>
                            </aside>
                        </transition>
                    </div>
                </label>

                <div class="flex">
                    <button type="submit" 
                        class="w-full rounded-xl bg-orange-500 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:ring-offset-2">
                        {{ t('findNow') }}
                    </button>
                </div>
            </div>
        </form>
    </div>

</template>

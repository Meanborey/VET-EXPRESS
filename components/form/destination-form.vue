<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

const emit = defineEmits<{
    (e: 'submit', payload: DestinationFormPayload): void
}>()

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

const departDateObj = computed(() =>
    form.departDate ? new Date(form.departDate + 'T00:00:00') : null
)

const returnDateObj = computed(() =>
    form.returnDate ? new Date(form.returnDate + 'T00:00:00') : null
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
    new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(
        calendarCursor.value
    )
)

const dateHeaderLabel = computed(() =>
    (() => {
        const activeDate = activeDateField.value === 'depart' ? departDateObj.value : returnDateObj.value
        if (!activeDate) {
            return 'Select Date'
        }
        return new Intl.DateTimeFormat('en-US', {
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
        ? new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        }).format(departDateObj.value)
        : ''
)

const returnDateDisplay = computed(() =>
    returnDateObj.value
        ? new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        }).format(returnDateObj.value)
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

const onSubmit = () => {
    emit('submit', { ...form })
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
}

onMounted(() => {
    document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleDocumentClick)
})
</script>

<template>
    <div
        class="absolute bottom-[30%] left-1/2 z-10 flex w-full container -translate-x-1/2 flex-col gap-6 lg:flex-row">
        <form ref="calendarContainerRef" class="w-full rounded-lg bg-white/95 p-4 shadow-xl backdrop-blur"
            @submit.prevent="onSubmit">
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(7,minmax(0,1fr))]">
                <!-- Departing From -->
                <label class="flex flex-col gap-1 col-span-2">
                    <div class="relative">
                        <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="1.5" class="h-5 w-5">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3Zm0 0c2.21 0 4 1.79 4 4v2H8v-2c0-2.21 1.79-4 4-4Z" />
                            </svg>
                        </span>
                        <input v-model="form.origin" type="text" placeholder="Departing From"
                            class="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200" />
                    </div>
                </label>
                <!-- Going To -->
                <label class="flex flex-col col-span-2 gap-1">
                    <div class="relative">
                        <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="1.5" class="h-5 w-5">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M21 11.5l-9-9-9 9m18 0l-9 9-9-9" />
                            </svg>
                        </span>
                        <input v-model="form.destination" type="text" placeholder="Going To"
                            class="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200" />
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
                        <input :value="returnDateDisplay" readonly placeholder="Return Date"
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
                        Find Now
                    </button>
                </div>
            </div>
        </form>
    </div>

</template>

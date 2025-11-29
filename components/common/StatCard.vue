<script setup lang="ts">
const props = defineProps<{ title: string; value: string | number; subtitle?: string }>()
</script>

<template>
  <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <p class="text-sm text-slate-500">{{ props.title }}</p>
    <p class="mt-2 text-2xl font-semibold text-slate-900">{{ props.value }}</p>
    <p v-if="props.subtitle" class="text-xs text-slate-400">{{ props.subtitle }}</p>
  </section>
</template>

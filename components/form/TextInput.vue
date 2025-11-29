<script setup lang="ts">
const props = defineProps<{ label: string; modelValue: string; type?: string; placeholder?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <label class="block text-sm font-medium text-slate-700">
    <span>{{ props.label }}</span>
    <input
      :value="props.modelValue"
      :type="props.type ?? 'text'"
      :placeholder="props.placeholder"
      class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
      @input="onInput"
    />
  </label>
</template>

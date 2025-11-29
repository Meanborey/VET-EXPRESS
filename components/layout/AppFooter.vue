<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-slate-200 bg-slate-50">
    <div class="mx-auto max-w-6xl px-6 py-8 text-sm text-slate-500">
      © {{ year }} Vet Express. All rights reserved.
    </div>
  </footer>
</template>

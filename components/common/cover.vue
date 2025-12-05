<script setup lang="ts">
import coverimg from '@/assets/images/cover-01.jpg'
</script>

<template>
  <section class="relative w-full h-auto">
    <img class="w-full" :src="coverimg" alt="Cover Image">
    <div class="absolute inset-0 flex justify-center items-center"> 
      <destination-form />
    </div>
  </section>
</template>

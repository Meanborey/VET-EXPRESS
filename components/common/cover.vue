<script setup lang="ts">
import coverimg from '@/assets/images/cover-01.jpg'
</script>

<template>
  <section class="w-full h-auto">
    
    <div class="w-full h-full flex items-center justify-center"> 
      <destination-form />
    </div>
   
    <img class="w-full" :src="coverimg" alt="Cover Image">
  </section>
</template>

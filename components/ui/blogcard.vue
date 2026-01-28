<template>
  <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full" @click="navigateToBlog">
    <!-- Card Image -->
    <div class="w-full h-48 bg-gray-300 overflow-hidden">
      <img 
        :src="image" 
        :alt="title"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Card Content -->
    <div class="p-5">
      <!-- Title -->
      <h3 class="text-base font-semibold text-gray-800 mb-2 line-clamp-2">
        {{ title }}
      </h3>

    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id?: string | number;
  image: string;
  title: string;
  slug?: string;
}

const props = withDefaults(defineProps<Props>(), {
  category: 'Travel Guide',
  slug: ''
});

const router = useRouter();

const navigateToBlog = () => {
  if (props.slug) {
    router.push(`/blogs/${props.slug}`);
  }
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

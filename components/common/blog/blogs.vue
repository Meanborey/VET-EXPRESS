<template>
  <section class="py-16 bg-gradient-to-b from-gray-50 to-white">
    <div class="container mx-auto px-4">
      <!-- Section Header -->

        <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ t('crossBorderTitle') }}</h2>
        
      <!-- Blog Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <BlogCard 
          v-for="blog in blogs" 
          :key="blog.id"
          :id="blog.id"
          :image="blog.image"
          :title="t(blog.title)"
          :slug="blog.slug"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import BlogCard from '@/components/ui/blogcard.vue'
const { t } = useI18n()

interface Blog {
  id: number;
  image: string;
  title: string;
  slug: string;
}

const blogs = ref<Blog[]>([
  {
    id: 1,
    image: 'https://kalelogistics.com/usa/wp-content/uploads/2023/11/MicrosoftTeams-image-20-scaled.jpg',
    title: 'crossBorderTitle',
    slug: 'journey-guide-cambodia'
  }
]);
</script>

<style scoped>

</style>

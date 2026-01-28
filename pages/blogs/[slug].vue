<template>
  <section class="py-12 bg-white">
    <div class="container mx-auto">

      <!-- Article Header -->
      <header class="mb-8" v-if="currentBlog">
       
        <h1 class="text-4xl font-semibold text-gray-800 mb-4">{{ t(currentBlog.title) }}</h1>
        <!-- <p class="text-xl text-gray-600">{{ t('completeGuide') }} {{ currentBlog.title.toLowerCase() }}</p> -->
      </header>

      <!-- Featured Image -->
      <div class="mb-8" v-if="currentBlog">
        <img 
          :src="currentBlog.image" 
          :alt="currentBlog.title"
          class="w-full h-96 object-cover rounded-lg"
        />
      </div>

      <!-- Article Content -->
      <article class="prose prose-lg max-w-none mb-12 text-gray-700" v-if="currentBlog">
        <section v-if="currentBlog.slug === 'entry-vietnam-cambodia'" class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">{{ t('vipService') }}</h2>
          <p class="leading-relaxed mb-4">{{ t('vipServiceText') }}</p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">{{ t('blogt1') }}</h2>
          <p class="leading-relaxed">{{ t('blogt1Text') }}</p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">{{ t('blogt2') }}</h2>
          <p class="leading-relaxed mb-4">{{ t('blogt2Text') }}</p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">{{ t('blogt3') }}</h2>
          <p class="leading-relaxed mb-4">{{ t('blogt3Text') }}</p>
        </section>

        <section class="mb-8">
          <h3 class="text-xl font-semibold text-gray-800 mb-3">{{ t('blogt4') }}</h3>
          <p class="leading-relaxed mb-4">{{ t('blogt4Text') }}</p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">{{ t('blogt5') }}</h2>
          <p class="leading-relaxed mb-4">{{ t('blogt5Text') }}</p>
        </section>
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">{{ t('blogt6') }}</h2>
          <p class="leading-relaxed mb-4">{{ t('blogt6Text') }}</p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">{{ t('blogt9') }}:</h2>
          <p class="leading-relaxed mb-4">{{ t('blogt9Text') }}</p>
        </section>
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-0">{{ t('appendixTitle') }}:</h2>
          <h2 class="text-2xl font-semibold text-gray-800 mt-1 mb-4">{{ t('appendixText') }}</h2>
          <p class="leading-relaxed mb-4">{{ t('citizens') }}</p>
          <p class="leading-relaxed mb-4">{{ t('B') }}</p>
        </section>
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">{{ t('visaThailandTitle') }}</h2>
          <p class="leading-relaxed mb-4">{{ t('visaThailandText') }}</p>
          <p class="leading-relaxed mb-4">{{ t('button') }}</p>
        </section>
      </article>

    </div>
  </section>
</template>

<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()

interface Blog {
  id: number;
  image: string;
  title: string;
  slug: string;
}

const allBlogs: Blog[] = [
  {
    id: 1,
    image: 'https://kalelogistics.com/usa/wp-content/uploads/2023/11/MicrosoftTeams-image-20-scaled.jpg',
    title: 'crossBorderTitle',
    slug: 'journey-guide-cambodia'
  }
]

const slug = computed(() => route.params.slug as string)
const currentBlog = computed(() => allBlogs.find(blog => blog.slug === slug.value))
</script>

<style scoped>
.prose {
  color: #374151;
}

.prose p {
  margin-bottom: 1rem;
  line-height: 1.75;
}
</style>

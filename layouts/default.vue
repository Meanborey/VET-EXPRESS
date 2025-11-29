<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <AppHeader>
      <template #actions>
        <MainNavbar />
      </template>
    </AppHeader>
    <main class="mx-auto max-w-6xl px-6 py-10">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

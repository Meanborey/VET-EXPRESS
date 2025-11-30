<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <AppHeader>
      <template #actions>
        <MainNavbar />
      </template>
    </AppHeader>
    <main>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<template>
  <div class="flex min-h-screen bg-slate-900 text-white">
    <aside class="w-64 border-r border-white/10 bg-slate-950 p-6">
      <p class="text-lg font-bold">Admin</p>
      <ul class="mt-6 space-y-3 text-sm text-slate-300">
        <li><NuxtLink to="/dashboard" class="hover:text-white">Overview</NuxtLink></li>
        <li><NuxtLink to="/booking" class="hover:text-white">Bookings</NuxtLink></li>
      </ul>
    </aside>
    <section class="flex-1 p-8">
      <slot />
    </section>
  </div>
</template>

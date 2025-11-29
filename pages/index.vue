<template>
  <section class="space-y-6">
    <h1 class="text-3xl font-bold">Welcome to Vet Express</h1>
    <p class="text-slate-600">Start building your Nuxt 3 app with the predefined project pattern.</p>
    <div class="grid gap-4 sm:grid-cols-2">
      <StatCard title="Bookings" :value="42" subtitle="Last 30 days" />
      <StatCard title="Customers" :value="128" subtitle="Active" />
    </div>
    <NuxtLink to="/booking" class="text-sky-600 underline">Manage bookings →</NuxtLink>
  </section>
</template>

<template>
    <section
        class="relative bg-gradient-to-r from-orange-500 to-indigo-900 flex items-center justify-center py-5 px-4">
        <div class="container mx-auto">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <!-- Left Side: Phone Mockups -->
                <div class="flex justify-center items-center relative ">
                    <img class="h-96"  src="@/assets/images/experience/app4.png" alt="">
                </div>

                <!-- Right Side: Content -->
                <div class="text-white text-center lg:text-left flex flex-col justify-center">
                    <h2 class="text-5xl lg:text-6xl font-bold mb-2">Experience</h2>
                    <p class="text-2xl lg:text-3xl font-semibold mb-8">VET Express Mobile App</p>

                    <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 mb-8">
                        <!-- Google Play Button -->
                        <a href="#" class="transform hover:scale-105 transition-transform">
                            <img src="@/assets/images/experience/google-play.png"
                                alt="Get it on Google Play" class="h-14 w-full">
                        </a>

                        <!-- App Store Button -->
                        <a href="#" class="transform hover:scale-105 transition-transform">
                            <img src="@/assets/images/experience/app-store.png"
                                alt="Download on the App Store" class="h-14 w-full">
                        </a>

                        <!-- Or Text -->
                        <span class="text-xl font-semibold">Or</span>

                        <!-- QR Code -->
                        <div class="rounded-lg">
                            <img src="@/assets/images/experience/banner app-02.png"
                                alt="VET Express QR Code" class="w-32 h-32">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
// Component logic for Experience section
</script>

<style scoped>
/* Smooth gradient animation */
@keyframes gradient-shift {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

:deep(.gradient-bg) {
    background-size: 400% 400%;
    animation: gradient-shift 15s ease infinite;
}
</style>

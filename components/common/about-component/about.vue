<template>
    <section class="bg-white py-16 px-4">
        <div class="container mx-auto">
            <!-- Top Section: Company Profile -->
            <div class="mb-20">
                <p class="text-orange-500 text-sm font-semibold mb-4">Company Profile</p>
                <h2 class="text-4xl font-semibold text-gray-900 mb-2">Enabling</h2>
                <h2 class="text-4xl font-semibold text-gray-900 mb-8">Key Success</h2>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <!-- Left: Image -->
                    <div class="flex justify-center">
                        <div
                            class="relative rounded-3xl overflow-hidden shadow-lg w-full h-80 bg-gradient-to-b from-gray-200 to-orange-200">
                            <img src="/images/about/6.jpg" alt="VET Building" class="w-full h-full object-cover">
                        </div>
                    </div>

                    <!-- Right: Content -->
                    <div class="flex flex-col justify-start">
                        <h3 class="text-2xl font-semibold text-gray-900 mb-4">VET Background</h3>
                        <p class="text-gray-700 text-base leading-relaxed mb-6">
                            Vireak Buntham Express Co., Ltd (VET) is a leading transportation and logistics
                            company with a number of offices spread across Cambodia, and founded in
                            2004 by Neak Oknha Suo Vireak, and was registered as a company in 2006 at
                            Koh Kong Province. VET provides a transportations and logistics crossing
                            Cambodia, Thailand, and Vietnam. VET utilizes modern technology to deliver
                            exceptional services.
                        </p>
                        <RouterLink to="/aboutUs/vet-background"
                            class="bg-orange-600 text-white px-8 py-3 rounded font-semibold hover:bg-orange-700 transition w-fit">
                            Read More
                        </RouterLink>
                    </div>
                </div>
            </div>

            <!-- Cards Grid Section -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- VET Milestone Card -->
                <AboutCard title="VET Milestone" image="/images/about/1.jpg" routerLink="/aboutUs/vet-milestone"
                    description="Vireak Bustham Express Co., Ltd (VET) is a leading logistic and passenger transportation company in Cambodia that has fruitfully been developed" />

                <!-- Vision and Mission Card -->
                <AboutCard title="Vision and Mission" image="/images/about/5.jpg" routerLink="/aboutUs/mission"
                    description="Based on our firm vision to participate with the royal government for transportation sector, we committed to provide the best transportation" />

                <!-- Message from Chairman & CEO Card -->
                <AboutCard title="Message from Chairman & CEO" image="/images/about/2.jpg" routerLink="/aboutUs/ceo-message"
                    description="Vireak Buntham Express was founded on the unique vision of providing customized, innovative, end-to-end logistics and travel solutions of the" />

                <!-- VET Corporation Core Values Card -->
                <AboutCard title="VET Corporation Core Values" image="/images/about/3.jpg" routerLink="/aboutUs/values"
                    description="VET's core values are the clearly stated principles about its vision, mission, and principles. That way, everyone is aligned around a guiding philosophy to serve employees, customers, and the broader community." />

                <!-- VET Product and Services Card -->
                <AboutCard title="VET Product and Services" image="/images/about/4.jpg" routerLink="/aboutUs/producte-service"
                    description="Vireak BunTham Express Co., Ltd has expanded it services every yearfrom 2004 to today and has produced many results for market demand and" />

                <!-- VET Membership Card Card -->
                <AboutCard title="VET Membership Card" image="/images/about/10.jpg" routerLink="/aboutUs/membership"
                    description="" />

                <!-- Why partner with us? Card -->
                <AboutCard title="Why partner with us?" image="/images/about/7.jpg" routerLink="/aboutUs/partner" description="" />

                <!-- VET Vehicles Type Card -->
                <AboutCard title="VET Vehicles Type" image="/images/about/8.jpg" routerLink="/aboutUs/vehicle-type" description="" />

                <!-- VET Subsidiaries Card -->
                <AboutCard title="VET Subsidiaries" image="/images/about/9.jpg" routerLink="/aboutUs/subsidiaries" description="" />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import AboutCard from '@/components/ui/AboutCard.vue'

// About component for company information
</script>

<style scoped>
/* Smooth transitions */
.transition {
    transition: all 0.3s ease;
}
</style>

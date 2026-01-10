<script setup lang="ts">
import MilestoneCard from '~/components/ui/MilestoneCard.vue'

interface Milestone {
  year: string
  title: string
  points: string[]
  icon?: string
}

const milestones: Milestone[] = [
  {
    year: "Year 2024",
    title: "Year 2024",
    points: [
      "Year 2024",
      "start using EV trucks"
    ]
  },
  {
    year: "Year 2023",
    title: "Year 2023",
    points: [
      "The year of branches strengthening",
      "The year of expanding franchise"
    ]
  },
  {
    year: "Year 2022",
    title: "Year 2022-Franchise Year",
    points: [
      "Sell franchise to agencies",
      "Start new VET AIR BUS Express",
      "VET vehicle rental services"
    ]
  },
  {
    year: "Year 2021",
    title: "YYear 2021-Historical Year-The Year of D2D",
    points: [
      "Branches and agencies expansion",
      "Investment on trucks",
      "Improved B2B, D2D, COD"
    ]
  },
  {
    year: "YEAR 2020",
    title: "YEAR 2020-Hostroical Year of Covid 19",
    points: [
      "Setup agencies for goods transfer in district and commune",
      "New services: D2D, B2B, and COD"
    ]
  },
  {
    year: "YEAR 2019",
    title: "YEAR 2019-Applied Online System",
    points: [
      "Online system on ticket and logistics",
      "Year of covid 19"
    ]
  },
  {
    year: "YEAR 2018",
    title: "YEAR 2018-The Expansion Year",
    points: [
      "Invested on Van",
      "Invested on Hotel-Bus",
      "Invested on Truck"
    ]
  },
  {
    year: "YEAR 2017",
    title: "YEAR 2017-The Expansion Year",
    points: [
      "Invested on Van",
      "Invested on Hotel-Bus",
      "Invested on Truckk"
    ]
  },
  {
    year: "YEAR 2016",
    title: "YEAR 2016",
    points: [
      "TThe year of software development (off line system)",
      "Development logistic software and ticket software"
    ]
  },
  {
    year: "YEAR 2015",
    title: "YEAR 2015",
    points: [
      "The year of logistic",
      "Started logistics",
      "Invested on truck",
      "Invested on warehouse"
    ]
  },
  {
    year: "YEAR 2014",
    title: "YEAR 2014",
    points: [
      "Invested on day van",
      "Toyotal hiace",
      "Sleeping bus",
      "Hotel bus",
      "Luxury bus"
    ]
  },
  {
    year: "YEAR 2010",
    title: "YEAR 2010",
    points: [
      "Invested on night buses",
      "Rent bus on VCD",
      "Expand direction to PP",
      "SHV, SR, BTB, Poipet"
    ]
  },
  {
    year: "YEAR 2006",
    title: "YEAR 2006",
    points: [
      "Business registration",
      "6 vehicles",
      "Koh kong, sihanouk ville"
    ]
  },
  {
    year: "YEAR 2004",
    title: "YEAR 2004",
    points: [
      "Business started up",
      "Koh kong province",
      "3 vehicles"
    ]
  }
]
</script>

<template>
  <section class="py-16 px-4 bg-gradient-to-b from-blue-600 to-blue-700">
    <div class="container mx-auto">
      <!-- Section Title -->
      <h2 class="text-4xl font-bold text-white text-center mb-4">VET Milestone</h2>
      
      <!-- Section Description -->
      <p class="text-center text-white text-lg mb-12 max-w-2xl mx-auto">
        Vireak Bustham Express Co., Ltd (VET) is a leading logistic and passenger transportation company in Cambodia that has fruitfully been developed itself as the following period
      </p>

      <!-- Milestones Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MilestoneCard 
          v-for="(milestone, index) in milestones" 
          :key="index"
          :milestone="milestone"
        />
      </div>
    </div>
  </section>
</template>

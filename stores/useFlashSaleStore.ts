import { defineStore } from 'pinia';
import type { FlashSaleCard, FlashSaleApiResponse } from '~/types/flashSale';

export const useFlashSaleStore = defineStore('flashSale', {
  state: () => ({
    flashSales: [] as FlashSaleCard[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getAllFlashSales: (state) => state.flashSales,
    isLoading: (state) => state.loading,
  },

  actions: {
    // Fetch flash sales from API (currently using dummy data)
    async fetchFlashSales() {
      this.loading = true;
      this.error = null;

      try {
        // TODO: Replace with actual API call
        // const response = await $fetch<FlashSaleApiResponse>('/api/flash-sales');
        
        // Simulate API response with dummy data
        const response = await this.getDummyData();
        
        this.flashSales = response.flashSales;
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch flash sales';
        console.error('Error fetching flash sales:', err);
      } finally {
        this.loading = false;
      }
    },

    // Dummy data simulation (acts as API response)
    async getDummyData(): Promise<FlashSaleApiResponse> {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Dynamic import for the image
      const brandIcon = '/images/vireak-buntham.png';

      return {
        flashSales: [
          {
            id: 1,
            title: 'Phnom Penh to Poi Pet (07:00)',
            period: '2025-03-05 to 2035-03-31',
            price: 18,
            oldPrice: 23,
            icon: brandIcon,
          },
          {
            id: 2,
            title: 'Phnom Penh to Poi Pet (07:00)',
            period: '2025-03-05 to 2035-03-31',
            price: 20,
            oldPrice: 23,
            icon: brandIcon,
          },
          {
            id: 3,
            title: 'Battambang to Bangkok (08:00)',
            period: '2024-06-01 to 2025-12-31',
            price: 23,
            oldPrice: 27,
            icon: brandIcon,
          },
          {
            id: 4,
            title: 'Bangkok to Poi Pet (11:00)',
            period: '2023-11-17 to 2033-11-30',
            price: 11,
            oldPrice: 15,
            icon: brandIcon,
          },
          {
            id: 5,
            title: 'Siem Reap to Phnom Penh (09:00)',
            period: '2024-05-01 to 2025-10-31',
            price: 15,
            oldPrice: 20,
            icon: brandIcon,
          },
          {
            id: 6,
            title: 'Phnom Penh to Ho Chi Minh City (10:00)',
            period: '2024-07-01 to 2025-12-31',
            price: 25,
            oldPrice: 30,
            icon: brandIcon,
          },
          {
            id: 7,
            title: 'Siem Reap to Bangkok (12:00)',
            period: '2024-08-01 to 2025-11-30',
            price: 30,
            oldPrice: 35,
            icon: brandIcon,
          },
          {
            id: 8,
            title: 'Phnom Penh to Sihanoukville (14:00)',
            period: '2024-09-01 to 2025-12-31',
            price: 12,
            oldPrice: 18,
            icon: brandIcon,
          },
        ],
      };
    },
  },
});

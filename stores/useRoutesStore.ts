import { defineStore } from 'pinia';
import type { Route, RouteApiResponse } from '~/types/route';

export const useRoutesStore = defineStore('routes', {
  state: () => ({
    localRoutes: [] as Route[],
    internationalRoutes: [] as Route[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getAllLocalRoutes: (state) => state.localRoutes,
    getAllInternationalRoutes: (state) => state.internationalRoutes,
    isLoading: (state) => state.loading,
  },

  actions: {
    // Fetch routes from API (currently using dummy data)
    async fetchRoutes() {
      this.loading = true;
      this.error = null;

      try {
        // TODO: Replace with actual API call
        // const response = await $fetch<RouteApiResponse>('/api/routes');
        
        // Simulate API response with dummy data
        const response = await this.getDummyData();
        
        this.localRoutes = response.localRoutes;
        this.internationalRoutes = response.internationalRoutes;
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch routes';
        console.error('Error fetching routes:', err);
      } finally {
        this.loading = false;
      }
    },

    // Dummy data simulation (acts as API response)
    async getDummyData(): Promise<RouteApiResponse> {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return {
        localRoutes: [
          { id: 1, name: 'Phnom Penh - Siem Reap', slug: 'phnom-penh-siem-reap' },
          { id: 2, name: 'Phnom Penh - Rattanakiri', slug: 'phnom-penh-rattanakiri' },
          { id: 3, name: 'Phnom Penh - Kampot', slug: 'phnom-penh-kampot' },
          { id: 4, name: 'Phnom Penh - Shianouk Ville', slug: 'phnom-penh-shianouk-ville' },
          { id: 5, name: 'Phnom Penh - Mondulkiri', slug: 'phnom-penh-mondulkiri' },
          { id: 6, name: 'Phnom Penh - Koh Kong', slug: 'phnom-penh-koh-kong' },
          { id: 7, name: 'Phnom Penh - Poi Pet', slug: 'phnom-penh-poi-pet' },
          { id: 8, name: 'Phnom Penh - Stueng Treng', slug: 'phnom-penh-stueng-treng' },
          { id: 9, name: 'Phnom Penh - Phnom Penh Olympic', slug: 'phnom-penh-olympic' },
          { id: 10, name: 'Phnom Penh - Battambang', slug: 'phnom-penh-battambang' },
          { id: 11, name: 'Phnom Penh - Kampong Cham', slug: 'phnom-penh-kampong-cham' },
          { id: 12, name: 'Phnom Penh - Koh Sdach', slug: 'phnom-penh-koh-sdach' },
        ],
        internationalRoutes: [
          { id: 1, name: 'Phnom Penh - Bangkok', slug: 'phnom-penh-bangkok' },
          { id: 2, name: 'Poi Pet - Bangkok', slug: 'poi-pet-bangkok' },
          { id: 3, name: 'Svay Rieng - Ho Chi Minh', slug: 'svay-rieng-ho-chi-minh' },
          { id: 4, name: 'Siem Reap - Vientiane (Laos)', slug: 'siem-reap-vientiane' },
          { id: 5, name: 'Phnom Penh - Nakasang', slug: 'phnom-penh-nakasang' },
          { id: 6, name: 'Poi Pet - Nakasang', slug: 'poi-pet-nakasang' },
          { id: 7, name: 'Siem Reap - Don Det (4000 island)', slug: 'siem-reap-don-det' },
          { id: 8, name: 'Phnom Penh - Pakse (Laos)', slug: 'phnom-penh-pakse' },
          { id: 9, name: 'Battambang - Bangkok', slug: 'battambang-bangkok' },
          { id: 10, name: 'Shianouk Ville - Bangkok', slug: 'shianouk-ville-bangkok' },
          { id: 11, name: 'Bavet - Ho Chi Minh', slug: 'bavet-ho-chi-minh' },
          { id: 12, name: 'Banteay Meanchey - Vientiane (Laos)', slug: 'banteay-meanchey-vientiane' },
          { id: 13, name: 'Banteay Meanchey - Don Det (4000 island)', slug: 'banteay-meanchey-don-det' },
          { id: 14, name: 'Banteay Meanchey - Pakse (Laos)', slug: 'banteay-meanchey-pakse' },
          { id: 15, name: 'Siem Reap - Bangkok', slug: 'siem-reap-bangkok' },
          { id: 16, name: 'Siem Reap - Nakasang', slug: 'siem-reap-nakasang' },
          { id: 17, name: 'Siem Reap - Pakse (Laos)', slug: 'siem-reap-pakse' },
          { id: 18, name: 'Poi Pet - Vientiane (Laos)', slug: 'poi-pet-vientiane' },
          { id: 19, name: 'Sihanpuk Ville - Nakasang', slug: 'sihanpuk-ville-nakasang' },
          { id: 20, name: 'Sihanpuk Ville - Vientiane (Laos)', slug: 'sihanpuk-ville-vientiane' },
          { id: 21, name: 'Battambang - Vientiane (Laos)', slug: 'battambang-vientiane' },
          { id: 22, name: 'Battambang - Nakasang', slug: 'battambang-nakasang' },
          { id: 23, name: 'Battambang - Don Det (4000 island)', slug: 'battambang-don-det' },
          { id: 24, name: 'Battambang - Pakse (Laos)', slug: 'battambang-pakse' },
          { id: 25, name: 'Phnom Penh - Trat', slug: 'phnom-penh-trat' },
          { id: 26, name: 'Phnom Penh - Ho Chi Minh', slug: 'phnom-penh-ho-chi-minh' },
          { id: 27, name: 'Phnom Penh - Vientiane (Laos)', slug: 'phnom-penh-vientiane' },
          { id: 28, name: 'Phnom Penh - Don Det (4000 island)', slug: 'phnom-penh-don-det' },
        ],
      };
    },
  },
});

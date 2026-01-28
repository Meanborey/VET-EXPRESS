import { defineStore } from 'pinia';
import type { Route, RouteApiResponse } from '~/types/route';
import type { BaseApiResponse, ApiDestination } from '~/types/api';

export const useRoutesStore = defineStore('routes', {
  state: () => ({
    localRoutes: [] as Route[],
    internationalRoutes: [] as Route[],
    destinations: [] as ApiDestination[],
    departureList: [] as ApiDestination[],
    arrivalList: [] as ApiDestination[],
    loading: false,
    error: null as string | null,
    emptyData: false,
  }),

  getters: {
    getAllLocalRoutes: (state) => state.localRoutes,
    getAllInternationalRoutes: (state) => state.internationalRoutes,
    getDepartureList: (state) => state.departureList,
    getArrivalList: (state) => state.arrivalList,
    getDestinationList: (state) => state.arrivalList, // Alias for getArrivalList
    isLoading: (state) => state.loading,
    isEmpty: (state) => state.emptyData,
  },

  actions: {
    // Step 4 & 5: Pinia action → API call (POST form-urlencoded + Bearer)
    async fetchRoutes() {
      this.loading = true;
      this.error = null;

      try {
        const { post } = useApi();
        const response = await post<BaseApiResponse<RouteApiResponse>>('/routes');
        
        // Step 6: State updated → Step 7: UI reactive
        if (response?.data?.data) {
          this.localRoutes = response.data.data.localRoutes || [];
          this.internationalRoutes = response.data.data.internationalRoutes || [];
        } else {
          // Fallback to dummy data
          const dummyData = await this.getDummyData();
          this.localRoutes = dummyData.localRoutes;
          this.internationalRoutes = dummyData.internationalRoutes;
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch routes';
        console.error('API Error, using dummy data:', err);
        const dummyData = await this.getDummyData();
        this.localRoutes = dummyData.localRoutes;
        this.internationalRoutes = dummyData.internationalRoutes;
      } finally {
        this.loading = false;
      }
    },

    // Fetch destinations from API
    async fetchDestinations() {
      this.loading = true;
      this.error = null;

      try {
        const { post } = useApi();
        const response = await post<BaseApiResponse<ApiDestination[]>>('/destinations');
        
        if (response?.data?.data) {
          this.destinations = response.data.data;
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch destinations';
        console.error('Error fetching destinations:', err);
      } finally {
        this.loading = false;
      }
    },

    // Get departure destinations (converted from old axios function)
    // OLD: axios POST to destination/from with searchText & type
    async getDeparture(searchText: string = '', type?: string) {
      this.loading = true;
      this.error = null;

      try {
        const { post } = useApi();
        const response = await post<BaseApiResponse<ApiDestination[]>>('/destination/from', {
          searchText,
          type: type || (typeof localStorage !== 'undefined' ? localStorage.getItem('types') : null)
        });

        // Step 6: State updated → Step 7: UI reactive
        if (response?.data) {
          const result = response.data;
          // Check header.result and header.statusCode like old function
          if (result.code === 200) {
            const body = result.data;
            if (!body || (Array.isArray(body) && body.length === 0)) {
              this.emptyData = true;
              this.departureList = [];
            } else {
              this.emptyData = false;
              this.departureList = body;
            }
          }
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch departure';
        console.error('API Error:', err);
      } finally {
        this.loading = false;
      }
    },

    // Get arrival/destination destinations (matches old getDestination function)
    // OLD: axios POST to destination/to with fromId, searchText & type
    async getDestination(searchText: string = '', fromId?: string | number, type?: string) {
      this.loading = true;
      this.error = null;

      try {
        const { post } = useApi();
        const response = await post<BaseApiResponse<ApiDestination[]>>('/destination/to', {
          fromId,
          searchText,
          type: type || (typeof localStorage !== 'undefined' ? localStorage.getItem('types') : null)
        });

        if (response?.data) {
          const result = response.data;
          if (result.code === 200) {
            const body = result.data;
            if (!body || (Array.isArray(body) && body.length === 0)) {
              this.emptyData = true;
              this.arrivalList = [];
            } else {
              this.emptyData = false;
              this.arrivalList = body;
            }
          }
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch arrival';
        console.error('API Error:', err);
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

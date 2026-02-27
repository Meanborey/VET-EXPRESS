import { defineStore } from 'pinia';
import type {
  FlashSaleCard,
  FlashSaleRequestPayload,
  PromotionListApiResponse,
  RawFlashSaleItem
} from '~/types/flashSale';

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
    toNumber(value: string | number | undefined): number {
      if (typeof value === 'number') return value
      if (typeof value === 'string' && value.trim() !== '') {
        const parsed = Number(value)
        return Number.isNaN(parsed) ? 0 : parsed
      }
      return 0
    },

    buildPeriod(item: RawFlashSaleItem): string {
      if (item.applyPeriod) return item.applyPeriod
      if (item.period) return item.period

      const from = item.startDate || item.fromDate
      const to = item.endDate || item.toDate

      if (from && to) return `${from} - ${to}`
      return from || to || '-'
    },

    normalizeFlashSale(item: RawFlashSaleItem, index: number): FlashSaleCard {
      const currentPrice = this.toNumber(
        item.promotionPrice ?? item.promotionPriceForeigner ?? item.newPrice ?? item.discountPrice ?? item.price
      )
      const oldPrice = this.toNumber(item.oldPrice ?? item.originalPrice ?? item.price ?? item.priceForeigner)

      return {
        id: this.toNumber(item.id) || index + 1,
        title: item.description || item.title || item.name || item.promotionTitle || item.routeName || 'Promotion',
        period: this.buildPeriod(item),
        price: currentPrice,
        oldPrice: oldPrice > 0 ? oldPrice : currentPrice,
        icon: item.icon || item.image || item.logo || '/images/vireak-buntham.png'
      }
    },

    async fetchFlashSales(lang: string) {
      this.loading = true;
      this.error = null;
      this.flashSales = [];

      try {
        const { post } = useApi();

        const payload = {
          type: 1,
          lang
        } satisfies FlashSaleRequestPayload

        const response = await post<PromotionListApiResponse>('/promotion/list', payload);

        if (!response) {
          throw new Error('No response from promotion/list API')
        }

        const responseData = response.data
        console.log('promotion/list response:', responseData)
        const bodyData = Array.isArray(responseData?.body) ? responseData.body : []
        const directData = Array.isArray(responseData?.data) ? responseData.data : []

        const promotions = bodyData.length > 0 ? bodyData : directData

        if (!Array.isArray(promotions) || promotions.length === 0) {
          this.flashSales = []
          return
        }

        this.flashSales = promotions.map((item, index) => this.normalizeFlashSale(item, index))
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch flash sales';
        this.flashSales = [];
        console.error('Error fetching flash sales:', err);
      } finally {
        this.loading = false;
      }
    }
  },
});

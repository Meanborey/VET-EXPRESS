export interface FlashSaleCard {
  id: number;
  title: string;
  period: string;
  price: number;
  oldPrice: number;
  icon: string;
}

export interface FlashSaleRequestPayload {
  type: number;
  lang: string;
}

export interface RawFlashSaleItem {
  id?: number | string;
  description?: string;
  title?: string;
  name?: string;
  promotionTitle?: string;
  routeName?: string;
  applyPeriod?: string;
  period?: string;
  startDate?: string;
  endDate?: string;
  fromDate?: string;
  toDate?: string;
  promotionPrice?: number | string;
  promotionPriceForeigner?: number | string;
  priceForeigner?: number | string;
  price?: number | string;
  newPrice?: number | string;
  discountPrice?: number | string;
  oldPrice?: number | string;
  originalPrice?: number | string;
  icon?: string;
  image?: string;
  logo?: string;
}

export interface PromotionListApiResponse {
  header?: {
    result?: boolean;
    statusCode?: number;
    message?: string;
  };
  body?: RawFlashSaleItem[] | 0;
  data?: RawFlashSaleItem[];
}

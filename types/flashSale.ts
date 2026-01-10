export interface FlashSaleCard {
  id: number;
  title: string;
  period: string;
  price: number;
  oldPrice: number;
  icon: string;
}

export interface FlashSaleApiResponse {
  flashSales: FlashSaleCard[];
}

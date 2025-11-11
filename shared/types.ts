export interface Product {
  _id?: string;
  name: string;
  sku?: string;
  saleRate?: number;
  purchaseRate?: number;
  gstPercent?: number;
  stock?: number;
  createdAt?: string;
}

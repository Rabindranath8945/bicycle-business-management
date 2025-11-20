export interface UserType {
  _id: string; // ✅ must be string
  name: string;
  email: string;
  token: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface CSVProduct {
  sn: number;
  name: string;
  categoryName: string;
  sellingPrice: number;
  purchasePrice: number;
  wholesalePrice: number;
  quantity: number;
  hsn: string;
  gst: number;
  productNumber: string;
}

export interface Product {
  _id?: string;
  name: string;
  categoryId: string;
  categoryName: string;
  category?: string;
  hsn: string;
  gst: number;
  quantity: number;
  productNumber: string;
  sellingPrice: number;
  purchasePrice: number;
  wholesalePrice: number;
  costPrice?: number;
  minStock?: number;
  barcode?: string;
  photo?: string;
}

export interface ProductDTO {
  _id?: string;
  name: string;
  category: string; // ✅ category name as string
  productNumber: string;
  unit: string;
  stock: number;
  sellingPrice: number;
  costPrice: number;
  wholesalePrice: number;
  minStock: number;
  barcode: string;
  photo: string;
  hsn: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface KPI {
  name: string;
  value: number;
  icon: string;
  color: string;
  spark: number[];
}

export interface LowStockItem {
  product: string;
  qty: number;
}
// ✅ Sale item detail (each product sold)
export interface SaleItemDetail {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  profit: number;
}

// ✅ Main Sale record
export interface SaleItem {
  invoiceNo: string;
  customerName: string;
  items: SaleItemDetail[];
  subTotal: number;
  tax: number;
  discount: number;
  total: number;
  profit: number;
  createdAt: string;
}

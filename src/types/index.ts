// Product Type Definition
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  inStock: boolean;
  category: string;
  rating: number;
}

// Cart Item Type Definition
export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: Date;
}

// Order Type Definition
export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  ingredients: string[];
  dietary: string[];
  ageGroup: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingInfo {
  fullName: string;
  address: string;
  phone: string;
  email: string;
  shippingMethod: string;
}
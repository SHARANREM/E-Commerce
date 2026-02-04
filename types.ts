
export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  createdAt: any;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  uid: string;
  items: CartItem[];
}

export interface OrderItem extends CartItem {
  name: string;
  price: number;
}

export interface Order {
  id?: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: any;
}

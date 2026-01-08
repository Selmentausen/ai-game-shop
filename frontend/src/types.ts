export interface Review {
    id?: number;
    text?: string;
    rating: number;
    createdAt?: string;
}

export interface Game {
  id: number;
  title: string;
  price: number;
  description: string;
  content?: string;
  category: string;
  coverImage: string;
  screenshots?: string[];
  tags: string[];
  reviews?: { rating: number; text?: string; id: number }[];
}

export interface CartItem {
  id: number;
  quantity: number;
  game: Game;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
}
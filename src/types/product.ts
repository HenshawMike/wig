import { Timestamp } from 'firebase/firestore';

export type Product = {
  id?: string; // Will be set by Firestore
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  featured: boolean;
  createdAt?: Date | Timestamp;
  updatedAt?: Date | Timestamp;
};

export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & {
  imageFile?: File;
};

export type ProductFilters = {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  searchQuery?: string;
};

import { Category } from ".";

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  expirationDate: Date;
  quantityInStock: number;
  createdAt: Date;
  updatedAt: Date;
}

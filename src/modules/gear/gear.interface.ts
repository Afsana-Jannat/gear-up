export interface ICreateGear {
  name: string;
  brand: string;
  description: string;
  pricePerDay: number;
  stock: number;
  image?: string;
  categoryId: string;
}

export interface IUpdateGear {
  name?: string;
  brand?: string;
  description?: string;
  pricePerDay?: number;
  stock?: number;
  image?: string;
  availability?: 'AVAILABLE' | 'OUT_OF_STOCK';
  categoryId?: string;
}

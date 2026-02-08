import api from '../../lib/axios';
import type { Product, CreateProductRequest } from '../../types';

export async function getProducts(): Promise<Product[]> {
  const res = await api.get<Product[]>('/products');
  return res.data;
}

export async function getProduct(id: string): Promise<Product> {
  const res = await api.get<Product>(`/products/${id}`);
  return res.data;
}

export async function createProduct(data: CreateProductRequest): Promise<Product> {
  const res = await api.post<Product>('/products', data);
  return res.data;
}

export async function updateProduct(
  id: string,
  data: Partial<CreateProductRequest>
): Promise<Product> {
  const res = await api.put<Product>(`/products/${id}`, data);
  return res.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}

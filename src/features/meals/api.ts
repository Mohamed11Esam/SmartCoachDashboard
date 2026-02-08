import api from '../../lib/axios';
import type { FreeNutrition, CreateNutritionRequest } from '../../types';

export async function getMeals(): Promise<FreeNutrition[]> {
  const res = await api.get<FreeNutrition[]>('/nutrition');
  return res.data;
}

export async function createMeal(data: CreateNutritionRequest): Promise<FreeNutrition> {
  const res = await api.post<FreeNutrition>('/nutrition', data);
  return res.data;
}

export async function deleteMeal(id: string): Promise<void> {
  await api.delete(`/nutrition/${id}`);
}

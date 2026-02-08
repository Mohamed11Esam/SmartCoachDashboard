import api from '../../lib/axios';
import type { FreeWorkout, CreateWorkoutRequest } from '../../types';

export async function getWorkouts(): Promise<FreeWorkout[]> {
  const res = await api.get<FreeWorkout[]>('/workouts');
  return res.data;
}

export async function createWorkout(data: CreateWorkoutRequest): Promise<FreeWorkout> {
  const res = await api.post<FreeWorkout>('/workouts', data);
  return res.data;
}

export async function deleteWorkout(id: string): Promise<void> {
  await api.delete(`/workouts/${id}`);
}

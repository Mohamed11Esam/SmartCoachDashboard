import api from '../../lib/axios';
import type { DashboardStats, ChartDataPoint } from '../../types';

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await api.get<DashboardStats>('/admin/dashboard');
  return res.data;
}

export async function getRevenueData(period: '7d' | '30d'): Promise<ChartDataPoint[]> {
  const res = await api.get<ChartDataPoint[]>('/admin/dashboard/revenue', {
    params: { period },
  });
  return res.data;
}

export async function getNewUsersData(period: '7d' | '30d'): Promise<ChartDataPoint[]> {
  const res = await api.get<ChartDataPoint[]>('/admin/dashboard/users-growth', {
    params: { period },
  });
  return res.data;
}

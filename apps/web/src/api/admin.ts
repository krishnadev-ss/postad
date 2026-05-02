import apiClient from './client';
import type { AdminDashboard } from '../types';

export const getDashboard = async (): Promise<AdminDashboard> => {
  const response = await apiClient.get<AdminDashboard>('/admin/dashboard');
  return response.data;
};

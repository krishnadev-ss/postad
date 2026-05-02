import apiClient from './client';
import type { AdSpace, AdSpaceFilters, CreateAdSpaceFormData } from '../types';

export const getAdSpaces = async (filters?: AdSpaceFilters): Promise<AdSpace[]> => {
  const params = new URLSearchParams();
  if (filters?.location) params.append('location', filters.location);
  if (filters?.type) params.append('type', filters.type);
  if (filters?.minPrice) params.append('minPrice', filters.minPrice);
  if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice);
  if (filters?.isAvailable !== undefined) params.append('isAvailable', filters.isAvailable);

  const response = await apiClient.get<AdSpace[]>(`/adspaces?${params.toString()}`);
  return response.data;
};

export const getAdSpace = async (id: string): Promise<AdSpace> => {
  const response = await apiClient.get<AdSpace>(`/adspaces/${id}`);
  return response.data;
};

export const createAdSpace = async (data: CreateAdSpaceFormData): Promise<AdSpace> => {
  const response = await apiClient.post<AdSpace>('/adspaces', data);
  return response.data;
};

export const updateAdSpace = async (
  id: string,
  data: Partial<CreateAdSpaceFormData>,
): Promise<AdSpace> => {
  const response = await apiClient.patch<AdSpace>(`/adspaces/${id}`, data);
  return response.data;
};

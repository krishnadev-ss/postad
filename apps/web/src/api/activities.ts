import apiClient from './client';
import type { Activity, PaginatedResponse } from '../types';

export const getActivities = async (
  page = 1,
  limit = 20,
): Promise<PaginatedResponse<Activity>> => {
  const response = await apiClient.get<PaginatedResponse<Activity>>(
    `/activities?page=${page}&limit=${limit}`,
  );
  return response.data;
};

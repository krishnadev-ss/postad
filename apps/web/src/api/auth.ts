import apiClient from './client';
import type { AuthResponse, LoginFormData, RegisterFormData } from '../types';

export const login = async (data: LoginFormData): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterFormData): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', data);
  return response.data;
};

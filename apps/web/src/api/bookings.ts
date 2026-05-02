import apiClient from './client';
import type { Booking, BookingStatus, CreateBookingFormData, PaginatedResponse } from '../types';

export const createBooking = async (data: CreateBookingFormData): Promise<Booking> => {
  const response = await apiClient.post<Booking>('/bookings', data);
  return response.data;
};

export const getUserBookings = async (): Promise<Booking[]> => {
  const response = await apiClient.get<Booking[]>('/bookings/user');
  return response.data;
};

export const getAllBookings = async (
  page = 1,
  limit = 20,
): Promise<PaginatedResponse<Booking>> => {
  const response = await apiClient.get<PaginatedResponse<Booking>>(
    `/bookings/admin?page=${page}&limit=${limit}`,
  );
  return response.data;
};

export const updateBookingStatus = async (
  id: string,
  status: 'APPROVED' | 'REJECTED',
): Promise<Booking> => {
  const response = await apiClient.patch<Booking>(`/bookings/${id}/status`, { status });
  return response.data;
};

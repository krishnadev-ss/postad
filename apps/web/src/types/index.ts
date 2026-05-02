export type Role = 'ADMIN' | 'ADVERTISER' | 'PROVIDER';
export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  created_at: string;
  provider?: ProviderProfile | null;
}

export interface ProviderProfile {
  id: string;
  user_id: string;
  company_name: string;
  contact_info: string;
}

export interface Provider extends ProviderProfile {
  user: Pick<User, 'id' | 'name' | 'email'>;
  adspaces?: AdSpace[];
  _count?: {
    adspaces: number;
  };
}

export interface AdSpace {
  id: string;
  provider_id: string;
  provider?: {
    id: string;
    company_name: string;
    contact_info: string;
    user?: Pick<User, 'name' | 'email'>;
  };
  title: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  type: string;
  price_per_day: number;
  is_available: boolean;
  created_at: string;
  bookings?: BookingSummary[];
}

export interface BookingSummary {
  id: string;
  start_date: string;
  end_date: string;
  status: BookingStatus;
}

export interface Booking {
  id: string;
  user_id: string;
  adspace_id: string;
  user?: Pick<User, 'id' | 'name' | 'email'>;
  adspace?: {
    id: string;
    title: string;
    location: string;
    type: string;
    price_per_day: number;
  };
  start_date: string;
  end_date: string;
  status: BookingStatus;
  created_at: string;
}

export interface Activity {
  id: string;
  user_id: string;
  user?: Pick<User, 'id' | 'name' | 'email' | 'role'>;
  type: string;
  message: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AdminDashboard {
  stats: {
    total_users: number;
    total_providers: number;
    total_adspaces: number;
    total_bookings: number;
    pending_bookings: number;
    approved_bookings: number;
    rejected_bookings: number;
    approved_revenue: number;
  };
  recent_bookings: Booking[];
  recent_users: User[];
}

export interface AdSpaceFilters {
  location?: string;
  type?: string;
  minPrice?: string;
  maxPrice?: string;
  isAvailable?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface CreateAdSpaceFormData {
  title: string;
  location: string;
  latitude?: number;
  longitude?: number;
  type: string;
  price_per_day: number;
  is_available?: boolean;
}

export interface CreateBookingFormData {
  adspace_id: string;
  start_date: string;
  end_date: string;
}

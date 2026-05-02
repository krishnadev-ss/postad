// Shared types package for POSTAD monorepo
// These types are shared between the web frontend and any other consumers

export type Role = 'ADMIN' | 'ADVERTISER' | 'PROVIDER';
export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  created_at: string;
}

export interface Provider {
  id: string;
  user_id: string;
  company_name: string;
  contact_info: string;
  user?: Pick<User, 'id' | 'name' | 'email'>;
}

export interface AdSpace {
  id: string;
  provider_id: string;
  provider?: Provider;
  title: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  type: string;
  price_per_day: number;
  is_available: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  adspace_id: string;
  user?: Pick<User, 'id' | 'name' | 'email'>;
  adspace?: Pick<AdSpace, 'id' | 'title' | 'location' | 'type' | 'price_per_day'>;
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

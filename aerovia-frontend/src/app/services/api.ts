// ─── Aerovia API Service ──────────────────────────────────────────
// All API calls go through here. Change BASE_URL via .env.local

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

function getToken(): string | null {
  try {
    const raw = localStorage.getItem('aerovia_token');
    return raw || null;
  } catch {
    return null;
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  auth = false
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// ─── Auth ─────────────────────────────────────────────
export const authApi = {
  register: (name: string, email: string, password: string) =>
    request<{ success: boolean; token: string; user: UserProfile }>('POST', '/auth/register', { name, email, password }),

  login: (email: string, password: string) =>
    request<{ success: boolean; token: string; user: UserProfile }>('POST', '/auth/login', { email, password }),

  me: () =>
    request<{ success: boolean; user: UserProfile }>('GET', '/auth/me', undefined, true),
};

// ─── User ─────────────────────────────────────────────
export const userApi = {
  updateProfile: (data: Partial<UserProfile>) =>
    request<{ success: boolean; user: UserProfile }>('PUT', '/user/profile', data, true),

  updatePassword: (currentPassword: string, newPassword: string) =>
    request<{ success: boolean; message: string }>('PUT', '/user/password', { currentPassword, newPassword }, true),
};

// ─── Bookings ─────────────────────────────────────────
export const bookingsApi = {
  getAll: () =>
    request<{ success: boolean; bookings: Booking[] }>('GET', '/bookings', undefined, true),

  create: (data: Partial<Booking>) =>
    request<{ success: boolean; booking: Booking }>('POST', '/bookings', data, true),

  cancel: (id: string) =>
    request<{ success: boolean; booking: Booking }>('PATCH', `/bookings/${id}/cancel`, undefined, true),
};

// ─── Wishlist ─────────────────────────────────────────
export const wishlistApi = {
  getAll: () =>
    request<{ success: boolean; items: WishlistItem[] }>('GET', '/wishlist', undefined, true),

  add: (itemType: string, itemId: string, snapshot: WishlistSnapshot) =>
    request<{ success: boolean; item: WishlistItem }>('POST', '/wishlist', { itemType, itemId, snapshot }, true),

  remove: (itemId: string) =>
    request<{ success: boolean }>('DELETE', `/wishlist/${itemId}`, undefined, true),
};

// ─── Chat ─────────────────────────────────────────────
export const chatApi = {
  send: (messages: ChatMessage[]) =>
    request<{ success: boolean; reply: string }>('POST', '/chat', { messages }),
};

// ─── Data ─────────────────────────────────────────────
export const dataApi = {
  getDestinations: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<{ success: boolean; data: unknown[] }>('GET', `/data/destinations${qs}`);
  },
  getDestination: (id: string) =>
    request<{ success: boolean; data: unknown }>('GET', `/data/destinations/${id}`),
  getFlights: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<{ success: boolean; data: unknown[] }>('GET', `/data/flights${qs}`);
  },
  getHotels: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<{ success: boolean; data: unknown[] }>('GET', `/data/hotels${qs}`);
  },
  getBuses: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<{ success: boolean; data: unknown[] }>('GET', `/data/buses${qs}`);
  },
  getPackages: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<{ success: boolean; data: unknown[] }>('GET', `/data/packages${qs}`);
  },
  getDeals: () =>
    request<{ success: boolean; data: unknown[] }>('GET', '/data/deals'),
  search: (q: string) =>
    request<{ success: boolean; destinations: unknown[]; packages: unknown[] }>('GET', `/data/search?q=${encodeURIComponent(q)}`),
};

// ─── Types ────────────────────────────────────────────
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  dateOfBirth: string;
  passportNumber: string;
  nationality: string;
  travelPreferences: string[];
  avatar: string;
  createdAt: string;
}

export interface Booking {
  _id: string;
  user: string;
  type: 'flight' | 'hotel' | 'bus' | 'package';
  from?: string;
  to?: string;
  flightCode?: string;
  airline?: string;
  departure?: string;
  arrival?: string;
  duration?: string;
  travelDate?: string;
  returnDate?: string;
  passengers?: number;
  extras?: string[];
  basePrice: number;
  totalPrice: number;
  status: 'confirmed' | 'upcoming' | 'cancelled' | 'completed';
  destinationName?: string;
  destinationImage?: string;
  hotel?: string;
  createdAt: string;
}

export interface WishlistItem {
  _id: string;
  itemType: string;
  itemId: string;
  snapshot: WishlistSnapshot;
  createdAt: string;
}

export interface WishlistSnapshot {
  name: string;
  image?: string;
  price?: number;
  tag?: string;
  country?: string;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

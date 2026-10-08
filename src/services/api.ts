import { AuthResponse, FoundItem, UserProfile } from '../types';
import { University } from '../data/kazakhstanUniversities';

const TOKEN_KEY = 'foundly_auth_token_v1';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {}
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Ошибка сервера (${response.status})`);
  }

  return data as T;
}

export const api = {
  // Auth
  async register(params: {
    name: string;
    surname: string;
    email: string;
    password: string;
    universityId: string;
    universityName?: string;
    faculty?: string;
    course?: string;
  }): Promise<AuthResponse> {
    const res = await request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    setStoredToken(res.token);
    return res;
  },

  async login(params: { email: string; password: string }): Promise<AuthResponse> {
    const res = await request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    setStoredToken(res.token);
    return res;
  },

  async getMe(): Promise<{ user: UserProfile }> {
    return request<{ user: UserProfile }>('/api/auth/me');
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<{ user: UserProfile }> {
    return request<{ user: UserProfile }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Universities
  async getUniversities(): Promise<{ universities: University[] }> {
    return request<{ universities: University[] }>('/api/universities');
  },

  // Items
  async getItems(filters?: { universityId?: string; userId?: string }): Promise<{ items: FoundItem[] }> {
    const params = new URLSearchParams();
    if (filters?.universityId && filters.universityId !== 'all') {
      params.set('universityId', filters.universityId);
    }
    if (filters?.userId) {
      params.set('userId', filters.userId);
    }
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request<{ items: FoundItem[] }>(`/api/items${qs}`);
  },

  async createItem(itemData: Partial<FoundItem>): Promise<{ item: FoundItem }> {
    return request<{ item: FoundItem }>('/api/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },

  async updateItem(id: string, updates: Partial<FoundItem>): Promise<{ item: FoundItem }> {
    return request<{ item: FoundItem }>(`/api/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteItem(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/items/${id}`, {
      method: 'DELETE',
    });
  },
};

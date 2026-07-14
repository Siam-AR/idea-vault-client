import type { ApiErrorResponse, AuthResponse, Comment, Idea, User } from '@/types';

export interface ApiCallOptions extends RequestInit {
  headers?: Record<string, string>;
}

export interface IdeaFilters {
  category?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

const getApiBaseUrl = (): string => {
  const explicitUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_SERVER_URL;
  if (explicitUrl) {
    return explicitUrl.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  throw new Error('API base URL is not configured. Set NEXT_PUBLIC_API_URL or NEXT_PUBLIC_SERVER_URL.');
};

export const apiCall = async <T = unknown>(endpoint: string, options: ApiCallOptions = {}): Promise<T> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const apiBaseUrl = getApiBaseUrl();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = new URL(endpoint, apiBaseUrl).toString();
  const response = await fetch(url, {
    ...options,
    headers,
    mode: 'cors',
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type') || '';
    let message = `Request failed with status ${response.status}`;

    if (contentType.includes('application/json')) {
      const error = (await response.json()) as ApiErrorResponse;
      message = error.message || message;
    } else {
      const errorText = await response.text();
      if (errorText) {
        message = errorText;
      }
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
};

export const authAPI = {
  register: (data: Record<string, unknown>) => apiCall<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  login: (data: Record<string, unknown>) => apiCall<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  googleLogin: (data: Record<string, unknown>) => apiCall<AuthResponse>('/auth/google', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getUser: () => apiCall<{ user: User }>('/auth/user'),

  updateUser: (data: Partial<User>) => apiCall<{ user: User }>('/auth/user', {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
};

export const ideasAPI = {
  getFeatured: () => apiCall<Idea[]>('/ideas/featured'),

  getAll: (filters: IdeaFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    return apiCall<Idea[]>(`/ideas?${params.toString()}`);
  },

  getById: (id: string) => apiCall<Idea>(`/ideas/${id}`),

  create: (data: Partial<Idea>) => apiCall<Idea>('/ideas', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id: string, data: Partial<Idea>) => apiCall<Idea>(`/ideas/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  delete: (id: string) => apiCall<void>(`/ideas/${id}`, {
    method: 'DELETE',
  }),

  getUserIdeas: () => apiCall<Idea[]>('/user/ideas'),
};

export const commentsAPI = {
  getByIdeaId: (ideaId: string) => apiCall<Comment[]>(`/comments/${ideaId}`),

  getMyComments: () => apiCall<Comment[]>('/comments/me'),

  create: (data: Partial<Comment>) => apiCall<Comment>('/comments', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id: string, data: Partial<Comment>) => apiCall<Comment>(`/comments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  delete: (id: string) => apiCall<void>(`/comments/${id}`, {
    method: 'DELETE',
  }),
};

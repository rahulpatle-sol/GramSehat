export * from './auth';
export * from './symptoms';
export * from './outbreak';
export * from './medicine';
export * from './records';
export * from './family';
export * from './phc';
export * from './asha';

import { I18n } from 'i18n-js';
import hi from '../i18n/hi.json';
import en from '../i18n/en.json';

const i18n = new I18n({
  hi,
  en,
});

i18n.defaultLocale = 'hi';
i18n.locale = 'hi';
i18n.enableFallback = true;

export default i18n;

const API_BASE_URL = 'http://10.65.109.218:5000/api';

class ApiClient {
  private baseUrl: string = API_BASE_URL;
  private token: string | null = null;

  setToken(token: string | null): void {
    this.token = token;
  }

  clearToken(): void {
    this.token = null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error((data as { error?: string }).error || 'Something went wrong');
    }

    return data as T;
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
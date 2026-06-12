import { apiClient } from '../../app/src/api/client';
import type { AuthResponse, GoogleAuthResponse, ProfileUpdateData, User } from '../types';

export const authApi = {
  googleAuth: async (idToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/google', { idToken });
    return response;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/profile');
    return response;
  },

  updateProfile: async (data: ProfileUpdateData): Promise<User> => {
    const response = await apiClient.put<User>('/auth/profile', data);
    return response;
  },

  updateFcmToken: async (token: string): Promise<{ success: boolean }> => {
    const response = await apiClient.put<{ success: boolean }>('/auth/fcm-token', { fcmToken: token });
    return response;
  },
};

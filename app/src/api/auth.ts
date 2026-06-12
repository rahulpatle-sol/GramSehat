import { apiClient } from './client';
import type { AuthResponse, User, ProfileUpdateData } from '../types';

export const authApi = {
  googleAuth: async (googleToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/google', { googleToken });
    return response as AuthResponse;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get('/auth/profile');
    return response as User;
  },

  updateProfile: async (data: ProfileUpdateData): Promise<User> => {
    const response = await apiClient.put('/auth/profile', data);
    return response as User;
  },

  updateFcmToken: async (token: string): Promise<{ success: boolean }> => {
    const response = await apiClient.put('/auth/fcm-token', { fcmToken: token });
    return response as { success: boolean };
  },
};

export default authApi;

import { apiClient } from '../../app/src/api/client';
import type { AuthResponse, OtpResponse, ProfileUpdateData, User } from '../types';

export const authApi = {
  sendOtp: async (phone: string): Promise<OtpResponse> => {
    const response = await apiClient.post<OtpResponse>('/auth/send-otp', { phone });
    return response;
  },

  verifyOtp: async (phone: string, otp: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/verify-otp', { phone, otp });
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
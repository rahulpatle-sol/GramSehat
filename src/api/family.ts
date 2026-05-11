import { apiClient } from '../../app/src/api/client';
import type { FamilyMember, FamilyMemberData } from '../types';

export const familyApi = {
  getAll: async (): Promise<{ members: FamilyMember[] }> => {
    const response = await apiClient.get<{ members: FamilyMember[] }>('/family');
    return response;
  },

  add: async (data: FamilyMemberData): Promise<{ member: FamilyMember }> => {
    const response = await apiClient.post<{ member: FamilyMember }>('/family', data);
    return response;
  },

  update: async (id: number, data: Partial<FamilyMemberData>): Promise<{ member: FamilyMember }> => {
    const response = await apiClient.put<{ member: FamilyMember }>(`/family/${id}`, data);
    return response;
  },

  delete: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/family/${id}`);
    return response;
  },
};
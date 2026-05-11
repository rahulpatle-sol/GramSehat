import { apiClient } from './index';
import type { FamilyMember, FamilyMemberData } from '../types';

export const familyApi = {
  getAll: async (): Promise<{ members: FamilyMember[] }> => {
    const response = await apiClient.get('/family');
    return response as { members: FamilyMember[] };
  },

  add: async (data: FamilyMemberData): Promise<{ member: FamilyMember }> => {
    const response = await apiClient.post('/family', data);
    return response as { member: FamilyMember };
  },

  update: async (id: number, data: Partial<FamilyMemberData>): Promise<{ member: FamilyMember }> => {
    const response = await apiClient.put(`/family/${id}`, data);
    return response as { member: FamilyMember };
  },

  delete: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/family/${id}`);
    return response as { success: boolean; message: string };
  },
};

export default familyApi;